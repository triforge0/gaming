import { SETUP_ZONE } from './constants';
import { createDriftVelocity } from './items';
import { createSeededRng } from './random';
import type { ItemType, PlacedItem } from './types';

const CENTER_X = 200;

function isDriftCandidate(type: ItemType): boolean {
  return type === 'gold' || type === 'diamond';
}

/** Enable slow drift on contested center gold/diamond. */
export function applyBattleLootDrift(items: PlacedItem[], roomSeed: string): void {
  const rng = createSeededRng(`drift:${roomSeed}`);
  const midBandMin = SETUP_ZONE.minY + (SETUP_ZONE.maxY - SETUP_ZONE.minY) * 0.28;
  const midBandMax = SETUP_ZONE.minY + (SETUP_ZONE.maxY - SETUP_ZONE.minY) * 0.72;

  items.forEach((item, index) => {
    if (item.collected || (item.position.x === 0 && item.position.y === 0)) return;
    if (!isDriftCandidate(item.type)) return;
    if (Math.abs(item.position.x) > CENTER_X) return;
    if (item.position.y < midBandMin || item.position.y > midBandMax) return;

    const enable = item.type === 'diamond' || rng() < 0.5;
    if (!enable) return;

    item.moving = true;
    item.velocity = createDriftVelocity(index + item.id.length);
  });

  let hasGold = items.some((i) => i.type === 'gold' && i.moving);
  let hasDiamond = items.some((i) => i.type === 'diamond' && i.moving);
  const fallbackRng = createSeededRng(`drift-min:${roomSeed}`);

  if (!hasGold) {
    const candidate = items.find(
      (i) => i.type === 'gold' && !i.collected
        && Math.abs(i.position.x) <= CENTER_X + 80
        && i.position.y >= midBandMin && i.position.y <= midBandMax,
    );
    if (candidate) {
      candidate.moving = true;
      candidate.velocity = createDriftVelocity(fallbackRng() * 1000);
      hasGold = true;
    }
  }
  if (!hasDiamond) {
    const candidate = items.find(
      (i) => i.type === 'diamond' && !i.collected
        && Math.abs(i.position.x) <= CENTER_X + 80
        && i.position.y >= midBandMin && i.position.y <= midBandMax,
    );
    if (candidate) {
      candidate.moving = true;
      candidate.velocity = createDriftVelocity(fallbackRng() * 1000 + 7);
    }
  }
}
