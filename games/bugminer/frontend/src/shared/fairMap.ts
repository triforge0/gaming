import { applyFairJackpotScales, autoArrangeFairRiskRewardInPlace } from './fairRiskArrange';
import { autoArrangeItemsInPlace } from './autoArrange';
import { createAnimalVelocity, ITEM_DEFINITIONS, pickItemScale } from './items';
import { createDefaultItems } from './levels';
import { createSeededRng } from './random';
import type { PlacedItem } from './types';

function buildItems(levelId: string, rng: () => number): PlacedItem[] {
  const raw = createDefaultItems(levelId, rng);
  return raw.map((item, index) => {
    const scale = pickItemScale(item.type, rng);
    const seed = index + item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return {
      ...item,
      scale,
      position: { x: 0, y: 0 },
      collected: false,
      velocity: ITEM_DEFINITIONS[item.type].moving ? createAnimalVelocity(seed) : undefined,
    };
  });
}

/** One identical map for both players in fair mode (seeded by room + level). */
export function buildFairChallengeLayout(levelId: string, roomSeed: string): PlacedItem[] {
  for (let attempt = 0; attempt < 16; attempt++) {
    const rng = createSeededRng(`fair:${roomSeed}:${levelId}:${attempt}`);
    const items = buildItems(levelId, rng);
    applyFairJackpotScales(items, rng);

    const arranged =
      autoArrangeFairRiskRewardInPlace(items, rng)
      || autoArrangeItemsInPlace(items, rng);

    if (arranged) {
      return items.map((item) => ({
        ...item,
        position: { ...item.position },
        velocity: item.velocity ? { ...item.velocity } : undefined,
      }));
    }
  }

  throw new Error('Không thể tạo map fair mode cho level này.');
}
