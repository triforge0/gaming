import { describe, it, expect, vi } from 'vitest';
import {
  ITEM_DEFINITIONS,
  resolveMysteryValue,
  getRetractSpeed,
  getItemValue,
  getItemWeight,
  pickItemScale,
  SIZE_SCALES,
} from './items';
import type { ItemType } from './types';

const ALL_TYPES: ItemType[] = [
  'gold',
  'bigGold',
  'diamond',
  'rock',
  'mysteryBag',
  'poison',
  'mouse',
  'pig',
  'strengthDrink',
  'bedrock',
];

describe('Items (GDD §3)', () => {
  it('defines all item types including animals and strength drink', () => {
    expect(Object.keys(ITEM_DEFINITIONS).sort()).toEqual([...ALL_TYPES].sort());
    expect(ITEM_DEFINITIONS.poison.label).toBe('Bẫy chuột');
    expect(ITEM_DEFINITIONS.strengthDrink.label).toBe('Nước tăng lực');
    expect(ITEM_DEFINITIONS.bedrock.label).toBe('Đá tảng');
    expect(ITEM_DEFINITIONS.bedrock.weight).toBe(14);
    expect(ITEM_DEFINITIONS.mouse.moving).toBe(true);
    expect(ITEM_DEFINITIONS.pig.moving).toBe(true);
  });

  it.each([
    ['gold', 50, 1.0],
    ['bigGold', 150, 2.5],
    ['diamond', 300, 0.8],
    ['rock', 10, 4.0],
    ['mysteryBag', 0, 1.5],
    ['poison', 0, 1.0],
    ['mouse', 40, 0.6],
    ['pig', 120, 2.2],
    ['strengthDrink', 0, 0.5],
    ['bedrock', 0, 14],
  ] as const)('%s has base value=%i weight=%s', (type, value, weight) => {
    expect(ITEM_DEFINITIONS[type].value).toBe(value);
    expect(ITEM_DEFINITIONS[type].weight).toBe(weight);
  });

  it('each item has positive radius for collision', () => {
    for (const type of ALL_TYPES) {
      expect(ITEM_DEFINITIONS[type].radius).toBeGreaterThan(0);
    }
  });
});

describe('Variable size items', () => {
  it('pickItemScale returns one of SIZE_SCALES for variable-size types', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(pickItemScale('gold')).toBe(SIZE_SCALES[2]);
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    expect(pickItemScale('gold')).toBe(SIZE_SCALES[0]);
    expect(pickItemScale('mouse')).toBe(1);
    vi.mocked(Math.random).mockRestore();
  });

  it('larger scale increases value and weight for gold', () => {
    const small = getItemValue('gold', 0.75);
    const large = getItemValue('gold', 1.35);
    expect(large).toBeGreaterThan(small);
    expect(getItemWeight('gold', 1.35)).toBeGreaterThan(getItemWeight('gold', 0.75));
  });
});

describe('Retract speed (GDD §3)', () => {
  it('diamond retracts faster than rock (lower weight = higher speed)', () => {
    const diamondSpeed = getRetractSpeed(ITEM_DEFINITIONS.diamond.weight);
    const rockSpeed = getRetractSpeed(ITEM_DEFINITIONS.rock.weight);
    expect(diamondSpeed).toBeGreaterThan(rockSpeed);
  });

  it('strength multiplier increases retract speed', () => {
    expect(getRetractSpeed(4, 2.5)).toBeGreaterThan(getRetractSpeed(4, 1));
  });

  it('getRetractSpeed returns 320 / weight', () => {
    expect(getRetractSpeed(1)).toBe(320);
    expect(getRetractSpeed(4)).toBe(80);
  });
});

describe('Mystery Bag (GDD §3 — random 50-500)', () => {
  it('resolveMysteryValue returns value in range 50-500', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(resolveMysteryValue()).toBe(50);

    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    expect(resolveMysteryValue()).toBe(500);

    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    expect(resolveMysteryValue()).toBe(200);

    vi.mocked(Math.random).mockRestore();
  });
});
