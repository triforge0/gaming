import { describe, expect, it } from 'vitest';
import { generatePuzzle } from './generator';
import { completedFaces, isFaceComplete, isWon } from './rules';
import { computeScore } from './scoring';
import { FACES, cellIndex } from './topology';

const puzzle = generatePuzzle('easy', 42);

function fullEntries(): (number | null)[] {
  return puzzle.solution.map((v, i) => (puzzle.givens[i] ? null : v));
}

describe('rules', () => {
  it('điền đủ và đúng → thắng, đủ 6 mặt hoàn thành', () => {
    const entries = fullEntries();
    expect(isWon(puzzle, entries)).toBe(true);
    expect(completedFaces(puzzle, entries)).toEqual([...FACES]);
  });

  it('sai 1 ô → mặt chứa ô đó chưa hoàn thành, chưa thắng', () => {
    const entries = fullEntries();
    const i = puzzle.givens.findIndex((g) => !g);
    entries[i] = (puzzle.solution[i] % 4) + 1; // giá trị chắc chắn sai
    expect(isWon(puzzle, entries)).toBe(false);
  });

  it('ô trống → mặt chưa hoàn thành', () => {
    const entries = fullEntries();
    const uEmpty = [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => cellIndex('U', r, c)))
      .find((i) => !puzzle.givens[i])!;
    entries[uEmpty] = null;
    expect(isFaceComplete(puzzle, entries, 'U')).toBe(false);
  });
});

describe('scoring', () => {
  it('nhanh + sạch = điểm cao nhất theo độ khó', () => {
    expect(computeScore('easy', 0, 0, 0)).toBe(1000);
    expect(computeScore('expert', 0, 0, 0)).toBe(8000);
  });
  it('quá par → hệ số sàn 0.2', () => {
    expect(computeScore('easy', 999_999_999, 0, 0)).toBe(200);
  });
  it('phạt mistake 50, hint 100, không âm', () => {
    expect(computeScore('easy', 0, 2, 1)).toBe(1000 - 100 - 100);
    expect(computeScore('easy', 999_999_999, 100, 100)).toBe(0);
  });
});
