import type { InputState } from '@triforge/shared-ui';

const params = new URLSearchParams(window.location.search);
const debugParam = params.get('debug');

/** Enable with `?debug=move` or `?debug` (all debug panels). */
export const MOVE_DEBUG = debugParam === 'move' || params.has('debug');

export interface MoveDebugSnapshot {
  tick: number;
  serverYawDeg: number;
  renderYawDeg: number;
  aimYawDeg: number;
  yawErrorDeg: number;
  aimErrorDeg: number;
  pitchDeg: number;
  pos: { x: number; y: number; z: number };
  input: {
    fwd: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    aimUp: boolean;
    aimDown: boolean;
  };
  posAlpha: number;
  rotAlpha: number;
  lastServerSnapDeg: number;
  leadMs: number;
  pingMs: number;
}

/** Updated every frame from the render loop; React polls this. */
export const moveDebugState: { current: MoveDebugSnapshot | null } = { current: null };

let lastLogMs = 0;

export function logMoveDebug(snapshot: MoveDebugSnapshot): void {
  if (!MOVE_DEBUG) return;
  moveDebugState.current = snapshot;

  const now = performance.now();
  const turning = snapshot.input.left || snapshot.input.right;
  const moving = snapshot.input.fwd || snapshot.input.back;
  if (!turning && !moving) return;
  if (now - lastLogMs < 200) return;
  lastLogMs = now;

  console.info(
    `[move] tick=${snapshot.tick} yaw=${snapshot.renderYawDeg.toFixed(1)}°`
    + ` srv=${snapshot.serverYawDeg.toFixed(1)}° err=${snapshot.yawErrorDeg.toFixed(1)}°`
    + ` aim=${snapshot.aimYawDeg.toFixed(1)}° aimErr=${snapshot.aimErrorDeg.toFixed(1)}°`
    + ` lead=${snapshot.leadMs}ms pitch=${snapshot.pitchDeg.toFixed(1)}°`
    + ` input=${formatInput(snapshot.input)}`
    + ` αrot=${snapshot.rotAlpha.toFixed(2)} snap=${snapshot.lastServerSnapDeg.toFixed(1)}°`,
  );
}

function formatInput(input: MoveDebugSnapshot['input']): string {
  const parts: string[] = [];
  if (input.fwd) parts.push('↑');
  if (input.back) parts.push('↓');
  if (input.left) parts.push('←');
  if (input.right) parts.push('→');
  if (input.aimUp) parts.push('Q');
  if (input.aimDown) parts.push('E');
  return parts.join('') || '—';
}

export function inputFlags(input: InputState | null): MoveDebugSnapshot['input'] {
  return {
    fwd: input?.moveForward ?? false,
    back: input?.moveBackward ?? false,
    left: input?.turnLeft ?? false,
    right: input?.turnRight ?? false,
    aimUp: input?.aimUp ?? false,
    aimDown: input?.aimDown ?? false,
  };
}

export function turnInputAxis(input: InputState | null): -1 | 0 | 1 {
  if (!input) return 0;
  if (input.turnLeft && !input.turnRight) return -1;
  if (input.turnRight && !input.turnLeft) return 1;
  return 0;
}

export function aimInputAxis(input: InputState | null): -1 | 0 | 1 {
  if (!input) return 0;
  if (input.aimUp && !input.aimDown) return 1;
  if (input.aimDown && !input.aimUp) return -1;
  return 0;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function yawErrorDeg(renderYawRad: number, serverYawRad: number): number {
  let delta = serverYawRad - renderYawRad;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return radToDeg(delta);
}
