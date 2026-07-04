import { describe, it, expect, vi } from 'vitest';
import { LEVELS, getLevelById, createDefaultItems } from './levels';
import { ITEM_DEFINITIONS } from './items';
import type { ItemType } from './types';

describe('Levels (GDD §4)', () => {
  it('defines exactly 5 levels per spec', () => {
    expect(LEVELS).toHaveLength(5);
    expect(LEVELS.map((l) => l.name)).toEqual([
      'Easy Mine',
      'Rock Mine',
      'Diamond Cave',
      'Chaos Mine',
      'Night Mine',
    ]);
  });

  it('has increasing target scores and decreasing time limits', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].targetScore).toBeGreaterThan(LEVELS[i - 1].targetScore);
      expect(LEVELS[i].timeLimit).toBeLessThan(LEVELS[i - 1].timeLimit);
    }
  });

  it('Easy Mine matches GDD: target 800, time 90s, day theme', () => {
    const easy = getLevelById('easy-mine');
    expect(easy.targetScore).toBe(800);
    expect(easy.timeLimit).toBe(90);
    expect(easy.theme).toBe('day');
  });

  it('Night Mine matches GDD: target 1800, time 60s, night theme', () => {
    const night = getLevelById('night-mine');
    expect(night.targetScore).toBe(1800);
    expect(night.timeLimit).toBe(60);
    expect(night.theme).toBe('night');
  });

  it('falls back to first level for unknown id', () => {
    expect(getLevelById('unknown')).toBe(LEVELS[0]);
  });
});

describe('Map Generation Rule (GDD §6 — fixed item counts)', () => {
  const countByType = (items: { type: ItemType }[]) =>
    items.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] ?? 0) + 1;
        return acc;
      },
      {} as Record<ItemType, number>,
    );

  it('Easy Mine has fixed core counts plus bonus spawns', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const items = createDefaultItems('easy-mine');
    const counts = countByType(items);
    expect(counts.gold).toBe(12);
    expect(counts.bigGold).toBe(7);
    expect(counts.diamond).toBe(3);
    expect(counts.rock).toBe(10);
    expect(counts.mysteryBag).toBe(6);
    expect(counts.poison).toBe(1);
    expect(counts.mouse).toBeGreaterThanOrEqual(4);
    expect(counts.pig).toBeGreaterThanOrEqual(5);
    expect(counts.strengthDrink).toBeGreaterThanOrEqual(2);
    expect(items.length).toBeGreaterThan(40);
    vi.mocked(Math.random).mockRestore();
  });

  it('total core item count is deterministic per level', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const first = createDefaultItems('rock-mine');
    const second = createDefaultItems('rock-mine');
    expect(first).toHaveLength(second.length);
    expect(countByType(first)).toEqual(countByType(second));
    vi.mocked(Math.random).mockRestore();
  });

  it('assigns unique ids to each item', () => {
    const items = createDefaultItems('chaos-mine');
    const ids = new Set(items.map((i) => i.id));
    expect(ids.size).toBe(items.length);
  });

  it('Rock Mine has more rocks and fewer diamonds than Easy Mine', () => {
    const easy = countByType(createDefaultItems('easy-mine'));
    const rock = countByType(createDefaultItems('rock-mine'));
    expect(rock.rock).toBeGreaterThan(easy.rock!);
    expect(rock.diamond).toBeLessThan(easy.diamond!);
  });

  it('collectible value (incl. mystery max) can reach target on every level (GDD §5)', () => {
    for (const level of LEVELS) {
      const items = createDefaultItems(level.id);
      const baseScore = items.reduce((sum, i) => sum + ITEM_DEFINITIONS[i.type].value, 0);
      const mysteryCount = items.filter((i) => i.type === 'mysteryBag').length;
      const maxScore = baseScore + mysteryCount * 500;
      expect(maxScore).toBeGreaterThanOrEqual(level.targetScore);
    }
  });
});
