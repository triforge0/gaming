import Phaser from 'phaser';
import {
  GameClient,
  IMatchResult,
  IPlayerMatchStats,
  MatchPhase,
  Team,
  toNum,
} from '@triforge/shared-ui';
import { TEAM_CSS, teamLabel } from '../ui/matchUi';

interface ScoreboardData {
  result?: IMatchResult;
}

export default class ScoreboardScene extends Phaser.Scene {
  private client!: GameClient;
  private result?: IMatchResult;
  private returnedToLobby = false;

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

    this.renderVictoryBanner();
    this.renderMvp();
    this.renderTable();

    this.add
      .text(400, 548, 'Đang chờ quay lại lobby…', {
        fontSize: '13px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(1);

    this.client.handlers = {
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
    /* no DOM cleanup needed */
  }

  private toLobby(): void {
    if (this.returnedToLobby) {
      return;
    }
    this.returnedToLobby = true;
    const connection = this.registry.get('connection');
    this.scene.start('RoomLobbyScene', connection);
  }

  private renderVictoryBanner(): void {
    const winningTeam = this.result?.winningTeam ?? Team.TEAM_NONE;
    const redScore = this.result?.redScore ?? 0;
    const blueScore = this.result?.blueScore ?? 0;

    this.add
      .text(400, 36, 'VICTORY', {
        fontSize: '16px',
        color: '#666666',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1);

    const headline =
      winningTeam === Team.TEAM_RED
        ? 'RED TEAM WINS'
        : winningTeam === Team.TEAM_BLUE
          ? 'BLUE TEAM WINS'
          : 'DRAW';
    const headlineColor =
      winningTeam === Team.TEAM_NONE ? '#ffffff' : TEAM_CSS[winningTeam] ?? '#ffffff';

    this.add
      .text(400, 68, headline, {
        fontSize: '36px',
        color: headlineColor,
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1);

    this.add
      .text(400, 108, `Red ${redScore}   —   ${blueScore} Blue`, {
        fontSize: '16px',
        color: '#cccccc',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setDepth(1);
  }

  private renderMvp(): void {
    const stats = this.result?.stats ?? [];
    if (stats.length === 0) {
      return;
    }

    const mvp = [...stats].sort((a, b) => {
      const killDiff = (b.kills ?? 0) - (a.kills ?? 0);
      if (killDiff !== 0) {
        return killDiff;
      }
      return (a.deaths ?? 0) - (b.deaths ?? 0);
    })[0];

    const teamColor = TEAM_CSS[mvp.team ?? Team.TEAM_NONE] ?? '#ffd166';
    const container = this.add.container(400, 158).setDepth(1);
    const bg = this.add
      .rectangle(0, 0, 320, 52, 0x16161e, 0.95)
      .setStrokeStyle(2, 0xffd166, 0.9);
    const label = this.add
      .text(-140, 0, '★ MVP', {
        fontSize: '14px',
        color: '#ffd166',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);
    const name = this.add
      .text(-80, -8, mvp.displayName ?? 'Player', {
        fontSize: '16px',
        color: teamColor,
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);
    const detail = this.add
      .text(-80, 12, `${mvp.kills ?? 0} Kills   ${mvp.deaths ?? 0} Deaths   ${mvp.assists ?? 0} Assists`, {
        fontSize: '11px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0.5);
    container.add([bg, label, name, detail]);
  }

  private renderTable(): void {
    const header = `${'PLAYER'.padEnd(16)}${'K'.padStart(4)}${'D'.padStart(4)}${'A'.padStart(4)}${'DMG'.padStart(6)}${'ACC'.padStart(7)}`;
    this.add
      .text(150, 210, header, {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setDepth(1);

    let y = 238;
    for (const team of [Team.TEAM_RED, Team.TEAM_BLUE, Team.TEAM_NONE] as const) {
      const rows = (this.result?.stats ?? [])
        .filter((row) => (row.team ?? Team.TEAM_NONE) === team)
        .sort((a, b) => (b.kills ?? 0) - (a.kills ?? 0));
      if (rows.length === 0) {
        continue;
      }

      this.add
        .text(150, y, teamLabel(team).toUpperCase(), {
          fontSize: '13px',
          color: TEAM_CSS[team] ?? '#ffffff',
          fontFamily: 'monospace',
        })
        .setDepth(1);
      y += 24;

      for (const row of rows) {
        const isSelf = toNum(row.playerId) === this.client.selfPlayerId;
        this.add
          .text(150, y, this.formatRow(row), {
            fontSize: '14px',
            color: isSelf ? '#ffffff' : '#bbbbbb',
            fontFamily: 'monospace',
          })
          .setDepth(1);
        y += 22;
      }
      y += 8;
    }
  }

  private formatRow(row: IPlayerMatchStats): string {
    const name = (row.displayName ?? 'Player').slice(0, 15).padEnd(16);
    const kills = String(row.kills ?? 0).padStart(4);
    const deaths = String(row.deaths ?? 0).padStart(4);
    const assists = String(row.assists ?? 0).padStart(4);
    const damage = String(row.damageDealt ?? 0).padStart(6);
    const shotsFired = row.shotsFired ?? 0;
    const shotsHit = row.shotsHit ?? 0;
    const accuracy = `${Math.round((shotsHit / Math.max(shotsFired, 1)) * 100)}%`.padStart(7);
    return `${name}${kills}${deaths}${assists}${damage}${accuracy}`;
  }
}
