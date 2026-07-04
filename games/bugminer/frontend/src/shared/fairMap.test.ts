import { describe, it, expect } from 'vitest';
import { buildFairChallengeLayout } from './fairMap';

describe('buildFairChallengeLayout', () => {
  it('produces identical layout for same room seed', () => {
    const a = buildFairChallengeLayout('easy-mine', 'ROOM01');
    const b = buildFairChallengeLayout('easy-mine', 'ROOM01');
    expect(a).toEqual(b);
  });

  it('can differ between rooms', () => {
    const a = buildFairChallengeLayout('easy-mine', 'ROOM01');
    const b = buildFairChallengeLayout('easy-mine', 'ROOM02');
    expect(a).not.toEqual(b);
  });

  it('places every item on the map', () => {
    const items = buildFairChallengeLayout('chaos-mine', 'FAIR-TEST');
    expect(items.length).toBeGreaterThan(30);
    expect(items.every((i) => i.position.x !== 0 || i.position.y !== 0)).toBe(true);
  });
});
