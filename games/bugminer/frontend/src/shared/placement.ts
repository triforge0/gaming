import { getItemRadius, getItemScale } from './items';
import { SETUP_ZONE } from './constants';
import type { PlacedItem, Vec2 } from './types';

export function isValidPlacement(
  itemId: string,
  position: Vec2,
  items: PlacedItem[],
): boolean {
  if (
    position.x < SETUP_ZONE.minX ||
    position.x > SETUP_ZONE.maxX ||
    position.y < SETUP_ZONE.minY ||
    position.y > SETUP_ZONE.maxY
  ) {
    return false;
  }

  const item = items.find((i) => i.id === itemId);
  if (!item) return false;

  const radius = getItemRadius(item.type, getItemScale(item));

  for (const other of items) {
    if (other.id === itemId || other.collected) continue;
    if (other.position.x === 0 && other.position.y === 0) continue;
    const otherRadius = getItemRadius(other.type, getItemScale(other));
    const dx = position.x - other.position.x;
    const dy = position.y - other.position.y;
    const minDist = radius + otherRadius + 8;
    if (Math.sqrt(dx * dx + dy * dy) < minDist) return false;
  }

  return true;
}
