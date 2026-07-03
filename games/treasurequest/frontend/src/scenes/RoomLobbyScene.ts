import Phaser from 'phaser';
import {
  GameClient,
  ILobbyPlayer,
  IRoomLobbySnapshot,
  MatchPhase,
  ChatOverlay,
  toNum,
} from '@triforge/shared-ui';

export interface RoomConnection {
  roomId: string;
  playerName: string;
  hostIp?: string;
  port?: number;
}

export default class RoomLobbyScene extends Phaser.Scene {
  private client!: GameClient;
  private connection!: RoomConnection;
  private titleText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private listTexts: Phaser.GameObjects.Text[] = [];
  private panel?: HTMLDivElement;
  private readyButton?: HTMLButtonElement;
  private startButton?: HTMLButtonElement;
  private lobby?: IRoomLobbySnapshot;
  private chatOverlay?: ChatOverlay;

  constructor() {
    super({ key: 'RoomLobbyScene' });
  }

  init(data: RoomConnection): void {
    this.connection = data;
  }

  create(): void {
    this.titleText = this.add
      .text(400, 36, 'Expedition Lobby', {
        fontSize: '26px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
    this.statusText = this.add
      .text(400, 70, 'Connecting…', {
        fontSize: '13px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.client =
      (this.registry.get('client') as GameClient | undefined) ??
      new GameClient(
        this.connection.roomId,
        this.connection.playerName,
        {},
        { hostIp: this.connection.hostIp, port: this.connection.port },
      );
    this.registry.set('client', this.client);
    this.registry.set('connection', this.connection);

    if (!this.registry.get('chatOverlay')) {
      this.chatOverlay = new ChatOverlay(this.client, document.body);
      this.registry.set('chatOverlay', this.chatOverlay);
    } else {
      this.chatOverlay = this.registry.get('chatOverlay') as ChatOverlay | undefined;
    }

    this.client.handlers = {
      onConnected: () => this.syncStatusForPhase(this.lobby?.phase ?? MatchPhase.LOBBY),
      onDisconnected: () => this.statusText.setText('Disconnected from host'),
      onLobbySnapshot: (lobby) => this.onLobby(lobby),
      onMatchPhaseUpdate: (update) => {
        const phase = update.phase ?? MatchPhase.LOBBY;
        if (phase === MatchPhase.COUNTDOWN || phase === MatchPhase.PLAYING) {
          this.toGame();
          return;
        }
        if (this.lobby) {
          this.lobby = { ...this.lobby, phase };
        }
        this.syncStatusForPhase(phase);
        if (phase === MatchPhase.LOBBY && this.client.lastLobby) {
          this.onLobby(this.client.lastLobby);
        }
      },
      onJoinRejected: () => {
        this.statusText.setText('Expedition in progress — cannot join. Returning…');
        this.time.delayedCall(2500, () => this.scene.start('LobbyScene'));
      },
    };

    this.buildControls();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

    if (this.client.lastLobby) {
      this.onLobby(this.client.lastLobby);
    }
    if (!this.registry.get('connected')) {
      this.registry.set('connected', true);
      this.client.connect();
    }
  }

  private syncStatusForPhase(phase: number): void {
    if (phase === MatchPhase.LOBBY) {
      this.statusText.setText('Ready up — host starts the expedition');
    } else if (phase === MatchPhase.ENDED) {
      this.statusText.setText('Expedition ended — returning to lobby…');
    } else if (phase === MatchPhase.COUNTDOWN) {
      this.statusText.setText('Expedition starting…');
    } else if (phase === MatchPhase.PLAYING) {
      this.statusText.setText('Expedition in progress…');
    }
  }

  private lobbyInteractive(lobby: IRoomLobbySnapshot): boolean {
    return (lobby.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY;
  }

  shutdown(): void {
    this.panel?.remove();
    this.panel = undefined;
  }

  /** Tear down room-scoped UI when returning to the LAN picker. */
  static destroyRoomUi(registry: Phaser.Data.DataManager): void {
    const overlay = registry.get('chatOverlay') as ChatOverlay | undefined;
    overlay?.destroy();
    registry.remove('chatOverlay');
    registry.remove('client');
    registry.remove('connected');
  }

  private toGame(): void {
    this.scene.start('GameScene');
  }

  private onLobby(lobby: IRoomLobbySnapshot): void {
    this.lobby = lobby;
    this.titleText.setText(lobby.roomName || lobby.roomId || 'Expedition Lobby');
    this.syncStatusForPhase(lobby.phase ?? MatchPhase.LOBBY);
    this.renderPlayerList(lobby);
    this.syncControls(lobby);
  }

  private self(lobby: IRoomLobbySnapshot): ILobbyPlayer | undefined {
    return (lobby.players ?? []).find((p) => toNum(p.playerId) === this.client.selfPlayerId);
  }

  private renderPlayerList(lobby: IRoomLobbySnapshot): void {
    for (const t of this.listTexts) {
      t.destroy();
    }
    this.listTexts = [];

    const header = this.add
      .text(400, 120, 'Explorers', {
        fontSize: '16px',
        color: '#ffd166',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
    this.listTexts.push(header);

    const players = lobby.players ?? [];
    players.forEach((player, row) => {
      const isSelf = toNum(player.playerId) === this.client.selfPlayerId;
      const ready = player.ready ? '✓' : '·';
      const crown = player.isHost ? ' ♛' : '';
      const label = `${ready} ${player.displayName ?? 'Explorer'}${crown}`;
      const text = this.add
        .text(400, 155 + row * 28, label, {
          fontSize: '14px',
          color: isSelf ? '#ffffff' : '#bbbbbb',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
      this.listTexts.push(text);
    });
  }

  private buildControls(): void {
    const panel = document.createElement('div');
    panel.style.cssText =
      'position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;' +
      'flex-direction:column;gap:10px;align-items:center;font-family:monospace;color:#ddd;';

    const row1 = document.createElement('div');
    row1.style.cssText = 'display:flex;gap:8px;align-items:center;';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 24;
    nameInput.value = this.connection.playerName;
    nameInput.style.cssText =
      'padding:6px 10px;border:1px solid #444;border-radius:6px;background:#1a1a1f;color:#fff;font-family:monospace;';
    const nameBtn = this.makeButton('Set name', () => {
      const v = nameInput.value.trim();
      if (v) {
        this.client.setName(v);
      }
    });
    row1.append(nameInput, nameBtn);

    const row2 = document.createElement('div');
    row2.style.cssText = 'display:flex;gap:8px;align-items:center;';
    this.readyButton = this.makeButton('Ready', () => {
      const me = this.lobby ? this.self(this.lobby) : undefined;
      this.client.setReady(!(me?.ready ?? false));
    });
    this.startButton = this.makeButton('Start Expedition', () => this.client.startMatch());
    this.startButton.style.display = 'none';
    row2.append(this.readyButton, this.startButton);

    panel.append(row1, row2);
    document.body.appendChild(panel);
    this.panel = panel;
  }

  private makeButton(label: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.type = 'button';
    btn.style.cssText =
      'padding:6px 12px;border:1px solid #555;border-radius:6px;background:#252530;color:#eee;cursor:pointer;font-family:monospace;';
    btn.onclick = onClick;
    return btn;
  }

  private syncControls(lobby: IRoomLobbySnapshot): void {
    const me = this.self(lobby);
    if (!me) {
      return;
    }

    const interactive = this.lobbyInteractive(lobby);
    if (this.panel) {
      this.panel.style.pointerEvents = interactive ? 'auto' : 'none';
      this.panel.style.opacity = interactive ? '1' : '0.45';
    }

    if (this.readyButton) {
      this.readyButton.textContent = me.ready ? 'Unready' : 'Ready';
    }

    const host = me.isHost ?? false;
    const canStart = lobby.canStart ?? false;
    if (this.startButton) {
      this.startButton.style.display = host ? 'inline-block' : 'none';
      this.startButton.disabled = !canStart;
      this.startButton.style.opacity = canStart ? '1' : '0.45';
    }
  }
}
