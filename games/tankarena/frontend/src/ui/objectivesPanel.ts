import Phaser from 'phaser';
import { Team } from '@triforge/shared-ui';
import { TEAM_CSS, teamLabel } from './matchUi';

const PAD = 12;

export class ObjectivesPanel {
  private readonly container: Phaser.GameObjects.Container;
  private readonly line1: Phaser.GameObjects.Text;
  private readonly line2: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.container = scene.add.container(12, 56).setDepth(20);

    const bg = scene.add
      .rectangle(0, 0, 160, 72, 0x050508, 0.92)
      .setStrokeStyle(1, 0x2a2a38, 0.8)
      .setOrigin(0, 0);

    const title = scene.add
      .text(PAD, PAD, 'OBJECTIVES', {
        fontSize: '10px',
        color: '#666666',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0);

    this.line1 = scene.add
      .text(PAD, PAD + 16, '', { fontSize: '11px', fontFamily: 'monospace' })
      .setOrigin(0, 0);

    this.line2 = scene.add
      .text(PAD, PAD + 32, '', {
        fontSize: '11px',
        color: '#cccccc',
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0);

    this.container.add([bg, title, this.line1, this.line2]);
    this.setSelfTeam(Team.TEAM_NONE);
  }

  setSelfTeam(team: number): void {
    if (team === Team.TEAM_RED || team === Team.TEAM_BLUE) {
      const ally = teamLabel(team).toUpperCase();
      const enemy = team === Team.TEAM_RED ? 'BLUE' : 'RED';
      this.line1.setText(`▸ Protect ${ally} HQ`);
      this.line1.setColor(TEAM_CSS[team] ?? '#cccccc');
      this.line2.setText(`▸ Destroy ${enemy} HQ`);
    } else {
      this.line1.setText('▸ Protect your base');
      this.line1.setColor('#cccccc');
      this.line2.setText('▸ Destroy enemy HQ');
    }
  }

  destroy(): void {
    this.container.destroy();
  }
}
