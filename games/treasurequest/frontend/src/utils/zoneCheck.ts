import { MapZone } from '../content/mapOverlay';

/** Matches server {@code WorldBounds.AVATAR_HALF_SIZE}. */
export const AVATAR_HALF_SIZE = 14;

export function avatarOverlapsZone(
  centerX: number,
  centerY: number,
  zone: MapZone,
  tileSize: number,
): boolean {
  const avatarMinX = centerX - AVATAR_HALF_SIZE;
  const avatarMaxX = centerX + AVATAR_HALF_SIZE;
  const avatarMinY = centerY - AVATAR_HALF_SIZE;
  const avatarMaxY = centerY + AVATAR_HALF_SIZE;

  const zoneMinX = zone.x * tileSize;
  const zoneMaxX = (zone.x + zone.w) * tileSize;
  const zoneMinY = zone.y * tileSize;
  const zoneMaxY = (zone.y + zone.h) * tileSize;

  return (
    avatarMaxX > zoneMinX &&
    avatarMinX < zoneMaxX &&
    avatarMaxY > zoneMinY &&
    avatarMinY < zoneMaxY
  );
}

export function findZone(id: string, checkpoints: MapZone[]): MapZone | undefined {
  return checkpoints.find((zone) => zone.id === id);
}
