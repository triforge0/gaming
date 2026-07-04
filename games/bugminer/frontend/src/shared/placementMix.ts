import { SETUP_ZONE } from './constants';
import { isValidPlacement } from './placement';
import type { ItemType, PlacedItem, Vec2 } from './types';

/** Round-robin queue so different item types alternate during placement. */
export function buildInterleavedPlacementQueue(
  items: PlacedItem[],
  rng: () => number = Math.random,
): PlacedItem[] {
  const byType = new Map<ItemType, PlacedItem[]>();
  for (const item of items) {
    const list = byType.get(item.type) ?? [];
    list.push(item);
    byType.set(item.type, list);
  }

  for (const list of byType.values()) {
    list.sort(() => rng() - 0.5);
  }

  const types = [...byType.keys()].sort(() => rng() - 0.5);
  const queue: PlacedItem[] = [];
  let remaining = items.length;

  while (remaining > 0) {
    let progressed = false;
    for (const type of types) {
      const list = byType.get(type);
      if (!list || list.length === 0) continue;
      queue.push(list.shift()!);
      remaining--;
      progressed = true;
    }
    if (!progressed) break;
  }

  return queue;
}

/** Full-zone grid — serpentine rows so neighbours differ in X order each row. */
export function generateMixedGridCandidates(rng: () => number = Math.random): Vec2[] {
  const rows = 17;
  const cols = 15;
  const candidates: Vec2[] = [];

  for (let row = 0; row < rows; row++) {
    const ty = row / (rows - 1);
    const y = SETUP_ZONE.minY + 6 + ty * (SETUP_ZONE.maxY - SETUP_ZONE.minY - 12);
    const colOrder = row % 2 === 0
      ? Array.from({ length: cols }, (_, i) => i)
      : Array.from({ length: cols }, (_, i) => cols - 1 - i);

    for (const col of colOrder) {
      const tx = col / (cols - 1);
      const x = SETUP_ZONE.minX + 20 + tx * (SETUP_ZONE.maxX - SETUP_ZONE.minX - 40);
      candidates.push({
        x: x + (rng() - 0.5) * 10,
        y: y + (rng() - 0.5) * 8,
      });
    }
  }

  return candidates;
}

export function tryPlaceAtCandidates(
  item: PlacedItem,
  candidates: Vec2[],
  items: PlacedItem[],
): boolean {
  for (const pos of candidates) {
    if (isValidPlacement(item.id, pos, items)) {
      item.position = { ...pos };
      return true;
    }
  }
  return false;
}

export function tryPlaceRandomInZone(
  item: PlacedItem,
  items: PlacedItem[],
  rng: () => number,
  attempts = 400,
): boolean {
  for (let i = 0; i < attempts; i++) {
    const pos = {
      x: SETUP_ZONE.minX + rng() * (SETUP_ZONE.maxX - SETUP_ZONE.minX),
      y: SETUP_ZONE.minY + rng() * (SETUP_ZONE.maxY - SETUP_ZONE.minY),
    };
    if (isValidPlacement(item.id, pos, items)) {
      item.position = { ...pos };
      return true;
    }
  }
  return false;
}

/** Place items in interleaved type order across a mixed grid. */
export function autoArrangeInterleavedInPlace(
  items: PlacedItem[],
  rng: () => number = Math.random,
): boolean {
  for (const item of items) {
    item.position = { x: 0, y: 0 };
  }

  const queue = buildInterleavedPlacementQueue(items, rng);
  const grid = generateMixedGridCandidates(rng);
  let slot = 0;

  for (const item of queue) {
    const rotated = [...grid.slice(slot), ...grid.slice(0, slot)];
    const placed =
      tryPlaceAtCandidates(item, rotated, items)
      || tryPlaceRandomInZone(item, items, rng);
    if (!placed) return false;
    slot = (slot + 1) % grid.length;
  }

  return true;
}
