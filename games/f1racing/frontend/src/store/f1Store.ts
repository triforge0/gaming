import { create } from 'zustand';
import type {
  LobbyPlayerView,
  RaceResultView,
  RaceStateView,
  RoomConfigView,
  RoomSummary,
  StandingEntryView,
} from '../shared';

export type Screen =
  | 'menu'
  | 'join'
  | 'singleplayer'
  | 'lobby'
  | 'race'
  | 'results'
  | 'replay'
  | 'garage'
  | 'settings';

interface F1Store {
  screen: Screen;
  connected: boolean;
  playerId: string | null;
  playerName: string;
  roomId: string | null;
  lobbyPlayers: LobbyPlayerView[];
  roomConfig: RoomConfigView | null;
  hostId: string | null;
  canStart: boolean;
  availableRooms: RoomSummary[];
  lanHosts: Array<{ hostIp: string; port: number }>;
  error: string | null;
  matchPhase: number;
  countdownSeconds: number;
  pingMs: number;
  raceState: RaceStateView | null;
  standings: StandingEntryView[];
  raceResult: RaceResultView | null;

  setScreen: (screen: Screen) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  setPingMs: (pingMs: number) => void;
  setCountdownSeconds: (countdownSeconds: number) => void;
  setPlayer: (playerId: string, playerName: string, roomId: string) => void;
  setLobby: (payload: {
    players: LobbyPlayerView[];
    hostId: string | null;
    canStart: boolean;
    matchPhase: number;
  }) => void;
  setRoomConfig: (config: RoomConfigView | null) => void;
  setRaceState: (raceState: RaceStateView | null) => void;
  setStandings: (standings: StandingEntryView[]) => void;
  setRaceResult: (raceResult: RaceResultView | null) => void;
  setAvailableRooms: (rooms: RoomSummary[]) => void;
  setLanHosts: (hosts: Array<{ hostIp: string; port: number }>) => void;
  resetSession: () => void;
}

export const useF1Store = create<F1Store>((set) => ({
  screen: 'menu',
  connected: false,
  playerId: null,
  playerName: '',
  roomId: null,
  lobbyPlayers: [],
  roomConfig: null,
  hostId: null,
  canStart: false,
  availableRooms: [],
  lanHosts: [],
  error: null,
  matchPhase: 0,
  countdownSeconds: 0,
  pingMs: 0,
  raceState: null,
  standings: [],
  raceResult: null,

  setScreen: (screen) => set({ screen }),
  setConnected: (connected) => set({ connected }),
  setError: (error) => set({ error }),
  setPingMs: (pingMs) => set({ pingMs }),
  setCountdownSeconds: (countdownSeconds) => set({ countdownSeconds }),
  setPlayer: (playerId, playerName, roomId) => set({ playerId, playerName, roomId }),
  setLobby: (payload) => set({
    lobbyPlayers: payload.players,
    hostId: payload.hostId,
    canStart: payload.canStart,
    matchPhase: payload.matchPhase,
  }),
  setRoomConfig: (roomConfig) => set({ roomConfig }),
  setRaceState: (raceState) => set({ raceState }),
  setStandings: (standings) => set({ standings }),
  setRaceResult: (raceResult) => set({ raceResult }),
  setAvailableRooms: (availableRooms) => set({ availableRooms }),
  setLanHosts: (lanHosts) => set({ lanHosts }),
  resetSession: () => set({
    playerId: null,
    roomId: null,
    lobbyPlayers: [],
    roomConfig: null,
    hostId: null,
    canStart: false,
    matchPhase: 0,
    countdownSeconds: 0,
    pingMs: 0,
    raceState: null,
    standings: [],
    raceResult: null,
  }),
}));
