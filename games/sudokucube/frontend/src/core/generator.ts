import { mulberry32, shuffled } from './rng';
import { countSolutions, solve } from './solver';
import { CELL_COUNT } from './topology';

export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface Puzzle {
  solution: number[];
  givens: boolean[];
  difficulty: Difficulty;
  seed: number;
}

/** Số ô trống mục tiêu (dừng đục khi đạt) — theo spec: easy 40–50%, medium 55–65%, hard 65–75%, expert tối đa. */
export const EMPTY_TARGET: Record<Difficulty, number> = { easy: 48, medium: 62, hard: 72, expert: 96 };
/** Sàn tối thiểu — dưới mức này thì retry với seed dẫn xuất. */
export const EMPTY_MIN: Record<Difficulty, number> = { easy: 38, medium: 53, hard: 62, expert: 72 };

const MAX_ATTEMPTS = 5;

function tryGenerate(difficulty: Difficulty, seed: number): Puzzle {
  const rng = mulberry32(seed);
  const solution = solve(new Array<number>(CELL_COUNT).fill(0), seed);
  if (!solution) throw new Error('unreachable: empty grid is always solvable');
  const grid = [...solution];
  const order = shuffled(Array.from({ length: CELL_COUNT }, (_, i) => i), rng);
  let empty = 0;
  for (const i of order) {
    if (empty >= EMPTY_TARGET[difficulty]) break;
    const backup = grid[i];
    grid[i] = 0;
    if (countSolutions(grid) > 1) grid[i] = backup;
    else empty++;
  }
  return { solution, givens: grid.map((v) => v !== 0), difficulty, seed };
}

export function generatePuzzle(difficulty: Difficulty, seed: number = Date.now() >>> 0): Puzzle {
  let best: Puzzle | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const p = tryGenerate(difficulty, (seed + attempt * 7919) >>> 0);
    const empty = p.givens.filter((g) => !g).length;
    if (empty >= EMPTY_MIN[difficulty]) return p;
    const bestEmpty = best ? best.givens.filter((g) => !g).length : -1;
    if (empty > bestEmpty) best = p;
  }
  return best!;
}
