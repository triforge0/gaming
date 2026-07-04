import * as THREE from 'three';
import { pitWorldPosition, trayWorldPosition } from './board';
import type { VisualBoard } from './stones';

/** Mirrors proto OAQStepType values. */
export const STEP_PICKUP = 1;
export const STEP_SOW = 2;
export const STEP_CAPTURE = 3;
export const STEP_BORROW = 4;
export const STEP_SWEEP = 5;

export interface TraceStep {
  type: number;
  pitIndex: number;
  stones: number;
  quanPieces: number;
  toSeat: number;
}

const BASE_DURATION_MS: Record<number, number> = {
  [STEP_PICKUP]: 180,
  [STEP_SOW]: 130,
  [STEP_CAPTURE]: 340,
  [STEP_BORROW]: 120,
  [STEP_SWEEP]: 160,
};

const MIN_SOW_MS = 42;
const MAX_SOW_MS = 130;

/** Queue too far behind the server → fast-forward instead of playing catch-up theatre. */
const FAST_FORWARD_THRESHOLD = 80;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function arcPoint(from: THREE.Vector3, to: THREE.Vector3, lift: number, t: number, out: THREE.Vector3): void {
  const eased = easeOutCubic(t);
  out.lerpVectors(from, to, eased);
  out.y += Math.sin(t * Math.PI) * lift;
}

/**
 * Replays server move traces against a {@link VisualBoard}. Purely cosmetic: the caller
 * snaps the visual state to the authoritative board whenever the queue drains.
 */
export class MoveTimeline {
  private queue: TraceStep[] = [];
  private active: TraceStep | null = null;
  private elapsed = 0;
  private lastSownPit = -1;
  private pickupBaseline = 0;

