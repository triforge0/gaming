export type PlayerRole = 'developer' | 'qc' | null;

export type ItemType =
  | 'gold'
  | 'bigGold'
  | 'diamond'
  | 'rock'
  | 'mysteryBag'
  | 'poison'
  | 'mouse'
  | 'pig'
  | 'strengthDrink'
  | 'bedrock';

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
  /** Visual/collision scale — larger = more points & heavier pull (variable-size items). */
  scale?: number;
  /** Patrol velocity for moving animals or drifting battle loot. */
  velocity?: Vec2;
  moving?: boolean;
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
  /** Seconds remaining on strength buff (faster heavy pulls). */
  strengthBuffRemaining: number;
}

export interface DualChallenges {
  forPlayerA: ChallengeState;
  forPlayerB: ChallengeState;
}

export interface FairModeConfig {
  enabled: boolean;
  /** Shared-screen PvP on one map (Battle mode). */
  battle: boolean;
  levelId: string;
  timeLimit: number;
}

export interface BombProjectileState {
  id: string;
  ownerId: string;
  targetPlayerId: string;
  position: Vec2;
  velocity: Vec2;
  ttl: number;
}

export interface BattleArenaState {
  levelId: string;
  timeLimit: number;
  timeRemaining: number;
  targetScore: number;
  items: PlacedItem[];
  playerAId: string;
  playerBId: string;
  hookA: HookData;
  hookB: HookData;
  scoreA: number;
  scoreB: number;
  finished: boolean;
  winnerId: string | null;
  endReason: EndReason;
  strengthBuffA: number;
  strengthBuffB: number;
  bombCooldownA: number;
  bombCooldownB: number;
  bombs: BombProjectileState[];
}

export interface GameState {
  roomId: string;
  phase: GamePhase;
  hostId: string;
  players: PlayerInfo[];
  challenges?: DualChallenges;
  battle: BattleArenaState | null;
  winnerId: string | null;
  endReason: EndReason;
  countdown: number;
  fairMode: FairModeConfig;
}

export interface RoomSummary {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
  phase: GamePhase;
  levelId: string;
  hostName: string;
  players: string[];
  fairMode: FairModeConfig;
}
