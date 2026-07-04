import { CELL_COUNT, N, cellAt, cellCenter, cellIndex } from './topology';

/**
 * Di chuyển selection theo arrow. Trong mặt: cộng (dRow, dCol). Vượt mép:
 * chiếu bước đi thành vector 3D trong mặt hiện tại rồi chọn ô (mặt khác)
 * có tâm gần điểm đích nhất — tự nhiên rơi vào ô kề qua cạnh cube.
 */
export function moveSelection(index: number, dRow: number, dCol: number): number {
  const { face, row, col } = cellAt(index);
  const nr = row + dRow;
  const nc = col + dCol;
  if (nr >= 0 && nr < N && nc >= 0 && nc < N) return cellIndex(face, nr, nc);

  const p0 = cellCenter(face, 0, 0);
  const pr = cellCenter(face, 1, 0);
  const pc = cellCenter(face, 0, 1);
  const rowAxis = [pr[0] - p0[0], pr[1] - p0[1], pr[2] - p0[2]];
  const colAxis = [pc[0] - p0[0], pc[1] - p0[1], pc[2] - p0[2]];
  const cur = cellCenter(face, row, col);
  const target = [
    cur[0] + dRow * rowAxis[0] + dCol * colAxis[0],
    cur[1] + dRow * rowAxis[1] + dCol * colAxis[1],
    cur[2] + dRow * rowAxis[2] + dCol * colAxis[2],
  ];

  let best = index;
  let bestD = Infinity;
  for (let j = 0; j < CELL_COUNT; j++) {
    if (j === index) continue;
    const cj = cellAt(j);
    const p = cellCenter(cj.face, cj.row, cj.col);
    const d = (p[0] - target[0]) ** 2 + (p[1] - target[1]) ** 2 + (p[2] - target[2]) ** 2;
    if (d < bestD) { bestD = d; best = j; }
  }
  return best;
}
