import { describe, expect, it } from 'vitest';
import {
  CELL_COUNT, FACES, buildDiffPeers, buildEdgePairs, buildEqPeers,
  cellAt, cellCenter, cellIndex,
} from './topology';

describe('topology', () => {
  it('cellIndex/cellAt là nghịch đảo của nhau', () => {
    for (let i = 0; i < CELL_COUNT; i++) {
      const { face, row, col } = cellAt(i);
      expect(cellIndex(face, row, col)).toBe(i);
    }
  });

  it('có đúng 48 cặp qua cạnh (12 cạnh × 4 ô)', () => {
    expect(buildEdgePairs()).toHaveLength(48);
  });

  it('eqPeers đối xứng; giữa-biên 1 peer, góc 2 peer, ô trong 0', () => {
    const eq = buildEqPeers();
    for (let i = 0; i < CELL_COUNT; i++) {
      for (const j of eq[i]) expect(eq[j]).toContain(i);
      const { row, col } = cellAt(i);
      const onEdge = [row, col].filter((v) => v === 0 || v === 3).length;
      expect(eq[i]).toHaveLength(onEdge); // 0=trong, 1=giữa-biên, 2=góc
    }
  });

  it('diffPeers: mỗi ô có 6 peer (3 cùng hàng + 3 cùng cột)', () => {
    const diff = buildDiffPeers();
    for (let i = 0; i < CELL_COUNT; i++) expect(diff[i]).toHaveLength(6);
  });

  it('cặp qua cạnh có tâm 3D cách nhau √0.5', () => {
    for (const [i, j] of buildEdgePairs()) {
      const a = cellAt(i); const b = cellAt(j);
      expect(a.face).not.toBe(b.face);
      const p = cellCenter(a.face, a.row, a.col);
      const q = cellCenter(b.face, b.row, b.col);
      const d2 = (p[0]-q[0])**2 + (p[1]-q[1])**2 + (p[2]-q[2])**2;
      expect(d2).toBeCloseTo(0.5, 9);
    }
  });

  it('FACES có 6 mặt đúng thứ tự U D F B L R', () => {
    expect(FACES).toEqual(['U', 'D', 'F', 'B', 'L', 'R']);
  });
});
