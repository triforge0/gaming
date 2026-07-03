import Phaser from 'phaser';
import {
  GameClient,
  ILeaderboardEntry,
  IMatchResult,
  MatchPhase,
} from '@triforge/shared-ui';
import { renderLeaderboardHtml } from '../ui/leaderboard/LeaderboardPanel';

interface ScoreboardData {
  result?: IMatchResult;
}

export default class ScoreboardScene extends Phaser.Scene {
  private client!: GameClient;
  private result?: IMatchResult;
  private returnedToLobby = false;
  private standingsEl?: HTMLDivElement;

  constructor() {
    super({ key: 'ScoreboardScene' });
  }

  init(data: ScoreboardData): void {
    this.result = data?.result;
    this.returnedToLobby = false;
  }

  create(): void {
    const client = this.registry.get('client') as GameClient | undefined;
    if (!client) {
      this.scene.start('LobbyScene');
      return;
    }
    this.client = client;
    this.result = this.result ?? client.lastResult ?? undefined;

    this.add.rectangle(400, 300, 800, 600, 0x0a0a0c, 0.94).setDepth(0);

    this.add
      .text(400, 48, 'Expedition Complete', {
        fontSize: '28px',
        color: '#ffd166',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(1);

    this.renderResults();

    this.add
      .text(400, 548, 'Waiting to return to lobby…', {
        fontSize: '13px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(1);

    this.client.handlers = {
      onTreasureQuestMessage: (message) => {
        if (message.leaderboard?.finalStandings) {
          this.client.lastLeaderboard = message.leaderboard;
          this.renderStandingsDom(message.leaderboard.entries ?? []);
        }
      },
      onLobbySnapshot: (lobby) => {
        if ((lobby.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY) {
          this.toLobby();
        }
      },
      onMatchPhaseUpdate: (update) => {
        if ((update.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY) {
          this.toLobby();
        }
      },
      onDisconnected: () => this.scene.start('LobbyScene'),
    };

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

    if ((this.client.lastLobby?.phase ?? -1) === MatchPhase.LOBBY) {
      this.toLobby();
    }
  }

  shutdown(): void {
    this.standingsEl?.remove();
    this.standingsEl = undefined;
  }

  private toLobby(): void {
    if (this.returnedToLobby) {
      return;
    }
    this.returnedToLobby = true;
    this.scene.start('RoomLobbyScene', this.registry.get('connection'));
  }

  private renderResults(): void {
    const finalBoard = this.client.lastLeaderboard;
    if (finalBoard?.finalStandings && (finalBoard.entries?.length ?? 0) > 0) {
      this.renderStandingsDom(finalBoard.entries ?? []);
      return;
    }

    this.add
      .text(400, 280, 'Waiting for final standings…', {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
        align: 'center',
        wordWrap: { width: 520 },
      })
      .setOrigin(0.5)
      .setDepth(1);
  }

  private renderStandingsDom(entries: ILeaderboardEntry[]): void {
    if (!this.standingsEl) {
      this.standingsEl = document.createElement('div');
      this.standingsEl.style.cssText =
        'position:absolute;left:50%;top:120px;transform:translateX(-50%);width:min(520px,92vw);' +
        'padding:14px 16px;border-radius:10px;background:rgba(0,0,0,0.55);color:#ddd;' +
        'font:14px/1.6 monospace;white-space:pre-line;z-index:30;text-align:left;';
      document.body.appendChild(this.standingsEl);
    }

    this.standingsEl.textContent = renderLeaderboardHtml(
      { entries, finalStandings: true },
      this.client.selfPlayerId,
    );
  }
}
