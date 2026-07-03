import * as THREE from 'three';

const FONT = '600 28px system-ui, sans-serif';
const PAD_X = 12;
const LABEL_H = 44;
/** On-screen height of the billboard in world units (tank hull ≈ 28 wide). */
const SPRITE_HEIGHT = 7;

/**
 * Billboard sprite drawn from canvas text — floats above a tank and always faces the camera.
 */
export class NameLabel {
  readonly sprite: THREE.Sprite;
  private readonly material: THREE.SpriteMaterial;
  private lastKey = '';

  constructor() {
    this.material = new THREE.SpriteMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.sprite = new THREE.Sprite(this.material);
    this.sprite.position.y = 19;
    this.sprite.renderOrder = 10;
  }

  set(name: string, color: number): void {
    const text = name.trim() || 'Pilot';
    const key = `${text}|${color}`;
    if (key === this.lastKey) return;
    this.lastKey = key;

    const measure = document.createElement('canvas').getContext('2d')!;
    measure.font = FONT;
    const textW = Math.ceil(measure.measureText(text).width);
    const w = textW + PAD_X * 2;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = LABEL_H;
    const ctx = canvas.getContext('2d')!;
    ctx.font = FONT;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.fillRect(0, 0, w, LABEL_H);

    const hex = `#${color.toString(16).padStart(6, '0')}`;
    ctx.strokeStyle = hex;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, LABEL_H - 2);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, LABEL_H / 2);

    if (this.material.map) this.material.map.dispose();
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    this.material.map = tex;

    const aspect = w / LABEL_H;
    this.sprite.scale.set(SPRITE_HEIGHT * aspect, SPRITE_HEIGHT, 1);
  }

  dispose(): void {
    if (this.material.map) this.material.map.dispose();
    this.material.dispose();
  }
}
