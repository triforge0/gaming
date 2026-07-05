import * as THREE from 'three';

/** Server XY ground plane + Z elevation → Three.js Y-up. */
export function setFromServer(target: THREE.Vector3, x: number, y: number, z: number): void {
  target.set(x, z, y);
}

export function yawToThreeRotationY(yaw: number): number {
  return -yaw;
}

export function parseColor(hex: string | null | undefined, fallback = 0xe10600): number {
  if (!hex) return fallback;
  const normalized = hex.startsWith('#') ? hex : `#${hex}`;
  const parsed = Number.parseInt(normalized.slice(1), 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function shortestAngleLerp(from: number, to: number, t: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta * t;
}

export function expAlpha(dtMs: number, tauMs: number): number {
  return 1 - Math.exp(-dtMs / Math.max(1, tauMs));
}

export function lerpYaw(current: number, target: number, dtMs: number, tauMs = 60): number {
  const alpha = expAlpha(dtMs, tauMs);
  return shortestAngleLerp(current, target, alpha);
}

export { shortestAngleLerp };
