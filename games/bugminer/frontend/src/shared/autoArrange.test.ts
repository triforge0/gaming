import { describe, it, expect } from 'vitest';
import { computeAutoArrangePositions, isInsideSetupZone } from './autoArrange';
import { SETUP_ZONE } from './constants';

describe('autoArrange', () => {
  it('assigns a unique position per item id', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const positions = computeAutoArrangePositions(ids);
    expect(positions.size).toBe(4);
    const coords = [...positions.values()];
    const unique = new Set(coords.map((p) => `${p.x},${p.y}`));
    expect(unique.size).toBe(4);
  });

  it('places all positions inside setup zone', () => {
    const ids = Array.from({ length: 24 }, (_, i) => `item-${i}`);
    const positions = computeAutoArrangePositions(ids);
    for (const pos of positions.values()) {
      expect(isInsideSetupZone(pos)).toBe(true);
    }
  });

  it('has enough candidates for chaos mine item count (70)', () => {
    const ids = Array.from({ length: 70 }, (_, i) => `item-${i}`);
    const positions = computeAutoArrangePositions(ids);
    expect(positions.size).toBe(70);
    for (const pos of positions.values()) {
      expect(isInsideSetupZone(pos)).toBe(true);
      expect(pos.y).toBeLessThanOrEqual(SETUP_ZONE.maxY);
    }
  });
});
