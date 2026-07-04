import { describe, expect, it } from 'vitest';
import { moveSelection } from './navigation';
import { cellAt, cellIndex } from './topology';

describe('navigation', () => {
  it('di chuyển trong mặt', () => {
    expect(moveSelection(cellIndex('U', 1, 1), 1, 0)).toBe(cellIndex('U', 2, 1));
    expect(moveSelection(cellIndex('U', 1, 1), 0, -1)).toBe(cellIndex('U', 1, 0));
  });

  it('vượt mép → sang ô kề trên mặt bên cạnh (không đứng yên)', () => {
    const from = cellIndex('U', 0, 0);
    const to = moveSelection(from, -1, 0);
    expect(to).not.toBe(from);
    expect(cellAt(to).face).not.toBe('U');
  });

  it('vượt mép hai bước liên tiếp vẫn hợp lệ (không NaN/undefined)', () => {
    let cur = cellIndex('F', 0, 0);
    for (let k = 0; k < 20; k++) {
      cur = moveSelection(cur, 0, -1);
      expect(cur).toBeGreaterThanOrEqual(0);
      expect(cur).toBeLessThan(96);
    }
  });
});
