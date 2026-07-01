import Phaser from 'phaser';

const TEXTURE_KEY = 'explosion-particle';

function ensureParticleTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }
  const size = 8;
  const graphics = scene.make.graphics({}, false);
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(size / 2, size / 2, size / 2);
  graphics.generateTexture(TEXTURE_KEY, size, size);
  graphics.destroy();
}

export function spawnExplosion(
  scene: Phaser.Scene,
  x: number,
  y: number,
  intensity = 1,
): void {
  ensureParticleTexture(scene);

  const count = Math.max(8, Math.round(14 * intensity));
  const emitter = scene.add.particles(x, y, TEXTURE_KEY, {
    speed: { min: 70 * intensity, max: 170 * intensity },
    angle: { min: 0, max: 360 },
    scale: { start: 0.9 * intensity, end: 0 },
    alpha: { start: 1, end: 0 },
    lifespan: { min: 180, max: 360 },
    quantity: count,
    tint: [0xffffff, 0xffee88, 0xffaa00, 0xff5500, 0xcc2200],
    blendMode: Phaser.BlendModes.ADD,
  });
  emitter.setDepth(8);
  emitter.explode(count);

  const flash = scene.add.circle(x, y, 5 * intensity, 0xfff4cc, 0.95).setDepth(8);
  scene.tweens.add({
    targets: flash,
    scale: 2.8 * intensity,
    alpha: 0,
    duration: 160,
    ease: 'Cubic.easeOut',
    onComplete: () => flash.destroy(),
  });

  const smoke = scene.add.circle(x, y, 8 * intensity, 0x555555, 0.35).setDepth(7);
  scene.tweens.add({
    targets: smoke,
    scale: 2.2 * intensity,
    alpha: 0,
    duration: 420,
    ease: 'Quad.easeOut',
    onComplete: () => smoke.destroy(),
  });

  scene.time.delayedCall(500, () => emitter.destroy());
}
