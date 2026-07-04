import { mulberry32, shuffled } from './rng';
import { CELL_COUNT, buildDiffPeers, buildEqPeers } from './topology';

const diffPeers = buildDiffPeers();
const eqPeers = buildEqPeers();
const VALUES = [1, 2, 3, 4] as const;

function fits(values: Int8Array, i: number, v: number): boolean {
  for (const p of diffPeers[i]) if (values[p] === v) return false;
  for (const p of eqPeers[i]) if (values[p] !== 0 && values[p] !== v) return false;
  return true;
}

function givensConsistent(values: Int8Array): boolean {
  for (let i = 0; i < CELL_COUNT; i++) {
    if (values[i] === 0) continue;
    for (const p of diffPeers[i]) if (values[p] === values[i]) return false;
    for (const p of eqPeers[i]) if (values[p] !== 0 && values[p] !== values[i]) return false;
  }
  return true;
}

function prepareSolverState(givens: ArrayLike<number>): { values: Int8Array; empties: number[] } | null {
  const values = Int8Array.from(givens);
  if (!givensConsistent(values)) return null;
  const empties: number[] = [];
  for (let i = 0; i < CELL_COUNT; i++) if (values[i] === 0) empties.push(i);
  return { values, empties };
}

export function solve(givens: ArrayLike<number>, seed = 1): number[] | null {
  const state = prepareSolverState(givens);
  if (!state) return null;
  const { values, empties } = state;
  const rng = mulberry32(seed);

  function backtrack(k: number): boolean {
    if (k === empties.length) return true;
    const i = empties[k];
    for (const v of shuffled(VALUES, rng)) {
      if (fits(values, i, v)) {
        values[i] = v;
        if (backtrack(k + 1)) return true;
        values[i] = 0;
      }
    }
    return false;
  }

  return backtrack(0) ? Array.from(values) : null;
}

export function countSolutions(givens: ArrayLike<number>, cap = 2): number {
  const state = prepareSolverState(givens);
  if (!state) return 0;
  const { values, empties } = state;
  let count = 0;

  function backtrack(k: number): void {
    if (count >= cap) return;
    if (k === empties.length) { count++; return; }
    const i = empties[k];
    for (const v of VALUES) {
      if (fits(values, i, v)) {
        values[i] = v;
        backtrack(k + 1);
        values[i] = 0;
        if (count >= cap) return;
      }
    }
  }

  backtrack(0);
  return count;
}

export function isValidSolution(values: ArrayLike<number>): boolean {
  if (values.length !== CELL_COUNT) return false;
  for (let i = 0; i < CELL_COUNT; i++) {
    const val = values[i];
    if (val < 1 || val > 4) return false;
    for (const p of diffPeers[i]) if (values[p] === val) return false;
    for (const p of eqPeers[i]) if (values[p] !== val) return false;
  }
  return true;
}
