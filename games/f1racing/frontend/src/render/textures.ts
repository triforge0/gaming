import * as THREE from 'three';

/** Small procedural texture helpers so the scene needs no external asset files (LAN/offline). */

function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  return { canvas, ctx };
}

function finish(canvas: HTMLCanvasElement, repeat: number): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Dark tarmac with fine speckle + faint diagonal grain. */
export function makeAsphaltTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = '#23262d';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    const shade = 20 + Math.random() * 60;
    ctx.fillStyle = `rgba(${shade},${shade + 4},${shade + 10},${0.05 + Math.random() * 0.18})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.10)';
  ctx.lineWidth = 1;
  for (let i = -256; i < 256; i += 12) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }
  return finish(canvas, 1);
}

/** Layered green grass with lighter/darker mowing patches. */
export function makeGrassTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = '#37622f';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 32; i += 2) {
    ctx.fillStyle = i % 4 === 0 ? 'rgba(64,110,52,0.55)' : 'rgba(44,84,38,0.45)';
    ctx.fillRect(0, i * 8, 256, 8);
  }
  for (let i = 0; i < 6000; i++) {
    const g = 60 + Math.random() * 90;
    ctx.fillStyle = `rgba(${g * 0.5},${g},${g * 0.4},${0.06 + Math.random() * 0.14})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  return finish(canvas, 1);
}

/** Black/white checker for the start-finish line. */
export function makeCheckerTexture(cells = 8): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(128);
  const s = 128 / cells;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#f4f4f4' : '#141414';
      ctx.fillRect(x * s, y * s, s, s);
    }
  }
  const texture = finish(canvas, 1);
  texture.repeat.set(1, 1);
  return texture;
}
