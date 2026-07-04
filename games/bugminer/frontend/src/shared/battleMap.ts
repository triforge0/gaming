import { applyBattleJackpotScales, autoArrangeBattleInPlace, BATTLE_JACKPOT_TYPES } from './battleArrange';
import { autoArrangeItemsInPlace } from './autoArrange';
import { createAnimalVelocity, ITEM_DEFINITIONS, pickItemScale } from './items';
import { createDefaultItems } from './levels';
import { createSeededRng } from './random';
import { SETUP_ZONE } from './constants';
import { isValidPlacement } from './placement';
import type { PlacedItem } from './types';

function nudgeJackpotsToCenter(items: PlacedItem[], rng: () => number): void {
  const midY = (SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2;
  for (const item of items) {
    if (!BATTLE_JACKPOT_TYPES.has(item.type)) continue;
    const saved = { ...item.position };
    item.position = { x: 0, y: 0 };
    let placed = false;
    for (let i = 0; i < 80; i++) {
      const pos = {
        x: (rng() - 0.5) * 200,
        y: midY + (rng() - 0.5) * 90,
      };
      if (isValidPlacement(item.id, pos, items)) {
        item.position = { ...pos };
        placed = true;
        break;
      }
    }
    if (!placed) item.position = saved;
  }
}

function buildItems(levelId: string, rng: () => number): PlacedItem[] {
  const raw = createDefaultItems(levelId, rng);
  return raw.map((item, index) => ({
    ...item,
    scale: pickItemScale(item.type, rng),
    position: { x: 0, y: 0 },
    collected: false,
    velocity: ITEM_DEFINITIONS[item.type].moving ? createAnimalVelocity(index) : undefined,
  }));
}

/** One shared battle map — jackpots in center, items interleaved. */
export function buildBattleChallengeLayout(levelId: string, roomSeed: string): PlacedItem[] {
  for (let attempt = 0; attempt < 12; attempt++) {
    const rng = createSeededRng(`battle:${levelId}:${roomSeed}:${attempt}`);
    const items = buildItems(levelId, rng);
    applyBattleJackpotScales(items, rng);

    if (autoArrangeBattleInPlace(items, rng)) {
      return items.map((item) => ({
        ...item,
        position: { ...item.position },
        velocity: item.velocity ? { ...item.velocity } : undefined,
      }));
    }
  }

  const rng = createSeededRng(`battle-fallback:${levelId}:${roomSeed}`);
  const items = buildItems(levelId, rng);
  applyBattleJackpotScales(items, rng);
  if (!autoArrangeItemsInPlace(items, rng)) {
    throw new Error('Không thể sắp xếp map Battle mode.');
  }
  nudgeJackpotsToCenter(items, rng);

  return items.map((item) => ({
    ...item,
    position: { ...item.position },
    velocity: item.velocity ? { ...item.velocity } : undefined,
  }));
}
