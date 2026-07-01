import Phaser from 'phaser';
import { MatchPhase } from '@triforge/shared-ui';
import { TEAM_CSS, teamLabel } from './matchUi';

export interface MatchStatusState {
  phase: number;
  countdownSeconds: number;
  redScore: number;
  blueScore: number;
  bannerText?: string;
  bannerColor?: string;
}

export class MatchStatusBanner {
  private readonly scene: Phaser.Scene;
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly bannerText: Phaser.GameObjects.Text;
  private bannerTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.statusText = scene.add
      .text(400, 48, '', {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0)
      .setDepth(19);

    this.bannerText = scene.add
      .text(400, 300, '', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(21)
      .setAlpha(0);
  }

  update(state: MatchStatusState): void {
    if (state.phase === MatchPhase.COUNTDOWN) {
      const sec = state.countdownSeconds;
      this.statusText.setText(sec > 0 ? 'PREPARING…' : 'STARTING…');
      return;
    }

    if (state.phase === MatchPhase.PLAYING) {
      if (state.redScore === state.blueScore) {
        this.statusText.setText('MATCH TIED');
        this.statusText.setColor('#888888');
      } else if (state.redScore > state.blueScore) {
        this.statusText.setText('RED LEADING');
        this.statusText.setColor(TEAM_CSS[1] ?? '#e5484d');
      } else {
        this.statusText.setText('BLUE LEADING');
        this.statusText.setColor(TEAM_CSS[2] ?? '#3b82f6');
      }
      return;
    }

    if (state.phase === MatchPhase.ENDED) {
      this.statusText.setText('MATCH ENDED');
      return;
    }

    this.statusText.setText('');
  }

  showCountdownNumber(seconds: number): void {
    this.bannerText.setText(seconds > 0 ? String(seconds) : 'GO!');
    this.bannerText.setFontSize(seconds > 0 ? '72px' : '56px');
    this.bannerText.setColor('#ffffff');
    this.bannerText.setAlpha(1);
    this.bannerText.setScale(1.2);
    this.scene.tweens.add({
      targets: this.bannerText,
      scale: 1,
      duration: 280,
      ease: 'Back.easeOut',
    });
    if (seconds <= 0) {
      this.scene.time.delayedCall(700, () => {
        if (this.bannerText.text === 'GO!') {
          this.fadeOutBanner();
        }
      });
    }
  }

  showBanner(text: string, color = '#ffffff', durationMs = 2200): void {
    this.bannerTimer?.remove();
    this.bannerText.setText(text);
    this.bannerText.setFontSize(28);
    this.bannerText.setColor(color);
    this.bannerText.setAlpha(1);
    this.bannerText.setScale(1);
    this.bannerTimer = this.scene.time.delayedCall(durationMs, () => this.fadeOutBanner());
  }

  clearBanner(): void {
    this.bannerTimer?.remove();
    this.bannerText.setText('');
    this.bannerText.setAlpha(0);
  }

  private fadeOutBanner(): void {
    this.scene.tweens.add({
      targets: this.bannerText,
      alpha: 0,
      duration: 350,
    });
  }

  showVictory(team: number): void {
    const label = team === 1 || team === 2 ? `${teamLabel(team).toUpperCase()} WINS` : 'DRAW';
    const color = TEAM_CSS[team] ?? '#ffffff';
    this.showBanner(label, color, 3500);
  }

  destroy(): void {
    this.bannerTimer?.remove();
    this.statusText.destroy();
    this.bannerText.destroy();
  }
}
