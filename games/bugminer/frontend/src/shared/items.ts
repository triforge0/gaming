import type { ItemType } from './types';
import { HOOK_RETRACT_SPEED_BASE } from './constants';

export interface ItemDefinition {
  type: ItemType;
  label: string;
  emoji: string;
  value: number;
  weight: number;
  radius: number;
  color: string;
  /** Size varies at spawn — bigger = more points & slower retract. */
  variableSize?: boolean;
  /** Moves continuously during play (mouse, pig). */
  moving?: boolean;
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
    variableSize: true,
  },
  bigGold: {
    type: 'bigGold',
    label: 'Big Gold',
    emoji: '🥇',
    value: 150,
    weight: 2.5,
    radius: 28,
    color: '#FFA500',
    variableSize: true,
  },
  diamond: {
    type: 'diamond',
    label: 'Diamond',
    emoji: '💎',
    value: 300,
    weight: 0.8,
    radius: 16,
    color: '#00FFFF',
    variableSize: true,
  },
  rock: {
    type: 'rock',
    label: 'Rock',
    emoji: '🪨',
    value: 10,
    weight: 4,
    radius: 26,
    color: '#808080',
    variableSize: true,
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
  mouse: {
    type: 'mouse',
    label: 'Chuột',
    emoji: '🐭',
    value: 40,
    weight: 0.6,
    radius: 14,
    color: '#9E9E9E',
    moving: true,
  },
  pig: {
    type: 'pig',
    label: 'Heo',
    emoji: '🐷',
    value: 120,
    weight: 2.2,
    radius: 22,
    color: '#FFAB91',
    moving: true,
  },
  strengthDrink: {
    type: 'strengthDrink',
    label: 'Nước tăng lực',
    emoji: '🧃',
    value: 0,
    weight: 0.5,
    radius: 16,
    color: '#FF5722',
  },
};

export const SIZE_SCALES = [0.75, 1.0, 1.35] as const;

export function pickItemScale(type: ItemType, rng: () => number = Math.random): number {
  if (!ITEM_DEFINITIONS[type].variableSize) return 1;
  const roll = rng();
  if (roll < 0.34) return SIZE_SCALES[0];
  if (roll < 0.67) return SIZE_SCALES[1];
  return SIZE_SCALES[2];
}

export function getItemScale(item: { scale?: number }): number {
  return item.scale ?? 1;
}

export function getItemRadius(type: ItemType, scale = 1): number {
  return ITEM_DEFINITIONS[type].radius * scale;
}

export function getItemValue(type: ItemType, scale = 1): number {
  const base = ITEM_DEFINITIONS[type].value;
  if (!ITEM_DEFINITIONS[type].variableSize) return base;
  return Math.round(base * scale * scale);
}

export function getItemWeight(type: ItemType, scale = 1): number {
  const base = ITEM_DEFINITIONS[type].weight;
  if (!ITEM_DEFINITIONS[type].variableSize) return base;
  return base * scale * scale * scale;
}

export function createAnimalVelocity(seed: number): { x: number; y: number } {
  const speed = 45 + (seed % 35);
  const angle = ((seed * 47) % 360) * (Math.PI / 180);
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed * 0.55,
  };
}

export function resolveMysteryValue(): number {
  const roll = Math.random();
  if (roll < 0.1) return 500;
  if (roll < 0.3) return 200;
  if (roll < 0.6) return 100;
  return 50;
}

export function getRetractSpeed(weight: number, strengthMultiplier = 1): number {
  return (HOOK_RETRACT_SPEED_BASE / weight) * strengthMultiplier;
}
