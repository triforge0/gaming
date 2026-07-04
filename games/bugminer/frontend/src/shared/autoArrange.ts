import type { PlacedItem, Vec2 } from './types';
import { SETUP_ZONE } from './constants';

const COLS = 9;
const COL_SPACING = 78;
const ROW_SPACING = 52;
const START_X = -312;
const START_Y = 28;

/** Scan grid candidates for auto-arrange (fits large levels e.g. Chaos Mine). */
export function generatePlacementCandidates(): Vec2[] {
  const candidates: Vec2[] = [];
  for (let row = 0; row < 12; row++) {
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
