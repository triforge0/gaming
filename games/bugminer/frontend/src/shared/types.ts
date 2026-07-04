export type PlayerRole = 'developer' | 'qc' | null;

export type ItemType = 'gold' | 'bigGold' | 'diamond' | 'rock' | 'mysteryBag' | 'poison';

export type EndReason = 'timeout' | 'target' | 'poison' | null;

export type GamePhase =
  | 'lobby'
  | 'dual_setup'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'finished';

export type HookState = 'swinging' | 'extending' | 'retracting';

export interface Vec2 {
  x: number;
  y: number;
}

export interface PlacedItem {
  id: string;
  type: ItemType;
  position: Vec2;
  collected: boolean;
}

export interface LevelConfig {
  id: string;
  name: string;
  targetScore: number;
  timeLimit: number;
  itemCounts: Record<ItemType, number>;
  theme: 'day' | 'night' | 'cave';
}

export interface PlayerInfo {
  id: string;
  name: string;
  role: PlayerRole;
  ready: boolean;
}

export interface HookData {
  angle: number;
  length: number;
  state: HookState;
  attachedItemId: string | null;
  swingDirection: 1 | -1;
}

export interface ChallengeState {
  designerId: string;
  playerId: string;
  levelId: string;
  timeLimit: number;
  timeRemaining: number;
  targetScore: number;
  score: number;
  items: PlacedItem[];
  hook: HookData;
  setupLocked: boolean;
  endReason: EndReason;
  finished: boolean;
}

export interface DualChallenges {
  forPlayerA: ChallengeState;
  forPlayerB: ChallengeState;
}

export interface GameState {
  roomId: string;
  phase: GamePhase;
  hostId: string;
  players: PlayerInfo[];
  challenges: DualChallenges;
  winnerId: string | null;
  endReason: EndReason;
  countdown: number;
}

export interface RoomSummary {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
  phase: GamePhase;
  levelId: string;
  hostName: string;
  players: string[];
}
