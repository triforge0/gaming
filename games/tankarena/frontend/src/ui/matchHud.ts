import Phaser from 'phaser';
import { TEAM_CSS, formatClock } from './matchUi';

const BAR_HEIGHT = 44;
const BAR_Y = BAR_HEIGHT / 2;

export interface MatchHudState {
  timeMs: number;
  phasePlaying: boolean;
  redScore: number;
  blueScore: number;
  kills: number;
  deaths: number;
  assists: number;
  lives: number;
  pingMs: number;
  fps: number;
  roomName?: string;
}

export class MatchHud {
  private readonly container: Phaser.GameObjects.Container;
  private readonly timeText: Phaser.GameObjects.Text;
  private readonly roomText: Phaser.GameObjects.Text;
  private readonly redScoreText: Phaser.GameObjects.Text;
  private readonly blueScoreText: Phaser.GameObjects.Text;
  private readonly statsText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.container = scene.add.container(0, 0).setDepth(20);

    const bg = scene.add
      .rectangle(400, BAR_Y, 800, BAR_HEIGHT, 0x050508, 0.92)
      .setStrokeStyle(1, 0x2a2a38, 0.8);

    const divider = scene.add.rectangle(400, BAR_Y + 1, 800, 1, 0x333344, 0.45);

    this.timeText = scene.add
      .text(14, 14, '', { fontSize: '13px', color: '#eeeeee', fontFamily: 'monospace' })
      .setOrigin(0, 0);

    this.roomText = scene.add
      .text(14, 30, '', { fontSize: '10px', color: '#666666', fontFamily: 'monospace' })
      .setOrigin(0, 0);

    this.redScoreText = scene.add
      .text(352, 18, '', { fontSize: '14px', fontFamily: 'monospace', fontStyle: 'bold' })
      .setOrigin(1, 0)
      .setColor(TEAM_CSS[1] ?? '#e5484d');

    const scoreSep = scene.add
      .text(400, 18, '·', { fontSize: '14px', color: '#555555', fontFamily: 'monospace' })
      .setOrigin(0.5, 0);

    this.blueScoreText = scene.add
      .text(448, 18, '', { fontSize: '14px', fontFamily: 'monospace', fontStyle: 'bold' })
      .setOrigin(0, 0)
      .setColor(TEAM_CSS[2] ?? '#3b82f6');

    this.statsText = scene.add
      .text(786, 18, '', { fontSize: '12px', color: '#aaaaaa', fontFamily: 'monospace' })
      .setOrigin(1, 0);

    this.container.add([
      bg,
      divider,
      this.timeText,
      this.roomText,
      this.redScoreText,
      scoreSep,
      this.blueScoreText,
      this.statsText,
    ]);
  }

  update(state: MatchHudState): void {
    const time = state.phasePlaying ? formatClock(state.timeMs) : '--:--';
    this.timeText.setText(`TIME ${time}`);
    this.redScoreText.setText(`RED ${state.redScore}`);
    this.blueScoreText.setText(`BLUE ${state.blueScore}`);
    this.statsText.setText(
      `K${state.kills} D${state.deaths} A${state.assists} ♥${state.lives}  ` +
        `PING ${state.pingMs}ms  FPS ${Math.round(state.fps)}`,
    );

    if (state.roomName) {
      const label = state.roomName.length > 22 ? `${state.roomName.slice(0, 20)}…` : state.roomName;
      this.roomText.setText(label);
      this.roomText.setVisible(true);
    } else {
      this.roomText.setVisible(false);
    }
  }

  destroy(): void {
    this.container.destroy();
  }
}
