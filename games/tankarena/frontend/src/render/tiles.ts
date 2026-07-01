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
  graphics.lineStyle(1, 0x9090a0, 0.35);
  graphics.lineBetween(-size / 2 + 3, -size / 2 + 3, size / 2 - 3, size / 2 - 3);
  graphics.lineBetween(size / 2 - 3, -size / 2 + 3, -size / 2 + 3, size / 2 - 3);
}

function drawBrickPattern(graphics: Phaser.GameObjects.Graphics, size: number): void {
  graphics.clear();
  graphics.fillStyle(0xb55239, 1);
  graphics.fillRect(-size / 2, -size / 2, size, size);
  graphics.lineStyle(1, 0x7a3525, 0.85);
  const rowH = size / 4;
  for (let row = 0; row < 4; row++) {
    const y = -size / 2 + row * rowH;
    graphics.lineBetween(-size / 2, y, size / 2, y);
    const offset = row % 2 === 0 ? 0 : size / 8;
    for (let x = -size / 2 + offset; x < size / 2; x += size / 4) {
      graphics.lineBetween(x, y, x, y + rowH);
    }
  }
}

export function headquartersFloorColor(): number {
  return 0x252530;
}

export function tileFillColor(tile: number): number {
  if (tile === TileType.HQ) {
    return headquartersFloorColor();
  }
  return TILE_COLORS[tile] ?? 0xffffff;
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
  } else if (tile === TileType.BRICK) {
    const pattern = scene.add.graphics();
    drawBrickPattern(pattern, tileSize);
    container.add(pattern);
  } else {
    const color = tileFillColor(tile);
    const rect = scene.add
      .rectangle(0, 0, tileSize, tileSize, color, alpha)
      .setStrokeStyle(1, 0x111111, 0.35);
    container.add(rect);
  }

  return container;
}

export function updateTileVisual(container: Phaser.GameObjects.Container, tile: number, tileSize: number): void {
  container.removeAll(true);
  const alpha = tile === TileType.TREE || tile === TileType.COVER ? 0.75 : 1;

  if (tile === TileType.STEEL || tile === TileType.WALL) {
    const pattern = container.scene.add.graphics();
    drawSteelPattern(pattern, tileSize);
    container.add(pattern);
  } else if (tile === TileType.BRICK) {
    const pattern = container.scene.add.graphics();
    drawBrickPattern(pattern, tileSize);
    container.add(pattern);
  } else {
    const color = tileFillColor(tile);
    const rect = container.scene.add
      .rectangle(0, 0, tileSize, tileSize, color, alpha)
      .setStrokeStyle(1, 0x111111, 0.35);
    container.add(rect);
  }
}
