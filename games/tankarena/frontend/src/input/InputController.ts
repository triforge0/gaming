import { InputState, MatchPhase, ChatOverlay } from '@triforge/shared-ui';
import { GameBridge } from '../net/GameBridge';

const SEND_HZ = 60;

/**
 * Keyboard-only controls. Keys express rotation *intent*; the server accumulates hull yaw
 * and turret pitch (see the Java MovementSystem). Input is sent at a fixed rate while the
 * match is in the PLAYING phase.
 *
 *   ArrowUp / ArrowDown      hull forward / back
 *   ArrowLeft / ArrowRight   turn hull left / right
 *   Q / E                    turret aim up / down
 *   F                        hold to lock onto the nearest visible enemy (aim assist)
 *   Space                    shoot
 */
export class InputController {
  private readonly pressed = new Set<string>();
  private intervalId = 0;

  constructor(private readonly bridge: GameBridge) {}

  start(): void {
    this.bridge.inputReader = () => this.readInput();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.intervalId = window.setInterval(this.sendTick, 1000 / SEND_HZ);
  }

  stop(): void {
    this.bridge.inputReader = null;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.clearInterval(this.intervalId);
    this.pressed.clear();
  }

  /** Current keys held — read every render frame for smooth rotation. */
  readInput(): InputState {
    const has = (code: string) => this.pressed.has(code);
    return {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      shoot: has('Space'),
      moveForward: has('ArrowUp'),
      moveBackward: has('ArrowDown'),
      turnLeft: has('ArrowLeft'),
      turnRight: has('ArrowRight'),
      aimUp: has('KeyQ'),
      aimDown: has('KeyE'),
      lockTarget: has('KeyF'),
    };
  }

  private sendTick = (): void => {
    if (this.bridge.snapshotUi().phase !== MatchPhase.PLAYING) {
      return;
    }
    const input = this.readInput();
    this.bridge.sendInput(input);
    this.bridge.lastInput = input;
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (ChatOverlay.isInputFocused()) {
      return;
    }
    if (RELEVANT.has(e.code)) {
      e.preventDefault();
      this.pressed.add(e.code);
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (ChatOverlay.isInputFocused()) {
      return;
    }
    this.pressed.delete(e.code);
  };
}

const RELEVANT = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyE', 'Space', 'KeyF',
]);
