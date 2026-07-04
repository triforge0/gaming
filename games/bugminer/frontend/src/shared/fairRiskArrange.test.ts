import { describe, it, expect } from 'vitest';
import { buildFairChallengeLayout } from './fairMap';
import {
  autoArrangeFairRiskRewardInPlace,
  GUARD_TYPES,
  JACKPOT_TYPES,
} from './fairRiskArrange';
import { getItemScale, pickItemScale } from './items';
import { createDefaultItems } from './levels';
import { createSeededRng } from './random';
import { depthBand } from './autoArrange';
import type { PlacedItem } from './types';
import { ITEM_DEFINITIONS, createAnimalVelocity } from './items';

function buildTestItems(levelId: string, seed: string): PlacedItem[] {
  const rng = createSeededRng(seed);
  return createDefaultItems(levelId, rng).map((item, index) => ({
    ...item,
    scale: pickItemScale(item.type, rng),
    position: { x: 0, y: 0 },
    collected: false,
    velocity: ITEM_DEFINITIONS[item.type].moving ? createAnimalVelocity(index) : undefined,
  }));
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

describe('autoArrangeFairRiskRewardInPlace', () => {
  it('places jackpots in the deep band', () => {
    const items = buildTestItems('easy-mine', 'risk-deep');
    expect(autoArrangeFairRiskRewardInPlace(items)).toBe(true);
    const deep = depthBand('deep');
    for (const item of items.filter((i) => JACKPOT_TYPES.has(i.type))) {
      expect(item.position.y).toBeGreaterThanOrEqual(deep.minY - 1);
    }
  });

  it('rings jackpots with guard hazards nearby', () => {
    const items = buildTestItems('chaos-mine', 'risk-guards');
    expect(autoArrangeFairRiskRewardInPlace(items)).toBe(true);

    const jackpots = items.filter((i) => JACKPOT_TYPES.has(i.type));
    const guards = items.filter((i) => GUARD_TYPES.has(i.type) && i.position.y > 0);
    expect(jackpots.length).toBeGreaterThan(0);
    expect(guards.length).toBeGreaterThan(0);

    for (const jackpot of jackpots) {
      const nearby = guards.filter((g) => dist(g.position, jackpot.position) < 95);
      expect(nearby.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('buildFairChallengeLayout — risk/reward', () => {
  it('produces identical high-risk maps for same seed', () => {
    const a = buildFairChallengeLayout('rock-mine', 'RISK01');
    const b = buildFairChallengeLayout('rock-mine', 'RISK01');
    expect(a).toEqual(b);
  });

  it('boosts big gold jackpot scale for fair payouts', () => {
    const items = buildFairChallengeLayout('easy-mine', 'SCALE-TEST');
    const bigGold = items.filter((i) => i.type === 'bigGold');
    expect(bigGold.some((i) => getItemScale(i) >= 1.35)).toBe(true);
  });
});
