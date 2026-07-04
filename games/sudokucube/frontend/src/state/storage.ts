import type { AchievementId, SkinId, Stats } from '../core/achievements';
import type { Puzzle } from '../core/generator';
import type { Entries } from '../core/rules';

export const STORAGE_KEY = 'triforge.sudokucube.v1';

export interface CurrentGame {
  puzzle: Puzzle;
  entries: Entries;
  hintCells: number[];
  elapsedMs: number;
  hintsLeft: number;
  mistakes: number;
}

export interface PersistedState {
  version: 1;
  currentGame: CurrentGame | null;
  stats: Stats;
  achievements: Partial<Record<AchievementId, string | null>>;
  skins: { unlocked: SkinId[]; selected: SkinId };
  settings: { sound: boolean; reducedMotion: 'auto' | 'on' | 'off' };
}

export function defaultState(): PersistedState {
  return {
    version: 1,
    currentGame: null,
    stats: {
      completedTotal: 0,
      completedByDifficulty: { easy: 0, medium: 0, hard: 0, expert: 0 },
      bestTimeMs: { easy: null, medium: null, hard: null, expert: null },
      playDates: [],
    },
    achievements: {},
    skins: { unlocked: ['sakura'], selected: 'sakura' },
    settings: { sound: true, reducedMotion: 'auto' },
  };
}

function isValid(s: unknown): s is PersistedState {
  if (typeof s !== 'object' || s === null) return false;
  const o = s as Record<string, unknown>;
  return o.version === 1
    && typeof o.stats === 'object' && o.stats !== null
    && typeof o.skins === 'object' && o.skins !== null
    && typeof o.settings === 'object' && o.settings !== null;
}

export function loadState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed: unknown = JSON.parse(raw);
    if (!isValid(parsed)) return defaultState();
    // merge lên default để field mới thêm trong tương lai luôn có mặt
    const d = defaultState();
    return {
      ...d, ...parsed,
      stats: { ...d.stats, ...(parsed.stats as object) },
      skins: { ...d.skins, ...(parsed.skins as object) },
      settings: { ...d.settings, ...(parsed.settings as object) },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: PersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage đầy/bị chặn — game vẫn chơi được, chỉ mất persist
  }
}
