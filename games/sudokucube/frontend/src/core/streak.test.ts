import { describe, expect, it } from 'vitest';
import { currentStreak, recordPlayDate } from './streak';

describe('streak', () => {
  it('recordPlayDate dedupe + sort + cắt còn 30', () => {
    const many = Array.from({ length: 40 }, (_, i) =>
      `2026-05-${String(i + 1).padStart(2, '0')}`.slice(0, 10));
    const dates = recordPlayDate(['2026-06-01', '2026-06-01', ...many.slice(0, 31)], '2026-06-02');
    expect(dates).toHaveLength(30);
    expect(dates).toContain('2026-06-02');
    expect(new Set(dates).size).toBe(dates.length);
  });

  it('streak 7 ngày liên tiếp', () => {
    const dates = ['2026-06-28', '2026-06-29', '2026-06-30', '2026-07-01',
      '2026-07-02', '2026-07-03', '2026-07-04'];
    expect(currentStreak(dates, '2026-07-04')).toBe(7);
  });

  it('đứt quãng → streak tính từ hôm nay lùi về', () => {
    expect(currentStreak(['2026-07-01', '2026-07-03', '2026-07-04'], '2026-07-04')).toBe(2);
    expect(currentStreak(['2026-07-01'], '2026-07-04')).toBe(0);
  });
});
