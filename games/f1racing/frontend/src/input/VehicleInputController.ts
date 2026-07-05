import type { RaceBridge } from '../net/RaceBridge';
import { readSettings } from '../settings/storage';
import { resolveControlAction } from '../settings/keyBindings';

export interface ControlState {
  steer: number;
  throttle: number;
  brake: number;
  handbrake: boolean;
  nitro: boolean;
}

export class VehicleInputController {
  private readonly keys = new Set<string>();
  private running = false;
  private lastSent = 0;
  private onToggleCamera: (() => void) | null = null;
  private onControls: ((state: ControlState) => void) | null = null;

  constructor(private readonly bridge: RaceBridge) {}

  bindCameraToggle(handler: () => void): void {
    this.onToggleCamera = handler;
  }

  /** Notified with the live control state every animation frame (for camera feel and countdown revs). */
  bindControlsListener(handler: (state: ControlState) => void): void {
    this.onControls = handler;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const action = resolveControlAction(event.code, readSettings().keyBindings);
    if (action === 'toggleCamera') {
      event.preventDefault();
      this.onToggleCamera?.();
      return;
    }
    if (action) {
      // Stop Space/arrows from scrolling the page or re-triggering focused buttons mid-race.
      event.preventDefault();
      this.keys.add(event.code);
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };

  private tick = (now: number): void => {
    if (!this.running) return;
    const controls = this.readControls();
    this.onControls?.(controls);
    if (now - this.lastSent >= 1000 / 30) {
      this.lastSent = now;
      this.bridge.client.sendF1Message({ vehicleInput: controls });
    }
    requestAnimationFrame(this.tick);
  };

  private readControls(): ControlState {
    const bindings = readSettings().keyBindings;
    let steer = 0;
    let throttle = 0;
    let brake = 0;
    let handbrake = false;
    let nitro = false;

    for (const code of this.keys) {
      const action = resolveControlAction(code, bindings);
      if (!action || action === 'toggleCamera') continue;
      if (action === 'steerLeft') steer -= 1;
      if (action === 'steerRight') steer += 1;
      if (action === 'throttle') throttle = 1;
      if (action === 'brake') brake = 1;
      if (action === 'handbrake') handbrake = true;
      if (action === 'nitro') nitro = true;
    }

    return {
      steer: Math.max(-1, Math.min(1, steer)),
      throttle,
      brake,
      handbrake,
      nitro,
    };
  }
}
