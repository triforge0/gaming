import { describe, expect, it } from 'vitest';
import {
  evaluateAchievements, evaluateSkinUnlocks, isHolidayDate, type GameResult, type Stats,
} from './achievements';

function stats(over: Partial<Stats> = {}): Stats {
  return {
    completedTotal: 0,
    completedByDifficulty: { easy: 0, medium: 0, hard: 0, expert: 0 },
    bestTimeMs: { easy: null, medium: null, hard: null, expert: null },
    playDates: [],
    ...over,
  };
}

function result(over: Partial<GameResult> = {}): GameResult {
  return {
    difficulty: 'easy', elapsedMs: 60_000, mistakes: 0, hintsUsed: 0,
    completedAt: '2026-07-04T10:00:00.000Z', ...over,
  };
}

describe('achievements', () => {
  it('novice ở 10 cube, master 50, legend 100', () => {
    expect(evaluateAchievements({}, stats({ completedTotal: 10 }), result(), '2026-07-04'))
      .toContain('novice');
    expect(evaluateAchievements({}, stats({ completedTotal: 100 }), result(), '2026-07-04'))
      .toEqual(expect.arrayContaining(['novice', 'master', 'legend']));
  });

  it('không trả badge đã có', () => {
    expect(evaluateAchievements({ novice: '2026-01-01' }, stats({ completedTotal: 10 }), result(), '2026-07-04'))
      .not.toContain('novice');
  });

  it('speed-demon: hard < 5 phút', () => {
    const r = result({ difficulty: 'hard', elapsedMs: 4 * 60_000 });
    expect(evaluateAchievements({}, stats(), r, '2026-07-04')).toContain('speed-demon');
    const slow = result({ difficulty: 'hard', elapsedMs: 6 * 60_000 });
    expect(evaluateAchievements({}, stats(), slow, '2026-07-04')).not.toContain('speed-demon');
  });

  it('no-hint-hero: expert không hint', () => {
    const r = result({ difficulty: 'expert', hintsUsed: 0 });
    expect(evaluateAchievements({}, stats(), r, '2026-07-04')).toContain('no-hint-hero');
  });

  it('streak-king: 7 ngày liên tiếp', () => {
    const dates = ['2026-06-28', '2026-06-29', '2026-06-30', '2026-07-01',
      '2026-07-02', '2026-07-03', '2026-07-04'];
    expect(evaluateAchievements({}, stats({ playDates: dates }), null, '2026-07-04'))
      .toContain('streak-king');
  });
});

describe('skins', () => {
  it('ice 10 cube, galaxy 50, magma 25 hard+', () => {
    const s = stats({
      completedTotal: 50,
      completedByDifficulty: { easy: 10, medium: 15, hard: 20, expert: 5 },
    });
    const earned = evaluateSkinUnlocks(['sakura'], s, null);
    expect(earned).toEqual(expect.arrayContaining(['ice', 'galaxy', 'magma']));
  });

  it('neon khi thắng expert; holiday theo HOLIDAY_RANGES', () => {
    expect(evaluateSkinUnlocks(['sakura'], stats(), result({ difficulty: 'expert' })))
      .toContain('neon');
    expect(isHolidayDate('2026-12-25')).toBe(true);
    expect(isHolidayDate('2026-07-04')).toBe(false);
    expect(evaluateSkinUnlocks(['sakura'], stats(),
      result({ completedAt: '2026-12-25T10:00:00.000Z' }))).toContain('holiday');
  });

  it('không trả skin đã mở', () => {
    expect(evaluateSkinUnlocks(['sakura', 'ice'], stats({ completedTotal: 10 }), null))
      .not.toContain('ice');
  });
});
