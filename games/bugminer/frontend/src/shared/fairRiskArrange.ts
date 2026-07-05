import { SETUP_ZONE } from './constants';
import { getItemScale, getItemValue } from './items';
import { isValidPlacement } from './placement';
import { depthBand, generateTieredPlacementCandidates, PLACEMENT_DEPTH } from './autoArrange';
import {
  buildInterleavedPlacementQueue,
  generateMixedGridCandidates,
  tryPlaceAtCandidates,
  tryPlaceRandomInZone,
} from './placementMix';
import { placeRemainderAggressive } from './battleArrange';
import type { ItemType, PlacedItem, Vec2 } from './types';

/** High-value targets — placed deepest in fair mode. */
export const JACKPOT_TYPES: ReadonlySet<ItemType> = new Set(['bigGold', 'diamond', 'mysteryBag']);

/** Hazards that ring jackpot loot (traps, lava rocks, moving beasts). */
export const GUARD_TYPES: ReadonlySet<ItemType> = new Set(['poison', 'rock', 'mouse', 'pig']);

const GUARD_OFFSETS: Vec2[] = [
  { x: 0, y: -48 },
  { x: 58, y: -32 },
  { x: -58, y: -32 },
  { x: 78, y: 0 },
  { x: -78, y: 0 },
  { x: 48, y: 38 },
  { x: -48, y: 38 },
  { x: 0, y: 52 },
  { x: 32, y: -58 },
  { x: -32, y: -58 },
];

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

export function generateDeepJackpotCandidates(): Vec2[] {
  const deep = depthBand('deep');
  const candidates: Vec2[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 11; col++) {
      const ty = 0.5 + (row / 4) * 0.5;
      const tx = col / 10;
      candidates.push({
        x: SETUP_ZONE.minX + 32 + tx * (SETUP_ZONE.maxX - SETUP_ZONE.minX - 64),
        y: deep.minY + ty * (deep.maxY - deep.minY - 12),
      });
    }
  }
  return candidates.sort((a, b) => {
    if (b.y !== a.y) return b.y - a.y;
    return Math.abs(a.x) - Math.abs(b.x);
  });
}

export function generateGuardCandidatesAround(anchor: Vec2, rng: () => number): Vec2[] {
  const shuffled = [...GUARD_OFFSETS].sort(() => rng() - 0.5);
  return shuffled.map((o) => ({
    x: anchor.x + o.x + (rng() - 0.5) * 24,
    y: anchor.y + o.y + (rng() - 0.5) * 18,
  }));
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

export function applyFairJackpotScales(items: PlacedItem[], rng: () => number): void {
  for (const item of items) {
    if (!JACKPOT_TYPES.has(item.type)) continue;
    if (item.type === 'bigGold' || item.type === 'diamond') {
      item.scale = rng() < 0.55 ? 1.35 : 1.0;
    }
  }
}

function tryPlaceGuardNearAnchor(
  guard: PlacedItem,
  anchor: Vec2,
  items: PlacedItem[],
  rng: () => number,
): boolean {
  if (tryPlaceAtCandidates(guard, generateGuardCandidatesAround(anchor, rng), items)) {
    return true;
  }

  for (let i = 0; i < 64; i++) {
    const angle = rng() * Math.PI * 2;
    const radius = 42 + rng() * 50;
    const pos = {
      x: anchor.x + Math.cos(angle) * radius,
      y: anchor.y + Math.sin(angle) * radius,
    };
    if (isValidPlacement(guard.id, pos, items)) {
      guard.position = { ...pos };
      return true;
    }
  }

  return false;
}

function placeGuardRing(
  guards: PlacedItem[],
  jackpotAnchors: Vec2[],
  items: PlacedItem[],
  rng: () => number,
): void {
  const pending = [...guards].sort(() => rng() - 0.5);

  for (const anchor of jackpotAnchors) {
    for (let i = 0; i < pending.length; i++) {
      const guard = pending[i];
      if (tryPlaceGuardNearAnchor(guard, anchor, items, rng)) {
        pending.splice(i, 1);
        break;
      }
    }
  }

  const ringBudget = Math.min(pending.length, Math.max(2, jackpotAnchors.length * 3));
  let placed = 0;

  for (const anchor of jackpotAnchors) {
    if (placed >= ringBudget) break;
    const ring = generateGuardCandidatesAround(anchor, rng);
    for (const pos of ring) {
      if (placed >= ringBudget || pending.length === 0) break;
      const guard = pending[0];
      if (isValidPlacement(guard.id, pos, items)) {
        guard.position = { ...pos };
        pending.shift();
        placed++;
      }
    }
  }
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

/**
 * Fair mode: jackpots deep + partial guard ring, then interleaved mix for everything else.
 */
export function autoArrangeFairRiskRewardInPlace(
  items: PlacedItem[],
  rng: () => number = Math.random,
): boolean {
  for (const item of items) {
    item.position = { x: 0, y: 0 };
  }

  const jackpots = items
    .filter((i) => JACKPOT_TYPES.has(i.type))
    .sort((a, b) => jackpotPriority(b) - jackpotPriority(a));
  const rest = items.filter((i) => !JACKPOT_TYPES.has(i.type));

  const jackpotAnchors: Vec2[] = [];
  const deepCandidates = generateDeepJackpotCandidates();

  for (const jackpot of jackpots) {
    const placed =
      tryPlaceAtCandidates(jackpot, deepCandidates, items)
      || tryPlaceAtCandidates(jackpot, generateTieredPlacementCandidates('bigGold'), items)
      || tryPlaceRandomInBand(jackpot, depthBand('deep'), items, rng);
    if (!placed) return false;
    jackpotAnchors.push({ ...jackpot.position });
  }

  const guards = rest.filter((i) => GUARD_TYPES.has(i.type));
  const others = rest.filter((i) => !GUARD_TYPES.has(i.type));

  placeGuardRing(guards, jackpotAnchors, items, rng);

  const unplacedGuards = guards.filter((g) => g.position.x === 0 && g.position.y === 0);
  const interleavePool = [...unplacedGuards, ...others];

  return placeInterleavedRemainder(interleavePool, items, rng, 1)
    || placeRemainderAggressive(interleavePool, items, rng)
    || placeRemainderAggressive(items.filter((i) => i.position.x === 0 && i.position.y === 0), items, rng);
}
