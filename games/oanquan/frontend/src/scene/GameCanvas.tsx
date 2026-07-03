import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { toNum } from '@triforge/shared-ui';
import type { IOAQBoardState, IOAQMoveResult } from '@triforge/shared-ui';
import { buildBoard, nextPit, ownsPit, pitWorldPosition } from './board';
import { StoneField, visualFromBoard, type VisualBoard } from './stones';
import { MoveTimeline, type TraceStep } from './moveTimeline';

export interface GameCanvasApi {
  pushBoard(board: IOAQBoardState): void;
  pushMoveResult(result: IOAQMoveResult): void;
}

interface GameCanvasProps {
  selfPlayerId: number;
  onReady: (api: GameCanvasApi) => void;
  sendMove: (pitIndex: number, direction: number) => void;
}

const DIR_CLOCKWISE = 1;
const DIR_COUNTER_CLOCKWISE = 2;

function buildArrow(color: number): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 10), material);
  shaft.rotation.z = Math.PI / 2;
  group.add(shaft);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 12), material);
  head.rotation.z = -Math.PI / 2;
  head.position.x = 0.4;
  group.add(head);
  return group;
}

/**
 * The 3D board. All game state arrives via {@link GameCanvasApi}; the authoritative
 * board always wins — animation is cosmetic and snap-corrected when the queue drains.
 */
export function GameCanvas({ selfPlayerId, onReady, sendMove }: GameCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sendMoveRef = useRef(sendMove);
  sendMoveRef.current = sendMove;
  const selfIdRef = useRef(selfPlayerId);
  selfIdRef.current = selfPlayerId;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14100b);
    scene.fog = new THREE.Fog(0x14100b, 14, 26);

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 60);
    let cameraSeat = -1;
    const seatCamera = (seat: number) => {
      if (seat === cameraSeat) return;
      cameraSeat = seat;
      const side = seat === 1 ? -1 : 1;
      camera.position.set(0, 8.0, 8.6 * side);
      camera.lookAt(0, 0, 0);
    };
    seatCamera(0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff2dd, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(5, 10, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    scene.add(sun);

    const board = buildBoard();
    scene.add(board.group);

    const stones = new StoneField(scene);
    const timeline = new MoveTimeline(scene);

    // ── Mutable game state owned by the render loop ──
    let visual: VisualBoard = visualFromBoard(new Array(12).fill(0), [0, 0], []);
    let authoritative: IOAQBoardState | null = null;
    let pendingBoard: IOAQBoardState | null = null;
    let mySeat = -1;

    const snapToBoard = (state: IOAQBoardState) => {
      const scores = (state.scores ?? []).map((s) => ({
        capturedDan: s.capturedDan ?? 0,
        capturedQuan: s.capturedQuan ?? 0,
      }));
      visual = visualFromBoard(state.pitStones ?? [], state.quanPieces ?? [], scores);
      stones.render(visual);
    };

    const seatOfSelf = (state: IOAQBoardState): number => {
      for (const score of state.scores ?? []) {
        if (toNum(score.playerId) === selfIdRef.current) {
          return score.seat ?? 0;
        }
      }
      return -1;
    };

    const api: GameCanvasApi = {
      pushBoard(state) {
        authoritative = state;
        const seat = seatOfSelf(state);
        if (seat >= 0) {
          mySeat = seat;
          seatCamera(seat);
        }
        if (timeline.busy) {
          pendingBoard = state;
        } else {
          snapToBoard(state);
        }
      },
      pushMoveResult(result) {
        const steps: TraceStep[] = (result.steps ?? []).map((s) => ({
          type: s.type ?? 0,
          pitIndex: s.pitIndex ?? 0,
          stones: s.stones ?? 0,
          quanPieces: s.quanPieces ?? 0,
          toSeat: s.toSeat ?? 0,
        }));
        timeline.enqueue(steps, visual);
      },
    };
    onReady(api);

    // ── Picking: hover highlight, pit selection, direction arrows ──
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let selectedPit = -1;
    const arrowCw = buildArrow(0x38b26b);
    const arrowCcw = buildArrow(0x3878b2);
    arrowCw.visible = false;
    arrowCcw.visible = false;
    arrowCw.userData.direction = DIR_CLOCKWISE;
    arrowCcw.userData.direction = DIR_COUNTER_CLOCKWISE;
    scene.add(arrowCw);
    scene.add(arrowCcw);

    const myTurn = (): boolean =>
      !!authoritative
      && !authoritative.gameOver
      && toNum(authoritative.currentPlayerId) === selfIdRef.current;

    const pitPlayable = (pit: number): boolean =>
      myTurn() && mySeat >= 0 && ownsPit(mySeat, pit) && (authoritative?.pitStones?.[pit] ?? 0) > 0;

    const clearSelection = () => {
      selectedPit = -1;
      arrowCw.visible = false;
      arrowCcw.visible = false;
    };

    const showArrows = (pit: number) => {
      selectedPit = pit;
      const origin = pitWorldPosition(pit);
      for (const [arrow, step] of [[arrowCw, 1], [arrowCcw, -1]] as Array<[THREE.Group, 1 | -1]>) {
        const target = pitWorldPosition(nextPit(pit, step));
        const dir = target.clone().sub(origin).setY(0).normalize();
        arrow.position.set(origin.x + dir.x * 0.75, origin.y + 0.85, origin.z + dir.z * 0.75);
        arrow.setRotationFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir),
        );
        arrow.visible = true;
      }
    };

    const setPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    };

    const onPointerMove = (event: PointerEvent) => {
      setPointer(event);
      const hits = raycaster.intersectObjects(board.pitMeshes, false);
      const hovered = hits.length > 0 ? (hits[0].object.userData.pitIndex as number) : -1;
      for (const mesh of board.pitMeshes) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        const pit = mesh.userData.pitIndex as number;
        const highlight = pit === selectedPit || (pit === hovered && pitPlayable(pit));
        material.emissive.setHex(highlight ? 0x8a6a30 : 0x000000);
      }
      renderer.domElement.style.cursor = hovered >= 0 && pitPlayable(hovered) ? 'pointer' : 'default';
    };

    const onPointerDown = (event: PointerEvent) => {
      setPointer(event);

      if (selectedPit >= 0) {
        const arrowHit = raycaster.intersectObjects([arrowCw, arrowCcw], true);
        if (arrowHit.length > 0) {
          let node: THREE.Object3D | null = arrowHit[0].object;
          while (node && node.userData.direction === undefined) {
            node = node.parent;
          }
          if (node) {
            sendMoveRef.current(selectedPit, node.userData.direction as number);
          }
          clearSelection();
          return;
        }
      }

      const hits = raycaster.intersectObjects(board.pitMeshes, false);
      const pit = hits.length > 0 ? (hits[0].object.userData.pitIndex as number) : -1;
      if (pit >= 0 && pitPlayable(pit)) {
        showArrows(pit);
      } else {
        clearSelection();
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let disposed = false;
    let lastTime = performance.now();
    stones.render(visual);

    const loop = (now: number) => {
      if (disposed) return;
      const delta = Math.min(now - lastTime, 100);
      lastTime = now;

      const changed = timeline.update(delta, visual);
      if (changed) {
        stones.render(visual);
      }
      if (!timeline.busy && pendingBoard) {
        snapToBoard(pendingBoard);
        pendingBoard = null;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />;
}
