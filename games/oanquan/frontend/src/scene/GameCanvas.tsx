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
const DRAG_MIN_PX = 18;
const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function directionTowardNeighbor(pit: number, targetPit: number): number | null {
  if (nextPit(pit, 1) === targetPit) return DIR_CLOCKWISE;
  if (nextPit(pit, -1) === targetPit) return DIR_COUNTER_CLOCKWISE;
  return null;
}

function directionFromWorldDrag(
  pit: number,
  worldTarget: THREE.Vector3,
  outDir: THREE.Vector3,
): number | null {
  const origin = pitWorldPosition(pit);
  outDir.set(worldTarget.x - origin.x, 0, worldTarget.z - origin.z);
  if (outDir.lengthSq() < 0.08) return null;
  outDir.normalize();

  const cw = pitWorldPosition(nextPit(pit, 1)).sub(origin).setY(0).normalize();
  const ccw = pitWorldPosition(nextPit(pit, -1)).sub(origin).setY(0).normalize();
  return outDir.dot(cw) >= outDir.dot(ccw) ? DIR_CLOCKWISE : DIR_COUNTER_CLOCKWISE;
}

function buildArrow(color: number): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 1,
  });
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

    // The tabletop photo lives on a ground plane inside the scene (see board.ts), so
    // stones and the photo's carved pits stay aligned in world space. The camera is
    // near-top-down with a slight tilt toward the local player's side.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc9a76e);

    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 60);
    let cameraSeat = 0;
    // Aim at the photo's center (offset from the pit-grid origin) so the plane fills
    // the frame without exposing its edges; on narrow viewports zoom out until the
    // whole board (quan pits included) still fits horizontally.
    const applyCamera = () => {
      const side = cameraSeat === 1 ? -1 : 1;
      const halfWidthPerUnit = Math.tan(THREE.MathUtils.degToRad(24)) * camera.aspect;
      const zoomOut = Math.max(1, 5.7 / (halfWidthPerUnit * 7.55));
      camera.position.set(0.5, 7.4 * zoomOut, 0.33 + 1.5 * side * zoomOut);
      camera.lookAt(0.5, 0, 0.33);
    };
    const seatCamera = (seat: number) => {
      if (seat === cameraSeat) return;
      cameraSeat = seat;
      applyCamera();
    };
    applyCamera();

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

    // ── Picking: hover preview, drag/tap direction, neighbor-pit shortcut ──
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const groundHit = new THREE.Vector3();
    const dragDelta = new THREE.Vector3();
    let selectedPit = -1;
    let hoveredPit = -1;
    let dragPit = -1;
    let dragScreenX = 0;
    let dragScreenY = 0;

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

    const inputLocked = (): boolean => timeline.busy;

    const pitPlayable = (pit: number): boolean =>
      !inputLocked()
      && myTurn()
      && mySeat >= 0
      && ownsPit(mySeat, pit)
      && (authoritative?.pitStones?.[pit] ?? 0) > 0;

    const clearSelection = () => {
      selectedPit = -1;
      arrowCw.visible = false;
      arrowCcw.visible = false;
    };

    const placeArrow = (arrow: THREE.Group, pit: number, step: 1 | -1, emphasis: boolean) => {
      const origin = pitWorldPosition(pit);
      const target = pitWorldPosition(nextPit(pit, step));
      const dir = target.clone().sub(origin).setY(0).normalize();
      arrow.position.set(origin.x + dir.x * 0.75, origin.y + 0.85, origin.z + dir.z * 0.75);
      arrow.setRotationFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir),
      );
      arrow.scale.setScalar(emphasis ? 1 : 0.82);
      arrow.visible = true;
      for (const child of arrow.children) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.opacity = emphasis ? 1 : 0.55;
        material.transparent = !emphasis;
      }
    };

    const showArrows = (pit: number, emphasis = true, direction: number | null = null) => {
      selectedPit = pit;
      if (direction === DIR_CLOCKWISE || direction === null) {
        placeArrow(arrowCw, pit, 1, direction === null ? emphasis : true);
      } else {
        arrowCw.visible = false;
      }
      if (direction === DIR_COUNTER_CLOCKWISE || direction === null) {
        placeArrow(arrowCcw, pit, -1, direction === null ? emphasis : true);
      } else {
        arrowCcw.visible = false;
      }
    };

    const sendMoveForPit = (pit: number, direction: number) => {
      sendMoveRef.current(pit, direction);
      clearSelection();
      dragPit = -1;
    };

    const setPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    };

    const pitUnderPointer = (): number => {
      const hits = raycaster.intersectObjects(board.pitMeshes, false);
      return hits.length > 0 ? (hits[0].object.userData.pitIndex as number) : -1;
    };

    const worldUnderPointer = (): THREE.Vector3 | null => {
      return raycaster.ray.intersectPlane(GROUND_PLANE, groundHit) ? groundHit : null;
    };

    const updateHighlights = () => {
      for (const mesh of board.pitMeshes) {
        const material = mesh.material as THREE.MeshBasicMaterial;
        const pit = mesh.userData.pitIndex as number;
        const highlight =
          pit === selectedPit
          || pit === dragPit
          || (pit === hoveredPit && pitPlayable(pit));
        material.opacity = highlight ? 0.34 : 0;
      }
      renderer.domElement.style.cursor =
        !inputLocked() && hoveredPit >= 0 && pitPlayable(hoveredPit) ? 'grab' : 'default';
    };

    const onPointerMove = (event: PointerEvent) => {
      setPointer(event);
      hoveredPit = pitUnderPointer();

      if (dragPit >= 0) {
        const movedPx = Math.hypot(event.clientX - dragScreenX, event.clientY - dragScreenY);
        const world = worldUnderPointer();
        if (world && movedPx >= DRAG_MIN_PX) {
          const direction = directionFromWorldDrag(dragPit, world, dragDelta);
          showArrows(dragPit, true, direction);
        }
        updateHighlights();
        return;
      }

      if (selectedPit >= 0) {
        updateHighlights();
        return;
      }

      if (hoveredPit >= 0 && pitPlayable(hoveredPit)) {
        showArrows(hoveredPit, false);
      } else {
        clearSelection();
      }
      updateHighlights();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (inputLocked()) return;
      setPointer(event);
      dragScreenX = event.clientX;
      dragScreenY = event.clientY;

      if (selectedPit >= 0) {
        const arrowHit = raycaster.intersectObjects([arrowCw, arrowCcw], true);
        if (arrowHit.length > 0) {
          let node: THREE.Object3D | null = arrowHit[0].object;
          while (node && node.userData.direction === undefined) {
            node = node.parent;
          }
          if (node) {
            sendMoveForPit(selectedPit, node.userData.direction as number);
          }
          return;
        }
      }

      const pit = pitUnderPointer();
      if (pit >= 0 && selectedPit >= 0 && pit !== selectedPit) {
        const direction = directionTowardNeighbor(selectedPit, pit);
        if (direction !== null) {
          sendMoveForPit(selectedPit, direction);
          return;
        }
      }

      if (pit >= 0 && pitPlayable(pit)) {
        dragPit = pit;
        showArrows(pit, true);
      } else {
        dragPit = -1;
        clearSelection();
      }
      updateHighlights();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (dragPit < 0) return;

      const movedPx = Math.hypot(event.clientX - dragScreenX, event.clientY - dragScreenY);
      setPointer(event);

      if (movedPx >= DRAG_MIN_PX) {
        const world = worldUnderPointer();
        if (world) {
          const direction = directionFromWorldDrag(dragPit, world, dragDelta);
          if (direction !== null) {
            sendMoveForPit(dragPit, direction);
            return;
          }
        }
      }

      if (selectedPit === dragPit) {
        dragPit = -1;
        return;
      }

      selectedPit = dragPit;
      showArrows(dragPit, true);
      dragPit = -1;
      updateHighlights();
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      applyCamera();
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
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, background: '#c9a76e' }} />;
}
