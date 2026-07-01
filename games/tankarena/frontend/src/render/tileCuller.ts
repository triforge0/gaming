export interface TileCullBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const EMPTY_BOUNDS: TileCullBounds = { minX: -1, minY: -1, maxX: -1, maxY: -1 };

export function computeTileCullBounds(
  scrollX: number,
  scrollY: number,
  viewWidth: number,
  viewHeight: number,
  mapWidth: number,
  mapHeight: number,
  tileSize: number,
  marginTiles = 2,
): TileCullBounds {
  if (mapWidth <= 0 || mapHeight <= 0 || tileSize <= 0) {
    return EMPTY_BOUNDS;
  }
  return {
    minX: Math.max(0, Math.floor(scrollX / tileSize) - marginTiles),
    minY: Math.max(0, Math.floor(scrollY / tileSize) - marginTiles),
    maxX: Math.min(mapWidth - 1, Math.ceil((scrollX + viewWidth) / tileSize) + marginTiles),
    maxY: Math.min(mapHeight - 1, Math.ceil((scrollY + viewHeight) / tileSize) + marginTiles),
  };
}

export function boundsEqual(a: TileCullBounds, b: TileCullBounds): boolean {
  return a.minX === b.minX && a.minY === b.minY && a.maxX === b.maxX && a.maxY === b.maxY;
}

export function iterCullTiles(bounds: TileCullBounds): Array<{ x: number; y: number }> {
  if (bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
    return [];
  }
  const tiles: Array<{ x: number; y: number }> = [];
  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      tiles.push({ x, y });
    }
  }
  return tiles;
}

export function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}
