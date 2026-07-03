import Phaser from 'phaser';
import { TileType } from '@triforge/shared-ui';

const TILE_COLORS: Record<number, number> = {
  [TileType.BRICK]: 0xb55239,
  [TileType.STEEL]: 0x5c5c68,
  [TileType.WATER]: 0x2f6fed,
  [TileType.TREE]: 0x2d6a4f,
  [TileType.COVER]: 0x2d6a4f,
  [TileType.WALL]: 0x3d3d3d,
};

function drawSteelPattern(graphics: Phaser.GameObjects.Graphics, size: number): void {
  graphics.clear();
  graphics.fillStyle(0x5c5c68, 1);
  graphics.fillRect(-size / 2, -size / 2, size, size);
  graphics.lineStyle(1, 0x787888, 0.55);
  for (let offset = -size / 2 + 4; offset < size / 2; offset += 8) {
    graphics.lineBetween(offset, -size / 2, offset, size / 2);
    graphics.lineBetween(-size / 2, offset, size / 2, offset);
  }
  graphics.lineStyle(2, 0x3a3a44, 1);
  graphics.strokeRect(-size / 2 + 1, -size / 2 + 1, size - 2, size - 2);
}

export function createTileVisual(
  scene: Phaser.Scene,
  centerX: number,
  centerY: number,
  tile: number,
  tileSize: number,
): Phaser.GameObjects.Container {
  const container = scene.add.container(centerX, centerY).setDepth(0);
  const alpha = tile === TileType.TREE || tile === TileType.COVER ? 0.75 : 1;

  if (tile === TileType.STEEL || tile === TileType.WALL) {
    const pattern = scene.add.graphics();
    drawSteelPattern(pattern, tileSize);
    container.add(pattern);
  } else {
    const color = TILE_COLORS[tile] ?? 0x2a2a32;
    const rect = scene.add
      .rectangle(0, 0, tileSize, tileSize, color, alpha)
      .setStrokeStyle(1, 0x111111, 0.35);
    container.add(rect);
  }

  return container;
}
