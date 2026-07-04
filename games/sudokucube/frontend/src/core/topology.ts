export type FaceId = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';
export const FACES: readonly FaceId[] = ['U', 'D', 'F', 'B', 'L', 'R'];
export const N = 4;
export const CELL_COUNT = FACES.length * N * N; // 96

export function cellIndex(face: FaceId, row: number, col: number): number {
  return FACES.indexOf(face) * N * N + row * N + col;
}

export function cellAt(index: number): { face: FaceId; row: number; col: number } {
  const face = FACES[Math.floor(index / (N * N))];
  const rem = index % (N * N);
  return { face, row: Math.floor(rem / N), col: rem % N };
}

/**
 * Tâm ô trên bề mặt cube [0,4]³. Hai ô ở hai mặt khác nhau kề nhau qua một
 * cạnh cube ⟺ khoảng cách tâm² = 0.5 — dùng làm nguồn sự thật duy nhất cho
 * ràng buộc "cạnh khớp nhau" (không viết bảng edge-mapping thủ công).
 */
export function cellCenter(face: FaceId, row: number, col: number): [number, number, number] {
  const a = col + 0.5;
  const b = row + 0.5;
  switch (face) {
    case 'U': return [a, 4, b];
    case 'D': return [a, 0, b];
    case 'F': return [a, b, 4];
    case 'B': return [a, b, 0];
    case 'L': return [0, b, a];
    case 'R': return [4, b, a];
  }
}

export function buildDiffPeers(): number[][] {
  const peers: number[][] = Array.from({ length: CELL_COUNT }, () => []);
  for (let i = 0; i < CELL_COUNT; i++) {
    const { face, row, col } = cellAt(i);
    const set = new Set<number>();
    for (let k = 0; k < N; k++) {
      if (k !== col) set.add(cellIndex(face, row, k));
      if (k !== row) set.add(cellIndex(face, k, col));
    }
    const br = Math.floor(row / 2) * 2;
    const bc = Math.floor(col / 2) * 2;
    for (let r = br; r < br + 2; r++) {
      for (let c = bc; c < bc + 2; c++) {
        if (r !== row || c !== col) set.add(cellIndex(face, r, c));
      }
    }
    peers[i] = Array.from(set);
  }
  return peers;
}

export function buildEqPeers(): number[][] {
  const centers = Array.from({ length: CELL_COUNT }, (_, i) => {
    const { face, row, col } = cellAt(i);
    return cellCenter(face, row, col);
  });
  const peers: number[][] = Array.from({ length: CELL_COUNT }, () => []);
  for (let i = 0; i < CELL_COUNT; i++) {
    for (let j = i + 1; j < CELL_COUNT; j++) {
      if (cellAt(i).face === cellAt(j).face) continue;
      const [x1, y1, z1] = centers[i];
      const [x2, y2, z2] = centers[j];
      const d2 = (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;
      if (Math.abs(d2 - 0.5) < 1e-9) {
        peers[i].push(j);
        peers[j].push(i);
      }
    }
  }
  return peers;
}

export function buildEdgePairs(): Array<[number, number]> {
  const eq = buildEqPeers();
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    for (const j of eq[i]) if (j > i) pairs.push([i, j]);
  }
  return pairs;
}
