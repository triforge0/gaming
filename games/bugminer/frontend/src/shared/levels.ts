import type { ItemType, LevelConfig } from './types';

const DEFAULT_COUNTS: Record<ItemType, number> = {
  gold: 8,
  bigGold: 4,
  diamond: 2,
  rock: 10,
  mysteryBag: 3,
  poison: 1,
};

export const LEVELS: LevelConfig[] = [
  {
    id: 'easy-mine',
    name: 'Easy Mine',
    targetScore: 800,
    timeLimit: 90,
    itemCounts: { ...DEFAULT_COUNTS, rock: 6, poison: 1 },
    theme: 'day',
  },
  {
    id: 'rock-mine',
    name: 'Rock Mine',
    targetScore: 1000,
    timeLimit: 80,
    itemCounts: { ...DEFAULT_COUNTS, rock: 14, diamond: 1, poison: 2 },
    theme: 'day',
  },
  {
    id: 'diamond-cave',
    name: 'Diamond Cave',
    targetScore: 1200,
    timeLimit: 75,
    itemCounts: { ...DEFAULT_COUNTS, diamond: 1, rock: 12, gold: 6, poison: 2 },
    theme: 'cave',
  },
  {
    id: 'chaos-mine',
    name: 'Chaos Mine',
    targetScore: 1500,
    timeLimit: 70,
    itemCounts: { ...DEFAULT_COUNTS, rock: 12, mysteryBag: 5, gold: 10, poison: 3 },
    theme: 'day',
  },
  {
    id: 'night-mine',
    name: 'Night Mine',
    targetScore: 1800,
    timeLimit: 60,
    itemCounts: { ...DEFAULT_COUNTS, rock: 15, diamond: 1, bigGold: 3, poison: 3 },
    theme: 'night',
  },
];

export function getLevelById(id: string): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

export function createDefaultItems(levelId: string): { id: string; type: ItemType }[] {
  const level = getLevelById(levelId);
  const items: { id: string; type: ItemType }[] = [];
  let index = 0;
  for (const [type, count] of Object.entries(level.itemCounts) as [ItemType, number][]) {
    for (let i = 0; i < count; i++) {
      items.push({ id: `item-${index++}`, type });
    }
  }
  return items;
}
