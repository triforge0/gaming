import Phaser from 'phaser';

export function shakeCamera(scene: Phaser.Scene, intensity = 0.004, durationMs = 120): void {
  scene.cameras.main.shake(durationMs, intensity);
}

export function flashTankBody(
  scene: Phaser.Scene,
  body: Phaser.GameObjects.Rectangle,
  teamColor: number,
): void {
  body.setFillStyle(0xffffff, 1);
  scene.time.delayedCall(80, () => body.setFillStyle(teamColor, 1));
}

export function spawnRespawnPulse(scene: Phaser.Scene, container: Phaser.GameObjects.Container): void {
  container.setScale(0.3);
  container.setAlpha(0.4);
  scene.tweens.add({
    targets: container,
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    duration: 350,
    ease: 'Back.easeOut',
  });
}
