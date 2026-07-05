import type { KeyBindings } from './types';

export type ControlAction =
  | 'throttle'
  | 'brake'
  | 'steerLeft'
  | 'steerRight'
  | 'handbrake'
  | 'nitro'
  | 'toggleCamera';

/** Arrow keys always work alongside custom bindings. */
export function resolveControlAction(code: string, bindings: KeyBindings): ControlAction | null {
  if (code === 'ArrowUp') return 'throttle';
  if (code === 'ArrowDown') return 'brake';
  if (code === 'ArrowLeft') return 'steerLeft';
  if (code === 'ArrowRight') return 'steerRight';
  if (code === bindings.toggleCamera) return 'toggleCamera';
  if (code === bindings.steerLeft) return 'steerLeft';
  if (code === bindings.steerRight) return 'steerRight';
  if (code === bindings.handbrake) return 'handbrake';
  if (bindings.throttle.includes(code)) return 'throttle';
  if (bindings.brake.includes(code)) return 'brake';
  if (bindings.nitro.includes(code)) return 'nitro';
  return null;
}
