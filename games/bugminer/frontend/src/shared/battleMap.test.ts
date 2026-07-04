import { describe, it, expect } from 'vitest';
import { buildBattleChallengeLayout } from './battleMap';
import { BATTLE_JACKPOT_TYPES } from './battleArrange';
import { SETUP_ZONE } from './constants';

describe('buildBattleChallengeLayout', () => {
  it('produces identical maps for same seed', () => {
    const a = buildBattleChallengeLayout('easy-mine', 'BTL01');
    const b = buildBattleChallengeLayout('easy-mine', 'BTL01');
    expect(a).toEqual(b);
  });

  it('places jackpots near map center', () => {
    const items = buildBattleChallengeLayout('easy-mine', 'CENTER');
    const midX = 0;
    const midY = (SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2;
    const jackpots = items.filter((i) => BATTLE_JACKPOT_TYPES.has(i.type));

    expect(jackpots.length).toBeGreaterThan(0);
    const avgDist = jackpots.reduce(
      (sum, j) => sum + Math.hypot(j.position.x, j.position.y - midY),
      0,
    ) / jackpots.length;
    expect(avgDist).toBeLessThan(180);
  });
});
