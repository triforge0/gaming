import * as THREE from 'three';
import { TileType } from '@triforge/shared-ui';

const SIZE = 128;

type DrawFn = (ctx: CanvasRenderingContext2D, size: number) => void;

function canvasTexture(draw: DrawFn): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2d context unavailable');
  }
  draw(ctx, SIZE);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function drawGrass(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = '#3d5238';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const h = 2 + Math.random() * 5;
    ctx.strokeStyle = Math.random() > 0.5 ? '#4a6344' : '#2f402c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y - h);
    ctx.stroke();
  }
  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = `rgba(${60 + Math.random() * 30}, ${90 + Math.random() * 40}, ${50 + Math.random() * 20}, 0.35)`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 4, 2 + Math.random() * 4);
  }
}

function drawBrick(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = '#8a4520';
  ctx.fillRect(0, 0, size, size);
  const rows = 8;
  const cols = 4;
  const mortar = 3;
  const rowH = size / rows;
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : rowH / 2;
    for (let col = -1; col < cols; col++) {
      const x = col * (size / cols) + offset;
      const y = row * rowH;
      const w = size / cols - mortar;
      const h = rowH - mortar;
      const shade = 0.85 + Math.random() * 0.15;
      ctx.fillStyle = `rgb(${Math.floor(170 * shade)}, ${Math.floor(78 * shade)}, ${Math.floor(36 * shade)})`;
      ctx.fillRect(x + mortar / 2, y + mortar / 2, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(x + mortar / 2, y + h * 0.55, w, h * 0.12);
    }
  }
}

function drawSteel(ctx: CanvasRenderingContext2D, size: number): void {
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#b8c0c8');
  grad.addColorStop(0.5, '#8a929a');
  grad.addColorStop(1, '#6a727a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const y = (i + 0.5) * (size / 6);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    const x = 8 + (i % 4) * 28;
    const y = 10 + Math.floor(i / 4) * 38;
    ctx.fillStyle = '#5a626a';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d0d8e0';
    ctx.beginPath();
    ctx.arc(x - 0.8, y - 0.8, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWater(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = '#1a4a78';
  ctx.fillRect(0, 0, size, size);
  for (let band = 0; band < 5; band++) {
    ctx.strokeStyle = `rgba(${100 + band * 15}, ${170 + band * 10}, ${230}, ${0.25 + band * 0.08})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 4) {
      const y = size * 0.2 + band * 14 + Math.sin((x + band * 20) * 0.08) * 6;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawWall(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = '#6a6e74';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = `rgba(${90 + Math.random() * 40}, ${90 + Math.random() * 40}, ${95 + Math.random() * 40}, 0.5)`;
    ctx.fillRect(x, y, 4 + Math.random() * 10, 3 + Math.random() * 6);
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * size / 4);
    ctx.lineTo(size, i * size / 4);
    ctx.stroke();
  }
}

function drawHq(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = '#c8a830';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#9a7820';
  ctx.fillRect(0, size * 0.72, size, size * 0.28);
  const cols = 3;
  const rows = 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 16 + c * 36;
      const y = 18 + r * 34;
      ctx.fillStyle = '#2a3540';
      ctx.fillRect(x, y, 22, 24);
      ctx.fillStyle = 'rgba(120,180,220,0.45)';
      ctx.fillRect(x + 3, y + 3, 16, 18);
    }
  }
  ctx.fillStyle = '#8a2020';
  ctx.fillRect(size * 0.42, 4, size * 0.16, size * 0.12);
}

const DRAWERS: Partial<Record<number, DrawFn>> = {
  [TileType.BRICK]: drawBrick,
  [TileType.STEEL]: drawSteel,
  [TileType.WATER]: drawWater,
  [TileType.WALL]: drawWall,
  [TileType.HQ]: drawHq,
};

/** Cached procedural tile textures and shared materials. */
export class TileTextures {
  private static textures = new Map<number, THREE.CanvasTexture>();
  private static materials = new Map<number, THREE.MeshStandardMaterial>();
  private static grassTex: THREE.CanvasTexture | null = null;
  private static grassMat: THREE.MeshStandardMaterial | null = null;

  static grassMaterial(): THREE.MeshStandardMaterial {
    if (!this.grassMat) {
      this.grassTex = canvasTexture(drawGrass);
      this.grassMat = new THREE.MeshStandardMaterial({
        map: this.grassTex,
        roughness: 0.95,
        metalness: 0,
      });
    }
    return this.grassMat;
  }

  static materialFor(tile: number): THREE.MeshStandardMaterial | null {
    const drawer = DRAWERS[tile];
    if (!drawer) return null;

    let mat = this.materials.get(tile);
    if (mat) return mat;

    let tex = this.textures.get(tile);
    if (!tex) {
      tex = canvasTexture(drawer);
      this.textures.set(tile, tex);
    }

    const isWater = tile === TileType.WATER;
    mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: isWater ? 0.15 : 0.88,
      metalness: isWater ? 0.05 : tile === TileType.STEEL ? 0.35 : 0,
      transparent: isWater,
      opacity: isWater ? 0.82 : 1,
    });
    this.materials.set(tile, mat);
    return mat;
  }

  /** Configure texture repeat for a tile-sized surface. */
  static applyRepeat(material: THREE.MeshStandardMaterial, repeat: number): void {
    const map = material.map;
    if (!map) return;
    map.repeat.set(repeat, repeat);
  }

  static applyGrassRepeat(material: THREE.MeshStandardMaterial, tilesWide: number, tilesHigh: number): void {
    const map = material.map;
    if (!map) return;
    map.repeat.set(Math.max(1, tilesWide / 2), Math.max(1, tilesHigh / 2));
  }
}
