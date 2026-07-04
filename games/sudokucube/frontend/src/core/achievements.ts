import type { Difficulty } from './generator';
import { currentStreak } from './streak';

export interface Stats {
  completedTotal: number;
  completedByDifficulty: Record<Difficulty, number>;
  bestTimeMs: Record<Difficulty, number | null>;
  playDates: string[];
}

export interface GameResult {
  difficulty: Difficulty;
  elapsedMs: number;
  mistakes: number;
  hintsUsed: number;
  completedAt: string; // ISO datetime
}

export type AchievementId =
  | 'novice' | 'master' | 'legend' | 'speed-demon' | 'no-hint-hero' | 'streak-king';

interface AchievementDef {
  id: AchievementId;
  icon: string;
  title: string;
  condition: (stats: Stats, result: GameResult | null, today: string) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'novice', icon: '🥉', title: 'Cube Novice', condition: (s) => s.completedTotal >= 10 },
  { id: 'master', icon: '🥈', title: 'Cube Master', condition: (s) => s.completedTotal >= 50 },
  { id: 'legend', icon: '🥇', title: 'Cube Legend', condition: (s) => s.completedTotal >= 100 },
  {
    id: 'speed-demon', icon: '⚡', title: 'Speed Demon',
    condition: (_s, r) => r !== null && r.difficulty === 'hard' && r.elapsedMs < 5 * 60_000,
  },
  {
    id: 'no-hint-hero', icon: '🎯', title: 'No Hint Hero',
    condition: (_s, r) => r !== null && r.difficulty === 'expert' && r.hintsUsed === 0,
  },
  {
    id: 'streak-king', icon: '🔥', title: 'Streak King',
    condition: (s, _r, today) => currentStreak(s.playDates, today) >= 7,
  },
];

export function evaluateAchievements(
  earned: Partial<Record<AchievementId, string | null>>,
  stats: Stats,
  result: GameResult | null,
  today: string,
): AchievementId[] {
  return ACHIEVEMENTS
    .filter((a) => !earned[a.id] && a.condition(stats, result, today))
    .map((a) => a.id);
}

export type SkinId = 'sakura' | 'ice' | 'magma' | 'galaxy' | 'neon' | 'holiday';

/** Khoảng ngày lễ (bao gồm 2 đầu). Tết âm hard-code theo năm. */
export const HOLIDAY_RANGES: Array<{ from: string; to: string }> = [
  { from: '2025-12-15', to: '2026-01-05' },
  { from: '2026-02-14', to: '2026-02-22' }, // Tết Bính Ngọ
  { from: '2026-12-15', to: '2027-01-05' },
  { from: '2027-02-03', to: '2027-02-11' }, // Tết Đinh Mùi
];

export function isHolidayDate(isoDate: string): boolean {
  return HOLIDAY_RANGES.some((r) => isoDate >= r.from && isoDate <= r.to);
}

export function evaluateSkinUnlocks(
  unlocked: SkinId[], stats: Stats, result: GameResult | null,
): SkinId[] {
  const earned: SkinId[] = [];
  const has = (id: SkinId) => unlocked.includes(id) || earned.includes(id);
  if (!has('ice') && stats.completedTotal >= 10) earned.push('ice');
  const hardPlus = stats.completedByDifficulty.hard + stats.completedByDifficulty.expert;
  if (!has('magma') && hardPlus >= 25) earned.push('magma');
  if (!has('galaxy') && stats.completedTotal >= 50) earned.push('galaxy');
  if (!has('neon') && result?.difficulty === 'expert') earned.push('neon');
  if (!has('holiday') && result && isHolidayDate(result.completedAt.slice(0, 10))) earned.push('holiday');
  return earned;
}
