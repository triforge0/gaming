import type { ItemType } from './types';

export interface ItemDefinition {
  type: ItemType;
  label: string;
  emoji: string;
  value: number;
  weight: number;
  radius: number;
  color: string;
}

export const ITEM_DEFINITIONS: Record<ItemType, ItemDefinition> = {
  gold: {
    type: 'gold',
    label: 'Gold',
    emoji: '🪙',
    value: 50,
    weight: 1,
    radius: 18,
    color: '#FFD700',
  },
  bigGold: {
    type: 'bigGold',
    label: 'Big Gold',
    emoji: '🥇',
    value: 150,
    weight: 2.5,
    radius: 28,
    color: '#FFA500',
  },
  diamond: {
    type: 'diamond',
    label: 'Diamond',
    emoji: '💎',
    value: 300,
    weight: 0.8,
    radius: 16,
    color: '#00FFFF',
  },
  rock: {
    type: 'rock',
    label: 'Rock',
    emoji: '🪨',
    value: 10,
    weight: 4,
    radius: 26,
    color: '#808080',
  },
  mysteryBag: {
    type: 'mysteryBag',
    label: 'Mystery Bag',
    emoji: '🎁',
    value: 0,
    weight: 1.5,
    radius: 20,
    color: '#FF69B4',
  },
  poison: {
    type: 'poison',
    label: 'Bẫy chuột',
    emoji: '🪤',
    value: 0,
    weight: 1,
    radius: 20,
    color: '#8B6914',
  },
};

export function resolveMysteryValue(): number {
  const roll = Math.random();
  if (roll < 0.1) return 500;
  if (roll < 0.3) return 200;
  if (roll < 0.6) return 100;
  return 50;
}

export function getRetractSpeed(weight: number): number {
  return 320 / weight;
}
