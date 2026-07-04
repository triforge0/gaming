import type { Puzzle } from './generator';
import { FACES, N, cellIndex, type FaceId } from './topology';

export type Entries = (number | null)[];

export function isCorrect(puzzle: Puzzle, index: number, value: number): boolean {
  return puzzle.solution[index] === value;
}

export function effectiveValue(puzzle: Puzzle, entries: Entries, index: number): number | null {
  return puzzle.givens[index] ? puzzle.solution[index] : entries[index];
}

export function isFaceComplete(puzzle: Puzzle, entries: Entries, face: FaceId): boolean {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const i = cellIndex(face, r, c);
      if (effectiveValue(puzzle, entries, i) !== puzzle.solution[i]) return false;
    }
  }
  return true;
}

export function completedFaces(puzzle: Puzzle, entries: Entries): FaceId[] {
  return FACES.filter((f) => isFaceComplete(puzzle, entries, f));
}

export function isWon(puzzle: Puzzle, entries: Entries): boolean {
  return completedFaces(puzzle, entries).length === FACES.length;
}
