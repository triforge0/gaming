import { SETUP_ZONE } from './constants';
import { getItemScale } from './items';
import { isValidPlacement } from './placement';
import {
  autoArrangeInterleavedInPlace,
  buildInterleavedPlacementQueue,
  generateMixedGridCandidates,
  tryPlaceAtCandidates,
  tryPlaceRandomInZone,
} from './placementMix';
import type { ItemType, PlacedItem, Vec2 } from './types';

/** Classic Gold Miner depth bands — heavy loot sinks to the bottom row. */
export const PLACEMENT_DEPTH: Record<ItemType, 'shallow' | 'mid' | 'deep'> = {
  diamond: 'shallow',
  gold: 'mid',
  bigGold: 'deep',
  rock: 'deep',
  mysteryBag: 'mid',
  poison: 'mid',
  mouse: 'mid',
  pig: 'mid',
  strengthDrink: 'shallow',
};

/** Surface line in game coords — gap between winch and first items. */
export const SURFACE_LINE_Y = 58;

const COLS = 16;
const COL_SPACING = 72;
const ROW_SPACING = 44;
const START_X = SETUP_ZONE.minX + 24;
const START_Y = SETUP_ZONE.minY + 6;

export function depthBand(depth: 'shallow' | 'mid' | 'deep'): { minY: number; maxY: number } {
  const span = SETUP_ZONE.maxY - SETUP_ZONE.minY;
  const shallowEnd = SETUP_ZONE.minY + span * 0.3;
  const midEnd = SETUP_ZONE.minY + span * 0.62;
  if (depth === 'shallow') return { minY: SETUP_ZONE.minY, maxY: shallowEnd };
  if (depth === 'mid') return { minY: shallowEnd, maxY: midEnd };
  return { minY: midEnd, maxY: SETUP_ZONE.maxY };
}

/** Candidates inside a depth band (classic horizontal spread). */
export function generateTieredPlacementCandidates(type: ItemType): Vec2[] {
  const band = depthBand(PLACEMENT_DEPTH[type]);
  const candidates: Vec2[] = [];
  const rows = 5;
  const cols = 11;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tx = cols <= 1 ? 0.5 : col / (cols - 1);
      const ty = rows <= 1 ? 0.5 : row / (rows - 1);
      candidates.push({
        x: SETUP_ZONE.minX + 24 + tx * (SETUP_ZONE.maxX - SETUP_ZONE.minX - 48),
        y: band.minY + 8 + ty * (band.maxY - band.minY - 16),
      });
    }
  }
  return candidates;
}

/** Scan grid candidates for auto-arrange (fits large levels e.g. Chaos Mine). */
export function generatePlacementCandidates(): Vec2[] {
  const candidates: Vec2[] = [];
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < COLS; col++) {
      const pos = {
        x: START_X + col * COL_SPACING,
        y: START_Y + row * ROW_SPACING,
      };
      if (isInsideSetupZone(pos)) {
        candidates.push(pos);
      }
    }
  }
  return candidates;
}

/** Grid layout for auto-arrange — positions stay inside setup zone. */
export function computeAutoArrangePositions(itemIds: string[]): Map<string, Vec2> {
  const positions = new Map<string, Vec2>();
  const candidates = generatePlacementCandidates();

  itemIds.forEach((id, idx) => {
    positions.set(id, candidates[idx] ?? candidates[candidates.length - 1]);
  });

  return positions;
}

export function isInsideSetupZone(position: Vec2): boolean {
  return (
    position.x >= SETUP_ZONE.minX &&
    position.x <= SETUP_ZONE.maxX &&
    position.y >= SETUP_ZONE.minY &&
    position.y <= SETUP_ZONE.maxY
  );
}

export function countUnplacedItems(items: PlacedItem[]): number {
  return items.filter((i) => i.position.x === 0 && i.position.y === 0).length;
}

/** Classic tier-first auto arrange with interleaved type mixing. */
export function autoArrangeItemsInPlace(items: PlacedItem[], rng: () => number = Math.random): boolean {
  if (autoArrangeInterleavedInPlace(items, rng)) return true;

  for (const item of items) {
    item.position = { x: 0, y: 0 };
  }

  const queue = buildInterleavedPlacementQueue(items, rng);
  const grid = generateMixedGridCandidates(rng);

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const tierCandidates = generateTieredPlacementCandidates(item.type);
    const rotated = [...grid.slice(i), ...grid.slice(0, i)];
    const placed =
      tryPlaceAtCandidates(item, rotated, items)
      || tryPlaceAtCandidates(item, tierCandidates, items)
      || tryPlaceAtCandidates(item, generatePlacementCandidates(), items)
      || tryPlaceRandomInZone(item, items, rng);

    if (!placed) {
      for (let attempt = 0; attempt < 600; attempt++) {
        const pos = {
          x: SETUP_ZONE.minX + rng() * (SETUP_ZONE.maxX - SETUP_ZONE.minX),
          y: SETUP_ZONE.minY + rng() * (SETUP_ZONE.maxY - SETUP_ZONE.minY),
        };
        if (isValidPlacement(item.id, pos, items)) {
          item.position = { ...pos };
          break;
        }
        if (attempt === 599) return false;
      }
    }
  }

  return true;
}
