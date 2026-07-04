/** 3D world layout — Gold Miner style side view */
export const MINER_Y = 400;
export const HOOK_ORIGIN_Z = 10;

/** Game Y grows downward into the mine; Three.js Y grows upward */
export function gameYToWorldY(gameY: number): number {
  return MINER_Y - gameY;
}

export function worldYToGameY(worldY: number): number {
  return MINER_Y - worldY;
}
