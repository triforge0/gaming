import { SETUP_ZONE } from './constants';
import { getItemScale, getItemValue } from './items';
import { isValidPlacement } from './placement';
import { depthBand, generateTieredPlacementCandidates, PLACEMENT_DEPTH, generatePlacementCandidates } from './autoArrange';
import {
  buildInterleavedPlacementQueue,
  generateMixedGridCandidates,
  tryPlaceAtCandidates,
  tryPlaceRandomInZone,
} from './placementMix';
import type { ItemType, PlacedItem, Vec2 } from './types';

/** High-value targets — placed at map center in Battle mode. */
export const BATTLE_JACKPOT_TYPES: ReadonlySet<ItemType> = new Set(['bigGold', 'diamond', 'mysteryBag']);

function jackpotPriority(item: PlacedItem): number {
  const scale = getItemScale(item);
  const value = getItemValue(item.type, scale);
  const typeRank: Record<ItemType, number> = {
    bigGold: 300,
    diamond: 200,
    mysteryBag: 150,
    gold: 0,
    rock: 0,
    poison: 0,
    mouse: 0,
    pig: 0,
    strengthDrink: 0,
    bedrock: 0,
  };
  return typeRank[item.type] + value;
}

/** Center "war zone" candidates — contested middle of the mine. */
export function generateCenterJackpotCandidates(): Vec2[] {
  const midY = (SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2;
  const candidates: Vec2[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const tx = (col / 6) * 2 - 1;
      const ty = (row / 3) * 2 - 1;
      candidates.push({
      x: tx * 140,
      y: midY + ty * 48,
      });
    }
  }
  return candidates.sort((a, b) => {
    const da = a.x * a.x + (a.y - midY) * (a.y - midY);
    const db = b.x * b.x + (b.y - midY) * (b.y - midY);
    return da - db;
  });
}

function tryPlaceCenterRandom(
  item: PlacedItem,
  items: PlacedItem[],
  rng: () => number,
  attempts = 100,
): boolean {
  const midY = (SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2;
  for (let i = 0; i < attempts; i++) {
    const pos = {
      x: (rng() - 0.5) * 320,
      y: midY + (rng() - 0.5) * 110,
    };
    if (isValidPlacement(item.id, pos, items)) {
      item.position = { ...pos };
      return true;
    }
  }
  return false;
}

function tryPlaceRandomInBand(
  item: PlacedItem,
  band: { minY: number; maxY: number },
  items: PlacedItem[],
  rng: () => number,
  attempts = 120,
): boolean {
  for (let i = 0; i < attempts; i++) {
    const pos = {
      x: SETUP_ZONE.minX + rng() * (SETUP_ZONE.maxX - SETUP_ZONE.minX),
      y: band.minY + rng() * (band.maxY - band.minY),
    };
    if (isValidPlacement(item.id, pos, items)) {
      item.position = { ...pos };
      return true;
    }
  }
  return false;
}

function placeInterleavedRemainder(
  pool: PlacedItem[],
  items: PlacedItem[],
  rng: () => number,
  gridOffset = 0,
): boolean {
  if (pool.length === 0) return true;

  for (const item of pool) {
    item.position = { x: 0, y: 0 };
  }

  const queue = buildInterleavedPlacementQueue(pool, rng);
  const grid = generateMixedGridCandidates(rng);
  let slot = gridOffset;

  for (const item of queue) {
    const band = depthBand(PLACEMENT_DEPTH[item.type]);
    const bandCandidates = generateTieredPlacementCandidates(item.type);
    const rotated = [...grid.slice(slot), ...grid.slice(0, slot)];

    const placed =
      tryPlaceAtCandidates(item, rotated, items)
      || tryPlaceAtCandidates(item, bandCandidates, items)
      || tryPlaceRandomInBand(item, band, items, rng)
      || tryPlaceRandomInZone(item, items, rng);

    if (!placed) return false;
    slot = (slot + 2) % grid.length;
  }

  return true;
}

function placeRemainderAggressive(
  pool: PlacedItem[],
  items: PlacedItem[],
  rng: () => number,
): boolean {
  for (const item of pool) {
    if (item.position.x !== 0 || item.position.y !== 0) continue;

    const band = depthBand(PLACEMENT_DEPTH[item.type]);
    const placed =
      tryPlaceAtCandidates(item, generateMixedGridCandidates(rng), items)
      || tryPlaceAtCandidates(item, generateTieredPlacementCandidates(item.type), items)
      || tryPlaceAtCandidates(item, generatePlacementCandidates(), items)
      || tryPlaceRandomInZone(item, items, rng);

    if (placed) continue;

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

  return true;
}

export function applyBattleJackpotScales(items: PlacedItem[], rng: () => number): void {
  for (const item of items) {
    if (!BATTLE_JACKPOT_TYPES.has(item.type)) continue;
    if (item.type === 'bigGold' || item.type === 'diamond') {
      item.scale = rng() < 0.6 ? 1.35 : 1.0;
    }
  }
}

/** Battle map: jackpots in center, everything else interleaved around edges. */
export function autoArrangeBattleInPlace(
  items: PlacedItem[],
  rng: () => number = Math.random,
): boolean {
  for (const item of items) {
    item.position = { x: 0, y: 0 };
  }

  const jackpots = items
    .filter((i) => BATTLE_JACKPOT_TYPES.has(i.type))
    .sort((a, b) => jackpotPriority(b) - jackpotPriority(a));
  const rest = items.filter((i) => !BATTLE_JACKPOT_TYPES.has(i.type));

  const centerCandidates = generateCenterJackpotCandidates();

  for (const jackpot of jackpots) {
    const placed =
      tryPlaceAtCandidates(jackpot, centerCandidates, items)
      || tryPlaceCenterRandom(jackpot, items, rng)
      || tryPlaceRandomInBand(jackpot, depthBand('mid'), items, rng);
    if (!placed) return false;
  }

  return placeInterleavedRemainder(rest, items, rng, 3)
    || placeRemainderAggressive(rest, items, rng);
}

export { placeRemainderAggressive };
