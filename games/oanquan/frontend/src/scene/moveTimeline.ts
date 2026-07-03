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

const DURATION_MS: Record<number, number> = {
  [STEP_PICKUP]: 220,
  [STEP_SOW]: 150,
  [STEP_CAPTURE]: 380,
  [STEP_BORROW]: 140,
  [STEP_SWEEP]: 180,
};

/** Queue too far behind the server → fast-forward instead of playing catch-up theatre. */
const FAST_FORWARD_THRESHOLD = 80;

function arcPoint(from: THREE.Vector3, to: THREE.Vector3, lift: number, t: number, out: THREE.Vector3): void {
  out.lerpVectors(from, to, t);
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
    const duration = DURATION_MS[this.active.type] ?? 200;
    const t = Math.min(this.elapsed / duration, 1);
    this.animateStep(this.active, t);

    if (t >= 1) {
      this.applyStep(this.active, visual);
      this.flyingStone.visible = false;
      this.active = null;
      changed = true;
    }
    return changed;
  }

  /** Sets up the flying stone's path; state mutation happens at step end in applyStep. */
  private beginStep(step: TraceStep, visual: VisualBoard): void {
    switch (step.type) {
      case STEP_PICKUP:
        // Stones jump straight into the hand cluster at step end; no flight.
        break;
      case STEP_SOW: {
        const hand = pitWorldPosition(visual.handPit >= 0 ? visual.handPit : step.pitIndex);
        this.from.set(hand.x, hand.y + 1.1, hand.z);
        this.to.copy(pitWorldPosition(step.pitIndex));
        this.flyingStone.visible = true;
        break;
      }
      case STEP_CAPTURE:
      case STEP_SWEEP:
        this.from.copy(pitWorldPosition(step.pitIndex));
        this.to.copy(trayWorldPosition(step.toSeat));
        this.flyingStone.visible = true;
        break;
      case STEP_BORROW:
        this.from.copy(trayWorldPosition(step.toSeat));
        this.to.copy(pitWorldPosition(step.pitIndex));
        this.flyingStone.visible = true;
        break;
      default:
        break;
    }
  }

  private animateStep(step: TraceStep, t: number): void {
    if (!this.flyingStone.visible) {
      return;
    }
    const lift = step.type === STEP_SOW ? 0.5 : 1.0;
    arcPoint(this.from, this.to, lift, t, this.flyingStone.position);
  }

  /** Commits the step's effect to the visual counts (mirrors the server resolver). */
  private applyStep(step: TraceStep, visual: VisualBoard): void {
    switch (step.type) {
      case STEP_PICKUP:
        visual.pitStones[step.pitIndex] = Math.max(visual.pitStones[step.pitIndex] - step.stones, 0);
        visual.handStones += step.stones;
        visual.handPit = step.pitIndex;
        break;
      case STEP_SOW:
        visual.handStones = Math.max(visual.handStones - 1, 0);
        visual.pitStones[step.pitIndex] += 1;
        break;
      case STEP_CAPTURE:
        visual.pitStones[step.pitIndex] = Math.max(visual.pitStones[step.pitIndex] - step.stones, 0);
        visual.quanPieces[step.pitIndex] = Math.max(visual.quanPieces[step.pitIndex] - step.quanPieces, 0);
        visual.trayDan[step.toSeat as 0 | 1] += step.stones;
        visual.trayQuan[step.toSeat as 0 | 1] += step.quanPieces;
        break;
      case STEP_BORROW:
        visual.trayDan[step.toSeat as 0 | 1] = Math.max(visual.trayDan[step.toSeat as 0 | 1] - 1, 0);
        visual.pitStones[step.pitIndex] += 1;
        break;
      case STEP_SWEEP:
        visual.pitStones[step.pitIndex] = Math.max(visual.pitStones[step.pitIndex] - step.stones, 0);
        visual.trayDan[step.toSeat as 0 | 1] += step.stones;
        break;
      default:
        break;
    }
  }
}
