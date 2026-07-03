import * as THREE from 'three';
import { Team } from '@triforge/shared-ui';

/**
 * Server convention: x,y is the ground plane, z is elevation. Three.js is Y-up, so we
 * map (serverX, serverY, serverZ) → (x: serverX, y: serverZ, z: serverY). Hull yaw (a
 * rotation in the server XY plane) becomes a rotation about the Three Y axis of {@code -yaw}
 * when the mesh's forward is modelled along local +X.
 */
export function serverToThree(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, z, y);
}

export function setFromServer(target: THREE.Vector3, x: number, y: number, z: number): void {
  target.set(x, z, y);
}

/** Y-axis rotation for a hull with forward modelled along local +X. */
export function yawToThreeRotationY(yaw: number): number {
  return -yaw;
}

export const TEAM_COLOR: Record<number, number> = {
  [Team.TEAM_NONE]: 0x9aa0a6,
  [Team.TEAM_RED]: 0xe5484d,
  [Team.TEAM_BLUE]: 0x3b82f6,
};

export function teamColor(team: number | null | undefined): number {
  return TEAM_COLOR[team ?? Team.TEAM_NONE] ?? TEAM_COLOR[Team.TEAM_NONE];
}
