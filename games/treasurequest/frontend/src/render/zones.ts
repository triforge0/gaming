import Phaser from 'phaser';
import { MapZone } from '../content/mapOverlay';

const CHECKPOINT_COLOR = 0x35c759;
const BOSS_COLOR = 0xff6b6b;
const TREASURE_COLOR = 0xffd166;

export function drawZoneRect(
  scene: Phaser.Scene,
  zone: MapZone,
  tileSize: number,
  color: number,
  depth: number,
): Phaser.GameObjects.Rectangle {
  const w = zone.w * tileSize;
  const h = zone.h * tileSize;
  const x = zone.x * tileSize + w / 2;
  const y = zone.y * tileSize + h / 2;
  return scene.add
    .rectangle(x, y, w - 4, h - 4, color, 0.12)
    .setStrokeStyle(2, color, 0.65)
    .setDepth(depth);
}

export function drawCheckpointMarkers(
  scene: Phaser.Scene,
  checkpoints: MapZone[],
  tileSize: number,
): Phaser.GameObjects.GameObject[] {
  const objects: Phaser.GameObjects.GameObject[] = [];
  for (const cp of checkpoints) {
    const color = cp.boss ? BOSS_COLOR : CHECKPOINT_COLOR;
    objects.push(drawZoneRect(scene, cp, tileSize, color, 1));
    const label = scene.add
      .text(
        cp.x * tileSize + (cp.w * tileSize) / 2,
        cp.y * tileSize + (cp.h * tileSize) / 2,
        cp.id,
        { fontSize: '10px', color: '#ffffff', fontFamily: 'monospace' },
      )
      .setOrigin(0.5)
      .setDepth(2);
    objects.push(label);
  }
  return objects;
}

export function drawTreasureMarker(
  scene: Phaser.Scene,
  treasure: MapZone,
  tileSize: number,
): Phaser.GameObjects.GameObject[] {
  return [
    drawZoneRect(scene, treasure, tileSize, TREASURE_COLOR, 1),
    scene.add
      .text(
        treasure.x * tileSize + (treasure.w * tileSize) / 2,
        treasure.y * tileSize + (treasure.h * tileSize) / 2,
        '★',
        { fontSize: '16px', color: '#ffd166', fontFamily: 'monospace' },
      )
      .setOrigin(0.5)
      .setDepth(2),
  ];
}
