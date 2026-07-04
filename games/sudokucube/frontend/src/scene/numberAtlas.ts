// src/scene/numberAtlas.ts
import * as THREE from 'three';

export type NumberStyle = 'given' | 'player' | 'correct' | 'wrong';
const STYLE_ORDER: NumberStyle[] = ['given', 'player', 'correct', 'wrong'];
const CELL_PX = 128;

/** Atlas 4×4: cột = chữ số 1–4, hàng = style. Một texture dùng chung cho 96 ô. */
export function createNumberAtlas(colors: Record<NumberStyle, string>): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = CELL_PX * 4;
  canvas.height = CELL_PX * 4;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${CELL_PX * 0.62}px system-ui, sans-serif`;
  STYLE_ORDER.forEach((style, rowIdx) => {
    ctx.fillStyle = colors[style];
    for (let digit = 1; digit <= 4; digit++) {
      ctx.fillText(String(digit), (digit - 0.5) * CELL_PX, (rowIdx + 0.5) * CELL_PX);
    }
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

export function atlasRegion(digit: number, style: NumberStyle): { offset: [number, number]; repeat: [number, number] } {
  const rowIdx = STYLE_ORDER.indexOf(style);
  // canvas y hướng xuống, UV v hướng lên → đảo hàng
  return { offset: [(digit - 1) / 4, (3 - rowIdx) / 4], repeat: [0.25, 0.25] };
}
