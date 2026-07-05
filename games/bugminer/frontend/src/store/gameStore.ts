import { create } from 'zustand';
import type { GameState, ItemType, PlayerRole, RoomSummary } from '../shared';
import { DEFAULT_FAIR_MODE } from '../shared';

export type Screen = 'home' | 'lobby' | 'setup' | 'game' | 'result';

interface CollectionEvent {
  value: number;
  type: ItemType;
  id: number;
}

interface GameStore {
  screen: Screen;
  connected: boolean;
  playerId: string | null;
  playerName: string;
  roomId: string | null;
  role: PlayerRole;
  gameState: GameState | null;
  selectedItemId: string | null;
  collections: CollectionEvent[];
  error: string | null;
  isPaused: boolean;
  draggingItemId: string | null;
  dragPreview: { x: number; y: number } | null;
  poisonFlash: boolean;
  bombFlash: boolean;
  availableRooms: RoomSummary[];

  setScreen: (screen: Screen) => void;
  setConnected: (v: boolean) => void;
  setPlayer: (id: string, name: string, roomId: string, role: PlayerRole) => void;
  setGameState: (state: GameState) => void;
  setSelectedItemId: (id: string | null) => void;
  addCollection: (value: number, type: ItemType) => void;
  setError: (msg: string | null) => void;
  setPaused: (v: boolean) => void;
  setDraggingItem: (id: string | null) => void;
  setDragPreview: (pos: { x: number; y: number } | null) => void;
  setPoisonFlash: (v: boolean) => void;
  setBombFlash: (v: boolean) => void;
  setAvailableRooms: (rooms: RoomSummary[]) => void;
  reset: () => void;
}

let collectionCounter = 0;

function resolveScreen(state: GameState, currentScreen: Screen, inRoom: boolean): Screen {
  if (state.phase === 'lobby') {
    if (inRoom) return 'lobby';
    if (currentScreen !== 'lobby' && currentScreen !== 'home') return 'lobby';
    return currentScreen;
  }
  if (state.phase === 'dual_setup') return 'setup';
  if (state.phase === 'countdown' || state.phase === 'playing' || state.phase === 'paused') {
    return 'game';
  }
  if (state.phase === 'finished') return 'result';
  return currentScreen;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'home',
  connected: false,
  playerId: null,
  playerName: '',
  roomId: null,
  role: null,
  gameState: null,
  selectedItemId: null,
  collections: [],
  error: null,
  isPaused: false,
  draggingItemId: null,
  dragPreview: null,
  poisonFlash: false,
  bombFlash: false,
  availableRooms: [],

  setScreen: (screen) => {
    if (get().screen !== screen) set({ screen });
  },
  setConnected: (v) => {
    if (get().connected !== v) set({ connected: v });
  },
  setPlayer: (id, name, roomId, role) => set({ playerId: id, playerName: name, roomId, role }),
  setGameState: (state) => {
    const { screen, playerId, roomId } = get();
    const normalized: GameState = {
      ...state,
      fairMode: {
        ...DEFAULT_FAIR_MODE,
        ...state.fairMode,
        battle: state.fairMode?.battle ?? false,
      },
      battle: state.battle ?? null,
    };
    const inRoom = Boolean(playerId && roomId && normalized.roomId === roomId);
    const nextScreen = resolveScreen(normalized, screen, inRoom);
    set({
      gameState: normalized,
      ...(nextScreen !== screen ? { screen: nextScreen } : {}),
    });
  },
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  addCollection: (value, type) =>
    set((s) => {
      const collections = [...s.collections, { value, type, id: ++collectionCounter }];
      return { collections: collections.length > 5 ? collections.slice(-5) : collections };
    }),
  setError: (msg) => set({ error: msg }),
  setPaused: (v) => set({ isPaused: v }),
  setDraggingItem: (id) => set({ draggingItemId: id }),
  setDragPreview: (pos) => set({ dragPreview: pos }),
  setPoisonFlash: (v) => set({ poisonFlash: v }),
  setBombFlash: (v) => set({ bombFlash: v }),
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }),
  reset: () =>
    set({
      screen: 'home',
      roomId: null,
      role: null,
      gameState: null,
      selectedItemId: null,
      collections: [],
      error: null,
      isPaused: false,
      draggingItemId: null,
      dragPreview: null,
      poisonFlash: false,
      bombFlash: false,
      availableRooms: [],
    }),
}));
