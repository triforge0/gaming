import { SETUP_ZONE } from './constants';
import { isValidPlacement } from './placement';
import { createSeededRng } from './random';
import type { PlacedItem } from './types';

/** Inject 2-3 strategic bedrock obstacles at map center (battle only). */
export function injectBattleBedrock(items: PlacedItem[], roomSeed: string, levelId: string): void {
  const rng = createSeededRng(`bedrock:${roomSeed}:${levelId}`);
  const count = 2 + Math.floor(rng() * 2);
  const midY = (SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2;

  for (let i = 0; i < count; i++) {
    const bedrock: PlacedItem = {
      id: `bedrock-${roomSeed}-${i}`,
      type: 'bedrock',
      position: { x: 0, y: 0 },
      collected: false,
      scale: 2.2,
    };
    items.push(bedrock);

    let placed = false;
    for (let attempt = 0; attempt < 80 && !placed; attempt++) {
      const pos = {
        x: (rng() - 0.5) * 200,
        y: midY + (rng() - 0.5) * 80,
      };
      if (isValidPlacement(bedrock.id, pos, items)) {
        bedrock.position = pos;
        placed = true;
      }
    }
    if (!placed) {
      bedrock.position = { x: (rng() - 0.5) * 100, y: midY };
    }
  }
}
