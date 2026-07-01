import type { com } from '@triforge/shared-ui';

export type IFogSnapshot = com.triforge.protocol.proto.IFogSnapshot;

export const FogCellState = {
  UNKNOWN: 0,
  SEEN: 1,
  VISIBLE: 2,
} as const;

export type FogCellStateValue = (typeof FogCellState)[keyof typeof FogCellState];

const FOG_STYLES: Record<FogCellStateValue, { color: number; alpha: number } | null> = {
  [FogCellState.UNKNOWN]: { color: 0x030308, alpha: 0.97 },
  [FogCellState.SEEN]: { color: 0x0e0e18, alpha: 0.72 },
  [FogCellState.VISIBLE]: null,
};

export function fogCellsFromSnapshot(fog: IFogSnapshot): Uint8Array {
  const raw = fog.cells;
  if (!raw) {
    return new Uint8Array(0);
  }
  if (raw instanceof Uint8Array) {
    return raw;
  }
  return Uint8Array.from(raw as ArrayLike<number>);
}

export function fogStyleForState(state: number): { color: number; alpha: number } | null {
  if (state === FogCellState.VISIBLE) {
    return null;
  }
  return FOG_STYLES[state as FogCellStateValue] ?? FOG_STYLES[FogCellState.UNKNOWN];
}

export function isFogSnapshotUsable(
  fog: IFogSnapshot | null | undefined,
  expectedWidth: number,
  expectedHeight: number,
): fog is IFogSnapshot {
  if (!fog?.cells) {
    return false;
  }
  const width = fog.width ?? 0;
  const height = fog.height ?? 0;
  if (width !== expectedWidth || height !== expectedHeight) {
    return false;
  }
  const cells = fogCellsFromSnapshot(fog);
  return cells.length === width * height;
}
