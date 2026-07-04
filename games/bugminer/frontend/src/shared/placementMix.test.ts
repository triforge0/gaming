import { describe, it, expect } from 'vitest';
import { buildInterleavedPlacementQueue, autoArrangeInterleavedInPlace } from './placementMix';
import { pickItemScale } from './items';
import { createDefaultItems } from './levels';
import { createSeededRng } from './random';
import type { PlacedItem } from './types';
import { ITEM_DEFINITIONS, createAnimalVelocity } from './items';

function noAdjacentSameType(items: PlacedItem[], maxDist = 55): boolean {
  const placed = items.filter((i) => i.position.x !== 0 || i.position.y !== 0);
  for (let i = 1; i < placed.length; i++) {
    const prev = placed[i - 1];
    const cur = placed[i];
    const d = Math.hypot(cur.position.x - prev.position.x, cur.position.y - prev.position.y);
    if (d < maxDist && cur.type === prev.type) return false;
  }
  return true;
}

describe('buildInterleavedPlacementQueue', () => {
  it('alternates types when possible', () => {
    const items = [
      { id: '1', type: 'gold' as const, position: { x: 0, y: 0 }, collected: false },
      { id: '2', type: 'gold' as const, position: { x: 0, y: 0 }, collected: false },
      { id: '3', type: 'pig' as const, position: { x: 0, y: 0 }, collected: false },
      { id: '4', type: 'rock' as const, position: { x: 0, y: 0 }, collected: false },
    ];
    const queue = buildInterleavedPlacementQueue(items, createSeededRng('mix'));
    const types = queue.map((i) => i.type);
    expect(types[0]).not.toBe(types[1]);
  });
});

describe('autoArrangeInterleavedInPlace', () => {
  it('places chaos mine with mixed neighbours', () => {
    const rng = createSeededRng('interleave-chaos');
    const raw = createDefaultItems('chaos-mine', rng);
    const items: PlacedItem[] = raw.map((item, index) => ({
      ...item,
      scale: pickItemScale(item.type, rng),
      position: { x: 0, y: 0 },
      collected: false,
      velocity: ITEM_DEFINITIONS[item.type].moving ? createAnimalVelocity(index) : undefined,
    }));

    expect(autoArrangeInterleavedInPlace(items, rng)).toBe(true);
    expect(items.filter((i) => i.type === 'pig').length).toBeGreaterThanOrEqual(3);
    expect(items.every((i) => i.position.x !== 0 || i.position.y !== 0)).toBe(true);
  });
});
