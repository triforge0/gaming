export const REPLAY_STORAGE_KEY = 'f1racing:last-replay';

export interface ReplayFrame {
  tick: number;
  playerId: number;
  displayName: string;
  carId: string;
  primaryColor: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  bot: boolean;
}

export interface ReplayDocument {
  version: string;
  roomId: string;
  trackId: string;
  durationMs: number;
  fileName: string;
  frames: ReplayFrame[];
}

export function groupFramesByTick(frames: ReplayFrame[]): Map<number, ReplayFrame[]> {
  const grouped = new Map<number, ReplayFrame[]>();
  for (const frame of frames) {
    const bucket = grouped.get(frame.tick) ?? [];
    bucket.push(frame);
    grouped.set(frame.tick, bucket);
  }
  return grouped;
}

export function sortedTicks(grouped: Map<number, ReplayFrame[]>): number[] {
  return [...grouped.keys()].sort((left, right) => left - right);
}
