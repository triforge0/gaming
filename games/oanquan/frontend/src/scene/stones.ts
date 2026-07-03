import * as THREE from 'three';
import {
  BOARD_TOP_Y,
  DAN_PIT_RADIUS,
  PIT_COUNT,
  QUAN_PIT_A,
  QUAN_PIT_B,
  QUAN_PIT_RADIUS,
  isQuanPit,
  pitWorldPosition,
  trayWorldPosition,
} from './board';

/**
 * Everything the stone renderer needs to draw one frame. The animation timeline mutates
 * a copy of this between authoritative boards; `hand` is the mover's lifted stones,
 * drawn floating above `handPit`.
 */
export interface VisualBoard {
  pitStones: number[]; // 12
  quanPieces: number[]; // 12-indexed, only 5/11 used
  trayDan: [number, number];
  trayQuan: [number, number];
  handStones: number;
  handPit: number;
}

export function visualFromBoard(pitStones: number[], quanPieces: number[], scores: Array<{ capturedDan: number; capturedQuan: number }>): VisualBoard {
  const quan = new Array(PIT_COUNT).fill(0);
  quan[QUAN_PIT_A] = quanPieces[0] ?? 0;
  quan[QUAN_PIT_B] = quanPieces[1] ?? 0;
  return {
    pitStones: [...pitStones],
    quanPieces: quan,
    trayDan: [Math.max(scores[0]?.capturedDan ?? 0, 0), Math.max(scores[1]?.capturedDan ?? 0, 0)],
    trayQuan: [scores[0]?.capturedQuan ?? 0, scores[1]?.capturedQuan ?? 0],
    handStones: 0,
    handPit: -1,
  };
}

/**
 * Deterministic pseudo-random offset for stone `slot` inside `pit` — seeded so every
 * client lays identical piles and re-renders never shuffle stones. No Math.random() here.
 */
function seededOffset(pit: number, slot: number): { dx: number; dz: number; dy: number } {
  let h = (pit * 73856093) ^ (slot * 19349663);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  h ^= h >>> 15;
  const angle = ((h & 0xffff) / 0xffff) * Math.PI * 2;
  const radiusScale = (((h >>> 16) & 0xffff) / 0xffff) * 0.72;
  const maxR = (isQuanPit(pit) ? QUAN_PIT_RADIUS : DAN_PIT_RADIUS) - 0.14;
  const ring = Math.floor(slot / 12); // pile upward once a layer fills
  return {
    dx: Math.cos(angle) * maxR * radiusScale,
    dz: Math.sin(angle) * maxR * radiusScale,
    dy: 0.05 + ring * 0.1,
  };
}

const MAX_DAN_INSTANCES = 320;
const MAX_QUAN_INSTANCES = 4;
const TRAY_DISPLAY_CAP = 40;

export class StoneField {
  readonly danMesh: THREE.InstancedMesh;
  readonly quanMesh: THREE.InstancedMesh;

  private readonly dummy = new THREE.Object3D();

  constructor(scene: THREE.Scene) {
    const danGeometry = new THREE.SphereGeometry(0.11, 12, 10);
    const danMaterial = new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.6 });
    this.danMesh = new THREE.InstancedMesh(danGeometry, danMaterial, MAX_DAN_INSTANCES);
    this.danMesh.castShadow = true;
    this.danMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const quanGeometry = new THREE.SphereGeometry(0.24, 16, 12);
    const quanMaterial = new THREE.MeshStandardMaterial({ color: 0xb03a2e, roughness: 0.45 });
    this.quanMesh = new THREE.InstancedMesh(quanGeometry, quanMaterial, MAX_QUAN_INSTANCES);
    this.quanMesh.castShadow = true;
    this.quanMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    scene.add(this.danMesh);
    scene.add(this.quanMesh);
  }

  /** Rewrites all instance matrices from the visual state (~70 instances: cheap). */
  render(state: VisualBoard): void {
    let dan = 0;
    let quan = 0;

    const placeDan = (x: number, y: number, z: number) => {
      if (dan >= MAX_DAN_INSTANCES) return;
      this.dummy.position.set(x, y, z);
      this.dummy.updateMatrix();
      this.danMesh.setMatrixAt(dan++, this.dummy.matrix);
    };

    for (let pit = 0; pit < PIT_COUNT; pit++) {
      const base = pitWorldPosition(pit);
      for (let slot = 0; slot < state.pitStones[pit]; slot++) {
        const off = seededOffset(pit, slot);
        placeDan(base.x + off.dx, base.y + off.dy, base.z + off.dz);
      }
      for (let piece = 0; piece < state.quanPieces[pit]; piece++) {
        if (quan >= MAX_QUAN_INSTANCES) break;
        this.dummy.position.set(base.x, base.y + 0.16, base.z + piece * 0.1);
        this.dummy.updateMatrix();
        this.quanMesh.setMatrixAt(quan++, this.dummy.matrix);
      }
    }

    for (let seat = 0; seat < 2; seat++) {
      const tray = trayWorldPosition(seat);
      const shown = Math.min(state.trayDan[seat], TRAY_DISPLAY_CAP);
      for (let slot = 0; slot < shown; slot++) {
        // Tray uses pit index 12+seat as the seed namespace.
        const off = seededOffset(12 + seat, slot);
        placeDan(tray.x + off.dx * 2.2, tray.y + off.dy, tray.z + off.dz * 0.8);
      }
      for (let piece = 0; piece < state.trayQuan[seat]; piece++) {
        if (quan >= MAX_QUAN_INSTANCES) break;
        this.dummy.position.set(tray.x + 1.4 + piece * 0.3, tray.y + 0.2, tray.z);
        this.dummy.updateMatrix();
        this.quanMesh.setMatrixAt(quan++, this.dummy.matrix);
      }
    }

    // Lifted hand stones float in a small cluster above the source pit.
    if (state.handStones > 0 && state.handPit >= 0) {
      const base = pitWorldPosition(state.handPit);
      const shown = Math.min(state.handStones, 20);
      for (let slot = 0; slot < shown; slot++) {
        const off = seededOffset(14, slot);
        placeDan(base.x + off.dx * 0.6, base.y + 1.1 + off.dy * 0.6, base.z + off.dz * 0.6);
      }
    }

    this.danMesh.count = dan;
    this.quanMesh.count = quan;
    this.danMesh.instanceMatrix.needsUpdate = true;
    this.quanMesh.instanceMatrix.needsUpdate = true;
  }
}

export { BOARD_TOP_Y };
