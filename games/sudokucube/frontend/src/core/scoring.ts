import type { Difficulty } from './generator';

export const BASE: Record<Difficulty, number> = { easy: 1000, medium: 2000, hard: 4000, expert: 8000 };
export const PAR_MS: Record<Difficulty, number> = {
  easy: 10 * 60_000, medium: 15 * 60_000, hard: 20 * 60_000, expert: 30 * 60_000,
};
export const MISTAKE_PENALTY = 50;
export const HINT_PENALTY = 100;

export function computeScore(
  difficulty: Difficulty, elapsedMs: number, mistakes: number, hintsUsed: number,
): number {
  const timeFactor = Math.max(0.2, 1 - elapsedMs / PAR_MS[difficulty]);
  return Math.max(0, Math.round(BASE[difficulty] * timeFactor - MISTAKE_PENALTY * mistakes - HINT_PENALTY * hintsUsed));
}
