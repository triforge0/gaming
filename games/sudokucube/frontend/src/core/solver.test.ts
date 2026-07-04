import { describe, expect, it } from 'vitest';
import { CELL_COUNT } from './topology';
import { countSolutions, isValidSolution, solve } from './solver';

const EMPTY = new Array<number>(CELL_COUNT).fill(0);

describe('solver', () => {
  it('sinh được lời giải đầy đủ hợp lệ từ lưới trống', () => {
    const sol = solve(EMPTY, 42);
    expect(sol).not.toBeNull();
    expect(sol).toHaveLength(CELL_COUNT);
    expect(isValidSolution(sol!)).toBe(true);
  });

  it('hai seed khác nhau cho lời giải khác nhau', () => {
    expect(solve(EMPTY, 1)).not.toEqual(solve(EMPTY, 2));
  });

  it('cùng seed cho cùng lời giải (tất định)', () => {
    expect(solve(EMPTY, 7)).toEqual(solve(EMPTY, 7));
  });

  it('countSolutions trả 1 khi givens là lời giải đầy đủ', () => {
    const sol = solve(EMPTY, 42)!;
    expect(countSolutions(sol)).toBe(1);
  });

  it('countSolutions ≥ 2 khi lưới trống (cap hoạt động)', () => {
    expect(countSolutions(EMPTY, 2)).toBe(2);
  });

  it('trả null khi givens mâu thuẫn (2 ô cùng hàng cùng giá trị)', () => {
    const bad = [...EMPTY];
    bad[0] = 1; bad[1] = 1; // U(0,0) và U(0,1) cùng hàng
    expect(solve(bad, 42)).toBeNull();
  });
});
