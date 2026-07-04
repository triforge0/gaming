import * as THREE from 'three';
import tableBackground from '../assets/table-background.jpg';

/**
 * Board geometry layout. `pitWorldPosition` is the single source of truth for where a
 * circular pit index (0-11) sits in world space — every render and animation must go
 * through it so meshes and effects can never disagree.
 *
 * Circular order: 0-4 seat 0's dân row (+z side, left→right in +x), 5 quan pit (+x end),
 * 6-10 seat 1's dân row (−z side, +x→−x), 11 quan pit (−x end).
 *
 * The board itself is not modeled: the photographic table background (which contains a
 * carved board) is laid on a ground plane, and the constants below are calibrated to its
 * pixels so pits land exactly in the photo's hollows. Calibration (1536×1024 image):
 * dan pit centers x = 390..1010 step 155, rows y = 370/575, quan centers x = 197/1188;
 * world scale 119.23 px/unit, world origin at pixel (700, 472.5).
 */

export const PIT_COUNT = 12;
export const QUAN_PIT_A = 5;
export const QUAN_PIT_B = 11;

export const BOARD_TOP_Y = 0.05;
export const DAN_PIT_RADIUS = 0.5;
export const QUAN_PIT_RADIUS = 0.68;

const ROW_Z = 0.86;
const ROW_SPACING = 1.3;
const QUAN_X = 4.15;

const PX_PER_UNIT = 119.23;
const IMAGE_W = 1536 / PX_PER_UNIT;
const IMAGE_H = 1024 / PX_PER_UNIT;
// image center (768,512) relative to the world origin pixel (700,472.5)
const IMAGE_OFFSET_X = (768 - 700) / PX_PER_UNIT;
const IMAGE_OFFSET_Z = (512 - 472.5) / PX_PER_UNIT;
const PAPER_COLOR = 0xc9a76e;

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

  // Photographic tabletop (board included) — unlit so the photo shows exactly as-is.
  const texture = new THREE.TextureLoader().load(tableBackground);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(IMAGE_W, IMAGE_H),
    new THREE.MeshBasicMaterial({ map: texture }),
  );
  photo.rotation.x = -Math.PI / 2;
  photo.position.set(IMAGE_OFFSET_X, 0, IMAGE_OFFSET_Z);
  group.add(photo);

  // Plain paper underlay in case the viewport aspect shows past the photo's edges.
  const underlay = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshBasicMaterial({ color: PAPER_COLOR }),
  );
  underlay.rotation.x = -Math.PI / 2;
  underlay.position.y = -0.02;
  group.add(underlay);

  // Invisible shadow catcher just above the photo so stones anchor visually.
  const shadowCatcher = new THREE.Mesh(
    new THREE.PlaneGeometry(IMAGE_W, IMAGE_H),
    new THREE.ShadowMaterial({ opacity: 0.28 }),
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.set(IMAGE_OFFSET_X, 0.005, IMAGE_OFFSET_Z);
  shadowCatcher.receiveShadow = true;
  group.add(shadowCatcher);

  // Pits are pick targets only: invisible until hovered/selected, when GameCanvas
  // raises their opacity into a soft golden glow over the photo's hollows.
  const pitMeshes: THREE.Mesh[] = [];
  for (let pit = 0; pit < PIT_COUNT; pit++) {
    const radius = isQuanPit(pit) ? QUAN_PIT_RADIUS : DAN_PIT_RADIUS;
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 0.04, radius + 0.04, 0.1, 28),
      new THREE.MeshBasicMaterial({
        color: 0xffd77a,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    const pos = pitWorldPosition(pit);
    mesh.position.set(pos.x, 0.01, pos.z);
    mesh.userData.pitIndex = pit;
    group.add(mesh);
    pitMeshes.push(mesh);
  }

  return { group, pitMeshes };
}
