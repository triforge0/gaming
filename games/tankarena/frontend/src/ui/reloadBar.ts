import Phaser from 'phaser';

const SEGMENTS = 8;

export class ReloadBar {
  private readonly container: Phaser.GameObjects.Container;
  private readonly segments: Phaser.GameObjects.Rectangle[] = [];
  private readonly label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.container = scene.add.container(x, y).setDepth(20);

    this.label = scene.add
      .text(-SEGMENTS * 5, -14, 'RELOAD', {
        fontSize: '9px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0.5);

    for (let i = 0; i < SEGMENTS; i++) {
      const seg = scene.add
        .rectangle(i * 11, 0, 9, 8, 0x35c759, 1)
        .setStrokeStyle(1, 0x222222, 0.8);
      this.segments.push(seg);
    }

    this.container.add([this.label, ...this.segments]);
    this.setProgress(1);
  }

  setProgress(ratio: number): void {
    const clamped = Phaser.Math.Clamp(ratio, 0, 1);
    const filled = Math.round(clamped * SEGMENTS);
    for (let i = 0; i < SEGMENTS; i++) {
      const ready = i < filled;
      this.segments[i].setFillStyle(ready ? 0x35c759 : 0x2a2a30, ready ? 1 : 0.7);
    }
    this.container.setVisible(clamped < 1);
  }

  destroy(): void {
    this.container.destroy();
  }
}
