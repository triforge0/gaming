import Phaser from 'phaser';
import { FogCellState, fogStyleForState } from './fog';

/**
 * Single RenderTexture fog mask. Cell updates repaint only changed tiles.
 */
export class FogLayer {
  private rt?: Phaser.GameObjects.RenderTexture;
  private cells = new Uint8Array(0);
  private mapWidth = 0;
  private mapHeight = 0;
  private tileSize = 32;

  constructor(private readonly scene: Phaser.Scene) {}

  destroy(): void {
    this.rt?.destroy();
    this.rt = undefined;
    this.cells = new Uint8Array(0);
  }

  resize(mapWidth: number, mapHeight: number, tileSize: number): void {
    const worldW = mapWidth * tileSize;
    const worldH = mapHeight * tileSize;

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tileSize = tileSize;

    if (worldW <= 0 || worldH <= 0) {
      this.rt?.destroy();
      this.rt = undefined;
      this.cells = new Uint8Array(0);
      return;
    }

    if (!this.rt || this.rt.width !== worldW || this.rt.height !== worldH) {
      this.rt?.destroy();
      this.rt = this.scene.add
        .renderTexture(0, 0, worldW, worldH)
        .setOrigin(0, 0)
        .setDepth(7);
      this.cells = new Uint8Array(0);
      this.clearAll();
    }
  }

  applySnapshot(next: Uint8Array): void {
    if (!this.rt || this.mapWidth <= 0 || this.mapHeight <= 0) {
      return;
    }
    const expected = this.mapWidth * this.mapHeight;
    if (next.length !== expected) {
      return;
    }

    if (this.cells.length !== expected) {
      this.rebuildAll(next);
      return;
    }

    for (let i = 0; i < expected; i++) {
      if (this.cells[i] === next[i]) {
        continue;
      }
      const x = i % this.mapWidth;
      const y = Math.floor(i / this.mapWidth);
      this.paintCell(x, y, next[i] ?? FogCellState.UNKNOWN);
    }
    this.cells = next.slice();
  }

  fillUnknown(): void {
    if (!this.rt || this.mapWidth <= 0 || this.mapHeight <= 0) {
      return;
    }
    const cells = new Uint8Array(this.mapWidth * this.mapHeight);
    this.rebuildAll(cells);
  }

  private rebuildAll(cells: Uint8Array): void {
    if (!this.rt) {
      return;
    }
    this.clearAll();
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const state = cells[y * this.mapWidth + x] ?? FogCellState.UNKNOWN;
        const style = fogStyleForState(state);
        if (style) {
          this.paintCell(x, y, state);
        }
      }
    }
    this.cells = cells.slice();
  }

  private paintCell(x: number, y: number, state: number): void {
    if (!this.rt) {
      return;
    }
    const px = x * this.tileSize;
    const py = y * this.tileSize;
    const style = fogStyleForState(state);
    if (!style) {
      this.clearRegion(px, py, this.tileSize, this.tileSize);
      return;
    }
    this.rt.fill(style.color, style.alpha, px, py, this.tileSize, this.tileSize);
  }

  private dynamicTexture(): Phaser.Textures.DynamicTexture {
    return this.rt!.texture as Phaser.Textures.DynamicTexture;
  }

  /** Phaser only clears a DynamicTexture when its dirty flag is set. */
  private markDirty(): void {
    (this.dynamicTexture() as Phaser.Textures.DynamicTexture & { dirty: boolean }).dirty = true;
  }

  private clearAll(): void {
    if (!this.rt) {
      return;
    }
    this.markDirty();
    this.dynamicTexture().clear();
  }

  private clearRegion(x: number, y: number, width: number, height: number): void {
    if (!this.rt) {
      return;
    }
    this.markDirty();
    this.dynamicTexture().clear(x, y, width, height);
  }
}
