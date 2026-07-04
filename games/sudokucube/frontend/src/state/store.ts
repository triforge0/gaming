import { create } from 'zustand';
import {
  evaluateAchievements, evaluateSkinUnlocks, type AchievementId, type SkinId,
} from '../core/achievements';
import type { Difficulty, Puzzle } from '../core/generator';
import { completedFaces, isCorrect, isWon } from '../core/rules';
import { computeScore } from '../core/scoring';
import { recordPlayDate } from '../core/streak';
import type { FaceId } from '../core/topology';
import {
  defaultState, loadState, saveState, type PersistedState,
} from './storage';

export type GameStatus = 'menu' | 'generating' | 'playing' | 'paused' | 'won';
export interface CellFx { index: number; kind: 'correct' | 'wrong' | 'hint'; nonce: number }
export interface WinSummary {
  score: number; elapsedMs: number; mistakes: number; hintsUsed: number;
  difficulty: Difficulty; newAchievements: AchievementId[]; newSkins: SkinId[];
}

interface GameStore {
  persisted: PersistedState;
  status: GameStatus;
  selected: number | null;
  lockedFaces: FaceId[];
  cellFx: CellFx | null;
  winSummary: WinSummary | null;
  undoStack: Array<{ index: number; prev: number | null }>;
  boot(): void;
  newGame(difficulty: Difficulty): void;
  startGame(puzzle: Puzzle): void;
  select(index: number | null): void;
  fill(value: number): void;
  clearCell(): void;
  hint(): void;
  undo(): void;
  togglePause(): void;
  tick(dtMs: number): void;
  setSkin(id: SkinId): void;
  toggleSound(): void;
  backToMenu(): void;
  autoSolve(): void;
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let pendingState: PersistedState | null = null;
function persistSoon(state: PersistedState): void {
  pendingState = state;
  if (!persistTimer) {
    persistTimer = setTimeout(() => {
      if (pendingState) saveState(pendingState);
      persistTimer = null;
    }, 1000);
  }
}
function persistNow(state: PersistedState): void {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  saveState(state);
}

let fxNonce = 0;

export const useGame = create<GameStore>((set, get) => ({
  persisted: defaultState(),
  status: 'menu',
  selected: null,
  lockedFaces: [],
  cellFx: null,
  winSummary: null,
  undoStack: [],

  boot() {
    const persisted = loadState();
    set({
      persisted,
      status: persisted.currentGame ? 'playing' : 'menu',
      lockedFaces: persisted.currentGame
        ? completedFaces(persisted.currentGame.puzzle, persisted.currentGame.entries)
        : [],
      selected: null, winSummary: null, undoStack: [],
    });
  },

  newGame(difficulty) {
    set({ status: 'generating' });
    const worker = new Worker(new URL('../core/generator.worker.ts', import.meta.url), { type: 'module' });
    worker.onerror = () => {
      worker.terminate();
      set({ status: 'menu' });
    };
    worker.onmessage = (e: MessageEvent<Puzzle>) => {
      worker.terminate();
      get().startGame(e.data);
    };
    worker.postMessage({ difficulty, seed: Date.now() >>> 0 });
  },

  startGame(puzzle) {
    const persisted: PersistedState = {
      ...get().persisted,
      currentGame: {
        puzzle,
        entries: new Array<number | null>(96).fill(null),
        hintCells: [], elapsedMs: 0, hintsLeft: 3, mistakes: 0,
      },
    };
    persistNow(persisted);
    set({ persisted, status: 'playing', selected: null, lockedFaces: [], winSummary: null, undoStack: [] });
  },

  select(index) {
    const g = get().persisted.currentGame;
    if (!g || get().status !== 'playing') return;
    if (index !== null && g.puzzle.givens[index]) {
      set({ selected: index }); // cho phép chọn ô given để xem, nhưng fill sẽ noop
      return;
    }
    set({ selected: index });
  },

  fill(value) {
    const { persisted, selected, status, undoStack } = get();
    const g = persisted.currentGame;
    if (!g || status !== 'playing' || selected === null || g.puzzle.givens[selected]) return;

    const entries = [...g.entries];
    const prev = entries[selected];
    if (prev === value) return;
    entries[selected] = value;
    const correct = isCorrect(g.puzzle, selected, value);
    const nextGame = { ...g, entries, mistakes: g.mistakes + (correct ? 0 : 1) };
    const nextPersisted = { ...persisted, currentGame: nextGame };
    const locked = completedFaces(g.puzzle, entries);

    set({
      persisted: nextPersisted,
      lockedFaces: locked,
      undoStack: [...undoStack, { index: selected, prev }],
      cellFx: { index: selected, kind: correct ? 'correct' : 'wrong', nonce: ++fxNonce },
    });

    if (correct && isWon(g.puzzle, entries)) {
      finishWin(set, get);
    } else {
      persistSoon(nextPersisted);
    }
  },

  clearCell() {
    const { persisted, selected, status, undoStack } = get();
    const g = persisted.currentGame;
    if (!g || status !== 'playing' || selected === null || g.puzzle.givens[selected]) return;
    const entries = [...g.entries];
    const prev = entries[selected];
    if (prev === null) return;
    entries[selected] = null;
    const nextPersisted = { ...persisted, currentGame: { ...g, entries } };
    set({
      persisted: nextPersisted,
      lockedFaces: completedFaces(g.puzzle, entries),
      undoStack: [...undoStack, { index: selected, prev }],
    });
    persistSoon(nextPersisted);
  },

  hint() {
    const { persisted, selected, status, undoStack } = get();
    const g = persisted.currentGame;
    if (!g || status !== 'playing' || g.hintsLeft <= 0) return;
    let target = selected;
    if (target === null || g.puzzle.givens[target] || g.entries[target] === g.puzzle.solution[target]) {
      const empties: number[] = [];
      for (let i = 0; i < 96; i++) {
        if (!g.puzzle.givens[i] && g.entries[i] !== g.puzzle.solution[i]) empties.push(i);
      }
      if (empties.length === 0) return;
      target = empties[Math.floor(Math.random() * empties.length)];
    }
    const entries = [...g.entries];
    entries[target] = g.puzzle.solution[target];
    const nextGame = {
      ...g, entries,
      hintsLeft: g.hintsLeft - 1,
      hintCells: [...g.hintCells, target],
    };
    const nextPersisted = { ...persisted, currentGame: nextGame };
    set({
      persisted: nextPersisted,
      selected: target,
      lockedFaces: completedFaces(g.puzzle, entries),
      undoStack: [...undoStack, { index: target, prev: g.entries[target] }],
      cellFx: { index: target, kind: 'hint', nonce: ++fxNonce },
    });
    if (isWon(g.puzzle, entries)) finishWin(set, get);
    else persistSoon(nextPersisted);
  },

  undo() {
    const { persisted, status, undoStack } = get();
    const g = persisted.currentGame;
    if (!g || status !== 'playing' || undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    const entries = [...g.entries];
    entries[last.index] = last.prev;
    const nextPersisted = { ...persisted, currentGame: { ...g, entries } };
    set({
      persisted: nextPersisted,
      undoStack: undoStack.slice(0, -1),
      lockedFaces: completedFaces(g.puzzle, entries),
      selected: last.index,
    });
    persistSoon(nextPersisted);
  },

  togglePause() {
    const s = get().status;
    if (s === 'playing') set({ status: 'paused' });
    else if (s === 'paused') set({ status: 'playing' });
  },

  tick(dtMs) {
    const { persisted, status } = get();
    const g = persisted.currentGame;
    if (!g || status !== 'playing') return;
    const nextPersisted = { ...persisted, currentGame: { ...g, elapsedMs: g.elapsedMs + dtMs } };
    set({ persisted: nextPersisted });
    persistSoon(nextPersisted);
  },

  setSkin(id) {
    const { persisted } = get();
    if (!persisted.skins.unlocked.includes(id)) return;
    const nextPersisted = { ...persisted, skins: { ...persisted.skins, selected: id } };
    set({ persisted: nextPersisted });
    persistNow(nextPersisted);
  },

  toggleSound() {
    const { persisted } = get();
    const nextPersisted = {
      ...persisted,
      settings: { ...persisted.settings, sound: !persisted.settings.sound },
    };
    set({ persisted: nextPersisted });
    persistNow(nextPersisted);
  },

  backToMenu() {
    set({ status: 'menu', winSummary: null, selected: null });
  },

  autoSolve() {
    const { persisted, status } = get();
    const g = persisted.currentGame;
    if (!g || status !== 'playing' || g.puzzle.difficulty !== 'easy') return;
    const entries = [...g.puzzle.solution];
    const nextGame = { ...g, entries };
    const nextPersisted = { ...persisted, currentGame: nextGame };
    set({ persisted: nextPersisted, lockedFaces: completedFaces(g.puzzle, entries) });
    finishWin(set, get);
  },
}));

type Set = (partial: Partial<GameStore>) => void;
type Get = () => GameStore;

function finishWin(set: Set, get: Get): void {
  const { persisted } = get();
  const g = persisted.currentGame!;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const hintsUsed = 3 - g.hintsLeft;
  const result = {
    difficulty: g.puzzle.difficulty,
    elapsedMs: g.elapsedMs,
    mistakes: g.mistakes,
    hintsUsed,
    completedAt: now.toISOString(),
  };
  const stats = {
    ...persisted.stats,
    completedTotal: persisted.stats.completedTotal + 1,
    completedByDifficulty: {
      ...persisted.stats.completedByDifficulty,
      [g.puzzle.difficulty]: persisted.stats.completedByDifficulty[g.puzzle.difficulty] + 1,
    },
    bestTimeMs: {
      ...persisted.stats.bestTimeMs,
      [g.puzzle.difficulty]: Math.min(
        persisted.stats.bestTimeMs[g.puzzle.difficulty] ?? Infinity, g.elapsedMs,
      ),
    },
    playDates: recordPlayDate(persisted.stats.playDates, today),
  };
  const newAchievements = evaluateAchievements(persisted.achievements, stats, result, today);
  const newSkins = evaluateSkinUnlocks(persisted.skins.unlocked, stats, result);
  const achievements = { ...persisted.achievements };
  for (const id of newAchievements) achievements[id] = now.toISOString();
  const nextPersisted: PersistedState = {
    ...persisted,
    currentGame: null,
    stats,
    achievements,
    skins: { ...persisted.skins, unlocked: [...persisted.skins.unlocked, ...newSkins] },
  };
  persistNow(nextPersisted);
  set({
    persisted: nextPersisted,
    status: 'won',
    winSummary: {
      score: computeScore(g.puzzle.difficulty, g.elapsedMs, g.mistakes, hintsUsed),
      elapsedMs: g.elapsedMs, mistakes: g.mistakes, hintsUsed,
      difficulty: g.puzzle.difficulty, newAchievements, newSkins,
    },
  });
}
