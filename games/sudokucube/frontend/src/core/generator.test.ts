import { describe, expect, it } from 'vitest';
import { EMPTY_MIN, EMPTY_TARGET, generatePuzzle } from './generator';
import { countSolutions, isValidSolution } from './solver';
import { CELL_COUNT } from './topology';

function givensGrid(p: ReturnType<typeof generatePuzzle>): number[] {
  return p.solution.map((v, i) => (p.givens[i] ? v : 0));
}

describe('generator', () => {
  it('easy: nghiệm hợp lệ, duy nhất, số ô trống trong khoảng', () => {
    const p = generatePuzzle('easy', 123);
    expect(isValidSolution(p.solution)).toBe(true);
    expect(countSolutions(givensGrid(p))).toBe(1);
    const empty = p.givens.filter((g) => !g).length;
    expect(empty).toBeGreaterThanOrEqual(EMPTY_MIN.easy);
    expect(empty).toBeLessThanOrEqual(EMPTY_TARGET.easy);
  });

  it('expert: duy nhất nghiệm và trống hơn easy', () => {
    const e = generatePuzzle('expert', 123);
    expect(countSolutions(givensGrid(e))).toBe(1);
    const emptyExpert = e.givens.filter((g) => !g).length;
    const emptyEasy = generatePuzzle('easy', 123).givens.filter((g) => !g).length;
    expect(emptyExpert).toBeGreaterThan(emptyEasy);
  });

  it('tất định theo seed', () => {
    expect(generatePuzzle('medium', 5)).toEqual(generatePuzzle('medium', 5));
  });

  it('givens có đúng CELL_COUNT phần tử', () => {
    expect(generatePuzzle('easy', 1).givens).toHaveLength(CELL_COUNT);
  });
});
