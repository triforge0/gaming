// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { generatePuzzle } from '../core/generator';
import { STORAGE_KEY } from './storage';
import { useGame } from './store';

// Mock localStorage
const storeMap: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => storeMap[key] || null,
    setItem: (key: string, value: string) => { storeMap[key] = value.toString(); },
    clear: () => {
      for (const key in storeMap) delete storeMap[key];
    }
  },
  writable: true
});

const puzzle = generatePuzzle('easy', 42);
const firstEmpty = puzzle.givens.findIndex((g) => !g);

function fresh() {
  localStorage.clear();
  useGame.getState().boot();
  useGame.getState().startGame(puzzle);
}

describe('store', () => {
  beforeEach(fresh);

  it('startGame → playing, entries trống, 3 hint', () => {
    const s = useGame.getState();
    expect(s.status).toBe('playing');
    expect(s.persisted.currentGame!.hintsLeft).toBe(3);
  });

  it('điền đúng → entry lưu, fx correct; điền sai → mistakes++, fx wrong, không khóa', () => {
    useGame.getState().select(firstEmpty);
    useGame.getState().fill(puzzle.solution[firstEmpty]);
    expect(useGame.getState().cellFx?.kind).toBe('correct');

    const second = puzzle.givens.findIndex((g, i) => !g && i !== firstEmpty);
    useGame.getState().select(second);
    const wrong = (puzzle.solution[second] % 4) + 1;
    useGame.getState().fill(wrong);
    const s = useGame.getState();
    expect(s.cellFx?.kind).toBe('wrong');
    expect(s.persisted.currentGame!.mistakes).toBe(1);
    expect(s.persisted.currentGame!.entries[second]).toBe(wrong); // vẫn sửa được
  });

  it('không điền được vào ô given', () => {
    const givenIdx = puzzle.givens.findIndex((g) => g);
    useGame.getState().select(givenIdx);
    useGame.getState().fill(1);
    expect(useGame.getState().persisted.currentGame!.entries[givenIdx]).toBeNull();
  });

  it('undo trả lại giá trị trước', () => {
    useGame.getState().select(firstEmpty);
    useGame.getState().fill(puzzle.solution[firstEmpty]);
    useGame.getState().undo();
    expect(useGame.getState().persisted.currentGame!.entries[firstEmpty]).toBeNull();
  });

  it('hint điền đúng ô đang chọn, trừ hintsLeft, đánh dấu hintCells', () => {
    useGame.getState().select(firstEmpty);
    useGame.getState().hint();
    const g = useGame.getState().persisted.currentGame!;
    expect(g.entries[firstEmpty]).toBe(puzzle.solution[firstEmpty]);
    expect(g.hintsLeft).toBe(2);
    expect(g.hintCells).toContain(firstEmpty);
  });

  it('điền đủ đúng → won, stats cập nhật, currentGame xóa, persist', () => {
    for (let i = 0; i < 96; i++) {
      if (puzzle.givens[i]) continue;
      useGame.getState().select(i);
      useGame.getState().fill(puzzle.solution[i]);
    }
    const s = useGame.getState();
    expect(s.status).toBe('won');
    expect(s.winSummary!.score).toBeGreaterThan(0);
    expect(s.persisted.stats.completedTotal).toBe(1);
    expect(s.persisted.currentGame).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).stats.completedTotal).toBe(1);
  });
});
