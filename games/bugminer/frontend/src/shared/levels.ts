import type { ItemType, LevelConfig } from './types';

const DEFAULT_COUNTS: Record<ItemType, number> = {
  gold: 14,
  bigGold: 7,
  diamond: 3,
  rock: 18,
  mysteryBag: 6,
  poison: 2,
  mouse: 0,
  pig: 0,
  strengthDrink: 0,
};

export const LEVELS: LevelConfig[] = [
  {
    id: 'easy-mine',
    name: 'Easy Mine',
    targetScore: 800,
    timeLimit: 90,
    itemCounts: { ...DEFAULT_COUNTS, rock: 10, gold: 12, poison: 1 },
    theme: 'day',
  },
  {
    id: 'rock-mine',
    name: 'Rock Mine',
    targetScore: 1000,
    timeLimit: 80,
    itemCounts: { ...DEFAULT_COUNTS, rock: 22, diamond: 2, gold: 10, poison: 2 },
    theme: 'day',
  },
  {
    id: 'diamond-cave',
    name: 'Diamond Cave',
    targetScore: 1200,
    timeLimit: 75,
    itemCounts: { ...DEFAULT_COUNTS, diamond: 2, rock: 20, gold: 10, bigGold: 5, poison: 3 },
    theme: 'cave',
  },
  {
    id: 'chaos-mine',
    name: 'Chaos Mine',
    targetScore: 1500,
    timeLimit: 70,
    itemCounts: { ...DEFAULT_COUNTS, rock: 18, mysteryBag: 7, gold: 14, bigGold: 6, poison: 3 },
    theme: 'day',
  },
  {
    id: 'night-mine',
    name: 'Night Mine',
    targetScore: 1800,
    timeLimit: 60,
    itemCounts: { ...DEFAULT_COUNTS, rock: 24, diamond: 2, bigGold: 6, gold: 12, poison: 4 },
    theme: 'night',
  },
];

export function getLevelById(id: string): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

/** Random spawn counts for animals & power-ups (per challenge instance). */
export function rollBonusSpawns(rng: () => number = Math.random): {
  mouse: number;
  pig: number;
  strengthDrink: number;
} {
  return {
    mouse: 4 + Math.floor(rng() * 6),
    pig: 5 + Math.floor(rng() * 8),
    strengthDrink: 2 + Math.floor(rng() * 3),
  };
}

function interleaveBonusTypes(
  entries: { type: ItemType }[],
  rng: () => number,
): { type: ItemType }[] {
  const byType = new Map<ItemType, ItemType[]>();
  for (const e of entries) {
    const list = byType.get(e.type) ?? [];
    list.push(e.type);
    byType.set(e.type, list);
  }
  for (const list of byType.values()) {
    list.sort(() => rng() - 0.5);
  }
  const types = [...byType.keys()].sort(() => rng() - 0.5);
  const out: { type: ItemType }[] = [];
  let left = entries.length;
  while (left > 0) {
    let step = false;
    for (const type of types) {
      const list = byType.get(type);
      if (!list?.length) continue;
      out.push({ type: list.shift()! });
      left--;
      step = true;
    }
    if (!step) break;
  }
  return out;
}

export function createDefaultItems(
  levelId: string,
  rng: () => number = Math.random,
): { id: string; type: ItemType }[] {
  const level = getLevelById(levelId);
  const items: { id: string; type: ItemType }[] = [];
  let index = 0;
  for (const [type, count] of Object.entries(level.itemCounts) as [ItemType, number][]) {
    for (let i = 0; i < count; i++) {
      items.push({ id: `item-${index++}`, type });
    }
  }

  const bonus = rollBonusSpawns(rng);
  const bonusPool: { type: ItemType }[] = [
    ...Array.from({ length: bonus.mouse }, () => ({ type: 'mouse' as ItemType })),
    ...Array.from({ length: bonus.pig }, () => ({ type: 'pig' as ItemType })),
    ...Array.from({ length: bonus.strengthDrink }, () => ({ type: 'strengthDrink' as ItemType })),
  ];

  for (const entry of interleaveBonusTypes(bonusPool, rng)) {
    items.push({ id: `item-${index++}`, type: entry.type });
  }

  return items;
}
