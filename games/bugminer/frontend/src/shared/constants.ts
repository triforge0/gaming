export const HOOK_SWING_SPEED = 1.2;
export const HOOK_EXTEND_SPEED = 280;
export const HOOK_RETRACT_SPEED_BASE = 320;
export const HOOK_MIN_LENGTH = 40;
export const HOOK_MAX_LENGTH = 640;
/** Battle mode — longer reach so hooks can contest center and opponent half. */
export const BATTLE_HOOK_MAX_LENGTH = 760;
export const HOOK_ANGLE_MIN = -Math.PI * 0.85;
export const HOOK_ANGLE_MAX = Math.PI * 0.85;
export const ITEM_MIN_DISTANCE = 34;
export const MAP_BOUNDS = {
  minX: -600,
  maxX: 600,
  minY: -60,
  maxY: 400,
};
/** Underground playfield — gap below surface line (classic Gold Miner). */
export const SETUP_ZONE = {
  minX: -560,
  maxX: 560,
  minY: 88,
  maxY: 395,
};
/** Three.js mine backdrop width (game zone + side margins). */
export const MINE_VISUAL_WIDTH = SETUP_ZONE.maxX - SETUP_ZONE.minX + 200;
export const MINE_WALL_X = SETUP_ZONE.maxX + 50;
export const COUNTDOWN_SECONDS = 3;
export const SERVER_TICK_MS = 50;
export const TIME_LIMIT_MIN = 30;
export const TIME_LIMIT_MAX = 300;
export const STRENGTH_BUFF_DURATION = 15;
export const STRENGTH_BUFF_MULTIPLIER = 2.5;

/** Battle mode — miners at top-left / top-right corners. */
export const BATTLE_MINER_A = { x: -480, y: 0 };
export const BATTLE_MINER_B = { x: 480, y: 0 };
/** Hook tips closer than this (game units) trigger a clash bounce. */
export const HOOK_CLASH_RADIUS = 32;
export const BOMB_COOLDOWN = 10;
export const BOMB_TTL = 1.6;
export const BOMB_COST = 100;
