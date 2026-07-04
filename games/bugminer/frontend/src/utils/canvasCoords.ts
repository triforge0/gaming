import { SETUP_ZONE } from '../shared';

/** Map HTML drop/click position on canvas container → game coordinates (setup zone). */
export function clientToGameCoords(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  const nx = (clientX - rect.left) / rect.width;
  const ny = (clientY - rect.top) / rect.height;
  const x = SETUP_ZONE.minX + nx * (SETUP_ZONE.maxX - SETUP_ZONE.minX);
  const y = SETUP_ZONE.minY + ny * (SETUP_ZONE.maxY - SETUP_ZONE.minY);
  return {
    x: Math.max(SETUP_ZONE.minX, Math.min(SETUP_ZONE.maxX, x)),
    y: Math.max(SETUP_ZONE.minY, Math.min(SETUP_ZONE.maxY, y)),
  };
}
