import * as THREE from 'three';

/**
 * Board geometry layout. `pitWorldPosition` is the single source of truth for where a
 * circular pit index (0-11) sits in world space — every render and animation must go
 * through it so meshes and effects can never disagree.
 *
 * Circular order: 0-4 seat 0's dân row (+z side, left→right in +x), 5 quan pit (+x end),
 * 6-10 seat 1's dân row (−z side, +x→−x), 11 quan pit (−x end).
 */

export const PIT_COUNT = 12;
export const QUAN_PIT_A = 5;
export const QUAN_PIT_B = 11;

export const BOARD_TOP_Y = 0.3;
export const DAN_PIT_RADIUS = 0.5;
export const QUAN_PIT_RADIUS = 0.68;

const ROW_Z = 1.0;
const ROW_SPACING = 1.3;
const QUAN_X = 3.6;

export function isQuanPit(pit: number): boolean {
  return pit === QUAN_PIT_A || pit === QUAN_PIT_B;
}

export function ownsPit(seat: number, pit: number): boolean {
  const start = seat === 0 ? 0 : 6;
  return pit >= start && pit < start + 5;
}

export function nextPit(pit: number, step: 1 | -1): number {
  return (pit + step + PIT_COUNT) % PIT_COUNT;
}

export function pitWorldPosition(pit: number): THREE.Vector3 {
  if (pit === QUAN_PIT_A) {
    return new THREE.Vector3(QUAN_X, BOARD_TOP_Y, 0);
  }
  if (pit === QUAN_PIT_B) {
    return new THREE.Vector3(-QUAN_X, BOARD_TOP_Y, 0);
  }
  if (pit <= 4) {
    return new THREE.Vector3((pit - 2) * ROW_SPACING, BOARD_TOP_Y, ROW_Z);
  }
  // Pits 6-10 run right→left so index adjacency stays geometric adjacency.
  return new THREE.Vector3((8 - pit) * ROW_SPACING, BOARD_TOP_Y, -ROW_Z);
}

/** Tray (captured-stone pile) anchor for a seat, at the board edge on that seat's side. */
export function trayWorldPosition(seat: number): THREE.Vector3 {
  return new THREE.Vector3(0, 0.05, seat === 0 ? 2.6 : -2.6);
}

export interface BoardMeshes {
  group: THREE.Group;
  pitMeshes: THREE.Mesh[]; // index = pit, for raycasting
}

export function buildBoard(): BoardMeshes {
  const group = new THREE.Group();

  const slabMaterial = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.85 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.3, 3.4), slabMaterial);
  slab.position.y = BOARD_TOP_Y - 0.15;
  slab.receiveShadow = true;
  group.add(slab);

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9, 0.1, 48),
    new THREE.MeshStandardMaterial({ color: 0x2c2117, roughness: 1 }),
  );
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  group.add(ground);

  const pitMaterial = new THREE.MeshStandardMaterial({ color: 0x6e4520, roughness: 0.9 });
  const quanMaterial = new THREE.MeshStandardMaterial({ color: 0x5c3617, roughness: 0.9 });

  const pitMeshes: THREE.Mesh[] = [];
  for (let pit = 0; pit < PIT_COUNT; pit++) {
    const radius = isQuanPit(pit) ? QUAN_PIT_RADIUS : DAN_PIT_RADIUS;
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 0.82, 0.12, 28),
      (isQuanPit(pit) ? quanMaterial : pitMaterial).clone(),
    );
    const pos = pitWorldPosition(pit);
    mesh.position.set(pos.x, BOARD_TOP_Y - 0.05, pos.z);
    mesh.userData.pitIndex = pit;
    mesh.receiveShadow = true;
    group.add(mesh);
    pitMeshes.push(mesh);
  }

  return { group, pitMeshes };
}