  private readonly flyingStone: THREE.Mesh;
  private readonly from = new THREE.Vector3();
  private readonly to = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    this.flyingStone = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0xf2e8d5, roughness: 0.4 }),
    );
    this.flyingStone.visible = false;
    scene.add(this.flyingStone);
  }

  get busy(): boolean {
    return this.active !== null || this.queue.length > 0;
  }

  enqueue(steps: TraceStep[], visual: VisualBoard): void {
    if (steps.length === 0) {
      return;
    }
    this.lastSownPit = -1;
    this.queue.push(...steps);
    if (this.queue.length > FAST_FORWARD_THRESHOLD) {
      this.fastForward(visual);
    }
  }

  /** Applies every queued step instantly (no tweening) and clears the timeline. */
  fastForward(visual: VisualBoard): void {
    if (this.active) {
      this.applyStep(this.active, visual);
      this.active = null;
    }
    for (const step of this.queue) {
      this.applyStep(step, visual);
    }
    this.queue = [];
    this.lastSownPit = -1;
    visual.handLift = 1;
    this.flyingStone.visible = false;
  }

  /** Advances the animation. Returns true when the visual state changed this frame. */
  update(deltaMs: number, visual: VisualBoard): boolean {
    let changed = false;

    if (!this.active && this.queue.length > 0) {
      this.active = this.queue.shift()!;
      this.elapsed = 0;
      this.beginStep(this.active, visual);
      changed = true;
    }
    if (!this.active) {
      return changed;
    }

    this.elapsed += deltaMs;
    const duration = this.stepDuration(this.active);
    const t = Math.min(this.elapsed / duration, 1);
    if (this.animateStep(this.active, t, visual)) {
      changed = true;
    }

    if (t >= 1) {
      this.applyStep(this.active, visual);
      this.flyingStone.visible = false;
      this.active = null;
      changed = true;
    }
    return changed;
  }

  private remainingSowSteps(): number {
    let count = this.active?.type === STEP_SOW ? 1 : 0;
    for (const step of this.queue) {
      if (step.type === STEP_SOW) {
        count += 1;
      }
    }
    return count;
  }

  /** Long sow chains compress so a 20-stone relay stays watchable. */
  private stepDuration(step: TraceStep): number {
    const base = BASE_DURATION_MS[step.type] ?? 200;
    if (step.type !== STEP_SOW) {
      return base;
    }
    const remaining = this.remainingSowSteps();
    if (remaining <= 6) {
      return MAX_SOW_MS;
    }
    return Math.max(MIN_SOW_MS, MAX_SOW_MS * (6 / remaining));
  }

  /** Sets up the flying stone's path; state mutation happens at step end in applyStep. */
  private beginStep(step: TraceStep, visual: VisualBoard): void {
    switch (step.type) {
      case STEP_PICKUP:
        this.pickupBaseline = visual.pitStones[step.pitIndex] ?? 0;
        visual.handLift = 0;
        visual.handPit = step.pitIndex;
        visual.handStones = 0;
        break;
      case STEP_SOW: {
        const fromPit = this.lastSownPit >= 0 ? this.lastSownPit : visual.handPit;
        const fromPos = pitWorldPosition(fromPit >= 0 ? fromPit : step.pitIndex);
        const fromHeight = this.lastSownPit < 0 ? 1.05 * (visual.handLift || 1) : 0.18;
        this.from.set(fromPos.x, fromPos.y + fromHeight, fromPos.z);
        this.to.copy(pitWorldPosition(step.pitIndex));
        this.to.y += 0.12;
        this.flyingStone.visible = true;
        break;
      }
      case STEP_CAPTURE:
      case STEP_SWEEP:
        this.from.copy(pitWorldPosition(step.pitIndex));
        this.from.y += 0.15;
        this.to.copy(trayWorldPosition(step.toSeat));
        this.to.y += 0.12;
        this.flyingStone.visible = true;
        break;
      case STEP_BORROW:
        this.from.copy(trayWorldPosition(step.toSeat));
        this.from.y += 0.12;
        this.to.copy(pitWorldPosition(step.pitIndex));
        this.to.y += 0.12;
        this.flyingStone.visible = true;
        break;
      default:
        break;
    }
  }

  private animateStep(step: TraceStep, t: number, visual: VisualBoard): boolean {
    if (step.type === STEP_PICKUP) {
      const eased = easeOutCubic(t);
      const moved = Math.min(step.stones, Math.round(step.stones * eased));
      visual.pitStones[step.pitIndex] = Math.max(this.pickupBaseline - moved, 0);
      visual.handStones = moved;
      visual.handLift = eased;
      return true;
    }
    if (!this.flyingStone.visible) {
      return false;
    }
    const lift = step.type === STEP_SOW ? 0.42 : 0.85;
    arcPoint(this.from, this.to, lift, t, this.flyingStone.position);
    return false;
  }

  /** Commits the step's effect to the visual counts (mirrors the server resolver). */
  private applyStep(step: TraceStep, visual: VisualBoard): void {
    switch (step.type) {
      case STEP_PICKUP:
        visual.pitStones[step.pitIndex] = Math.max(this.pickupBaseline - step.stones, 0);
        visual.handStones = step.stones;
        visual.handPit = step.pitIndex;
        visual.handLift = 1;
        this.lastSownPit = -1;
        break;
      case STEP_SOW:
        visual.handStones = Math.max(visual.handStones - 1, 0);
        visual.pitStones[step.pitIndex] += 1;
        this.lastSownPit = step.pitIndex;
        break;
      case STEP_CAPTURE:
        visual.pitStones[step.pitIndex] = Math.max(visual.pitStones[step.pitIndex] - step.stones, 0);
        visual.quanPieces[step.pitIndex] = Math.max(visual.quanPieces[step.pitIndex] - step.quanPieces, 0);
        visual.trayDan[step.toSeat as 0 | 1] += step.stones;
        visual.trayQuan[step.toSeat as 0 | 1] += step.quanPieces;
        this.lastSownPit = -1;
        break;
      case STEP_BORROW:
        visual.trayDan[step.toSeat as 0 | 1] = Math.max(visual.trayDan[step.toSeat as 0 | 1] - 1, 0);
        visual.pitStones[step.pitIndex] += 1;
        this.lastSownPit = step.pitIndex;
        break;
      case STEP_SWEEP:
        visual.pitStones[step.pitIndex] = Math.max(visual.pitStones[step.pitIndex] - step.stones, 0);
        visual.trayDan[step.toSeat as 0 | 1] += step.stones;
        this.lastSownPit = -1;
        break;
      default:
        break;
    }
  }
}
