import Phaser from 'phaser';
import { TEAM_CSS } from './matchUi';

const MAX_ENTRIES = 5;
const ENTRY_LIFETIME_MS = 4500;
const ENTRY_HEIGHT = 22;

interface KillFeedEntry {
  row: Phaser.GameObjects.Container;
  expiresAt: number;
}

export class KillFeed {
  private readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly entries: KillFeedEntry[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(788, 56).setDepth(20);

    const title = scene.add
      .text(0, 0, 'KILL FEED', {
        fontSize: '10px',
        color: '#666666',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0);
    this.container.add(title);
  }

  pushKill(killerName: string, victimName: string, killerTeam?: number): void {
    const killerColor = killerTeam != null ? (TEAM_CSS[killerTeam] ?? '#cccccc') : '#cccccc';

    const row = this.scene.add.container(0, 18);
    const victimText = this.scene.add
      .text(0, 0, victimName, { fontSize: '12px', color: '#bbbbbb', fontFamily: 'monospace' })
      .setOrigin(0, 0);
    const arrowText = this.scene.add
      .text(victimText.width + 6, 0, '▶', { fontSize: '11px', color: '#666666', fontFamily: 'monospace' })
      .setOrigin(0, 0);
    const killerText = this.scene.add
      .text(arrowText.x + arrowText.width + 6, 0, killerName, {
        fontSize: '12px',
        color: killerColor,
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0);

    const totalWidth = killerText.x + killerText.width;
    row.add([victimText, arrowText, killerText]);
    row.setX(-totalWidth);

    this.container.add(row);
    this.entries.unshift({ row, expiresAt: this.scene.time.now + ENTRY_LIFETIME_MS });

    while (this.entries.length > MAX_ENTRIES) {
      const removed = this.entries.pop();
      removed?.row.destroy();
    }

    this.relayout();
    this.scene.tweens.add({ targets: row, alpha: { from: 0, to: 1 }, duration: 120 });
  }

  tick(now: number): void {
    let changed = false;
    for (let i = this.entries.length - 1; i >= 0; i--) {
      const entry = this.entries[i];
      const remaining = entry.expiresAt - now;
      if (remaining <= 0) {
        entry.row.destroy();
        this.entries.splice(i, 1);
        changed = true;
        continue;
      }
      if (remaining < 800) {
        entry.row.setAlpha(Math.max(0, remaining / 800));
      }
    }
    if (changed) {
      this.relayout();
    }
  }

  private relayout(): void {
    this.entries.forEach((entry, index) => {
      entry.row.setY(18 + index * ENTRY_HEIGHT);
    });
  }

  destroy(): void {
    for (const entry of this.entries) {
      entry.row.destroy();
    }
    this.entries.length = 0;
    this.container.destroy();
  }
}
