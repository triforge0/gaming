import Phaser from 'phaser';
import {
  GameClient,
  ILobbyPlayer,
  IRoomLobbySnapshot,
  MatchPhase,
  SpawnRegion,
  Team,
  TeamValue,
  toNum,
} from '@triforge/shared-ui';
import {
  BLUE_CORNER_OPTIONS,
  RED_CORNER_OPTIONS,
  SPAWN_LABEL,
  TEAM_CSS,
  teamLabel,
} from '../ui/matchUi';

export interface RoomConnection {
  roomId: string;
  playerName: string;
  hostIp?: string;
  port?: number;
}

const TEAM_ORDER: { team: TeamValue; title: string; color: string }[] = [
  { team: Team.TEAM_RED, title: 'RED', color: TEAM_CSS[Team.TEAM_RED] },
  { team: Team.TEAM_BLUE, title: 'BLUE', color: TEAM_CSS[Team.TEAM_BLUE] },
  { team: Team.TEAM_NONE, title: 'UNASSIGNED', color: TEAM_CSS[Team.TEAM_NONE] },
];

export default class RoomLobbyScene extends Phaser.Scene {
  private client!: GameClient;
  private connection!: RoomConnection;
  private titleText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private listTexts: Phaser.GameObjects.Text[] = [];
  private panel?: HTMLDivElement;
  private nameInput?: HTMLInputElement;
  private readyButton?: HTMLButtonElement;
  private startButton?: HTMLButtonElement;
  private teamButtons = new Map<number, HTMLButtonElement>();
  private spawnButtons = new Map<number, HTMLButtonElement>();
  private hqButtons = new Map<number, HTMLButtonElement>();
  private setupRow?: HTMLDivElement;
  private setupHint?: HTMLSpanElement;
  private selectedSpawn = SpawnRegion.REGION_UNSPECIFIED;
  private selectedHq = SpawnRegion.REGION_UNSPECIFIED;
  private lobby?: IRoomLobbySnapshot;

  constructor() {
    super({ key: 'RoomLobbyScene' });
  }

  init(data: RoomConnection): void {
    this.connection = data;
  }

  create(): void {
    this.titleText = this.add
      .text(400, 36, 'Room Lobby', { fontSize: '26px', color: '#ffffff', fontFamily: 'monospace' })
      .setOrigin(0.5);
    this.statusText = this.add
      .text(400, 70, 'Connecting…', { fontSize: '13px', color: '#888888', fontFamily: 'monospace' })
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

    this.client.handlers = {
      onConnected: () => this.syncStatusForPhase(this.lobby?.phase ?? MatchPhase.LOBBY),
      onDisconnected: () => this.statusText.setText('Disconnected from host'),
      onLobbySnapshot: (lobby) => this.onLobby(lobby),
      onMapSnapshot: () => {
        /* HQ preview updates on map; game scene reads registry on start */
      },
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
        this.statusText.setText('Match in progress — cannot join. Returning to LAN lobby…');
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
      this.statusText.setText('Chọn team và ready để chơi tiếp');
    } else if (phase === MatchPhase.ENDED) {
      this.statusText.setText('Đang xem kết quả — chờ vài giây để quay lại lobby…');
    } else if (phase === MatchPhase.COUNTDOWN) {
      this.statusText.setText('Match sắp bắt đầu…');
    } else if (phase === MatchPhase.PLAYING) {
      this.statusText.setText('Match đang diễn ra…');
    }
  }

  private lobbyInteractive(lobby: IRoomLobbySnapshot): boolean {
    return (lobby.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY;
  }

  shutdown(): void {
    this.panel?.remove();
    this.panel = undefined;
    this.teamButtons.clear();
    this.spawnButtons.clear();
    this.hqButtons.clear();
  }

  private toGame(): void {
    this.scene.start('GameScene');
  }

  private onLobby(lobby: IRoomLobbySnapshot): void {
    this.lobby = lobby;
    this.titleText.setText(lobby.roomName || lobby.roomId || 'Room Lobby');
    this.syncStatusForPhase(lobby.phase ?? MatchPhase.LOBBY);
    this.renderPlayerList(lobby);
    this.syncControls(lobby);
  }

  private self(lobby: IRoomLobbySnapshot): ILobbyPlayer | undefined {
    return (lobby.players ?? []).find((p) => toNum(p.playerId) === this.client.selfPlayerId);
  }

  private teamSetup(lobby: IRoomLobbySnapshot, team: TeamValue) {
    return (lobby.teamSetups ?? []).find((setup) => (setup.team ?? Team.TEAM_NONE) === team);
  }

  private renderPlayerList(lobby: IRoomLobbySnapshot): void {
    for (const t of this.listTexts) t.destroy();
    this.listTexts = [];

    const players = lobby.players ?? [];
    const columnX = [200, 400, 600];
    TEAM_ORDER.forEach((group, col) => {
      const x = columnX[col];
      const setup = this.teamSetup(lobby, group.team);
      const setupLabel =
        setup?.spawnRegion && setup?.hqRegion
          ? ` spawn ${SPAWN_LABEL[setup.spawnRegion] ?? '?'} · HQ ${SPAWN_LABEL[setup.hqRegion] ?? '?'}`
          : '';
      const header = this.add
        .text(x, 110, `${group.title}${setupLabel}`, {
          fontSize: '14px',
          color: group.color,
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
      this.listTexts.push(header);

      const members = players.filter((p) => (p.team ?? Team.TEAM_NONE) === group.team);
      members.forEach((player, row) => {
        const isSelf = toNum(player.playerId) === this.client.selfPlayerId;
        const ready = player.ready ? '✓' : '·';
        const crown = player.isHost ? ' ♛' : '';
        const star = player.isTeamCaptain ? ' ★' : '';
        const label = `${ready} ${player.displayName ?? 'Player'}${star}${crown}`;
        const text = this.add
          .text(x, 140 + row * 26, label, {
            fontSize: '13px',
            color: isSelf ? '#ffffff' : '#bbbbbb',
            fontFamily: 'monospace',
          })
          .setOrigin(0.5);
        this.listTexts.push(text);
      });
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
      if (v) this.client.setName(v);
    });
    row1.append(nameInput, nameBtn);
    this.nameInput = nameInput;

    const row2 = document.createElement('div');
    row2.style.cssText = 'display:flex;gap:8px;align-items:center;';
    row2.appendChild(this.makeLabel('Team:'));
    for (const t of [Team.TEAM_RED, Team.TEAM_BLUE] as TeamValue[]) {
      const btn = this.makeButton(teamLabel(t), () => this.client.setTeam(t));
      this.teamButtons.set(t, btn);
      row2.appendChild(btn);
    }

    const setupRow = document.createElement('div');
    setupRow.style.cssText = 'display:flex;flex-direction:column;gap:8px;align-items:center;';
    this.setupRow = setupRow;

    const spawnRow = document.createElement('div');
    spawnRow.style.cssText = 'display:flex;gap:8px;align-items:center;';
    spawnRow.appendChild(this.makeLabel('Spawn (captain):'));
    for (const opt of RED_CORNER_OPTIONS) {
      const btn = this.makeButton(`A/C ${opt.label}`, () => this.selectSpawn(opt.region));
      this.spawnButtons.set(opt.region, btn);
      spawnRow.appendChild(btn);
    }
    for (const opt of BLUE_CORNER_OPTIONS) {
      const btn = this.makeButton(`B/D ${opt.label}`, () => this.selectSpawn(opt.region));
      this.spawnButtons.set(opt.region, btn);
      spawnRow.appendChild(btn);
    }

    const hqRow = document.createElement('div');
    hqRow.style.cssText = 'display:flex;gap:8px;align-items:center;';
    hqRow.appendChild(this.makeLabel('HQ (captain):'));
    for (const opt of RED_CORNER_OPTIONS) {
      const btn = this.makeButton(`HQ ${opt.label}`, () => this.selectHq(opt.region));
      this.hqButtons.set(opt.region + 10, btn);
      hqRow.appendChild(btn);
    }
    for (const opt of BLUE_CORNER_OPTIONS) {
      const btn = this.makeButton(`HQ ${opt.label}`, () => this.selectHq(opt.region));
      this.hqButtons.set(opt.region + 10, btn);
      hqRow.appendChild(btn);
    }

    const applyBtn = this.makeButton('Apply team setup', () => this.applyTeamSetup());
    this.setupHint = document.createElement('span');
    this.setupHint.style.cssText = 'font-size:12px;color:#888;';
    setupRow.append(spawnRow, hqRow, applyBtn, this.setupHint);

    const row4 = document.createElement('div');
    row4.style.cssText = 'display:flex;gap:8px;align-items:center;';
    this.readyButton = this.makeButton('Ready', () => {
      const me = this.lobby ? this.self(this.lobby) : undefined;
      this.client.setReady(!(me?.ready ?? false));
    });
    this.startButton = this.makeButton('Start Match', () => this.client.startMatch());
    this.startButton.style.display = 'none';
    row4.append(this.readyButton, this.startButton);

    panel.append(row1, row2, setupRow, row4);
    document.body.appendChild(panel);
    this.panel = panel;
  }

  private selectSpawn(region: number): void {
    this.selectedSpawn = region;
    if (this.lobby) {
      this.syncControls(this.lobby);
    }
  }

  private selectHq(region: number): void {
    this.selectedHq = region;
    if (this.lobby) {
      this.syncControls(this.lobby);
    }
  }

  private applyTeamSetup(): void {
    if (this.selectedSpawn === SpawnRegion.REGION_UNSPECIFIED
        || this.selectedHq === SpawnRegion.REGION_UNSPECIFIED) {
      return;
    }
    this.client.setTeamSetup(this.selectedSpawn, this.selectedHq);
  }

  private syncControls(lobby: IRoomLobbySnapshot): void {
    const me = this.self(lobby);
    if (!me) return;

    const interactive = this.lobbyInteractive(lobby);
    if (this.panel) {
      this.panel.style.pointerEvents = interactive ? 'auto' : 'none';
      this.panel.style.opacity = interactive ? '1' : '0.45';
    }
    if (this.nameInput) {
      this.nameInput.disabled = !interactive;
    }

    if (this.nameInput && document.activeElement !== this.nameInput) {
      this.nameInput.value = me.displayName ?? this.nameInput.value;
    }

    const myTeam = me.team ?? Team.TEAM_NONE;
    for (const [team, btn] of this.teamButtons) {
      this.setActive(btn, team === myTeam);
      btn.disabled = !interactive;
    }

    const isCaptain = me.isTeamCaptain ?? false;
    const teamSetupForMe = myTeam !== Team.TEAM_NONE ? this.teamSetup(lobby, myTeam) : undefined;
    if (teamSetupForMe?.spawnRegion) {
      this.selectedSpawn = teamSetupForMe.spawnRegion;
    }
    if (teamSetupForMe?.hqRegion) {
      this.selectedHq = teamSetupForMe.hqRegion;
    }

    if (this.setupRow) {
      this.setupRow.style.display = myTeam === Team.TEAM_NONE ? 'none' : 'flex';
    }
    if (this.setupHint) {
      if (myTeam === Team.TEAM_NONE) {
        this.setupHint.textContent = '';
      } else if (isCaptain) {
        this.setupHint.textContent = 'Bạn là đội trưởng — chọn spawn và HQ rồi bấm Apply';
      } else {
        this.setupHint.textContent = 'Chờ đội trưởng chọn spawn và HQ';
      }
    }

    const cornerOptions =
      myTeam === Team.TEAM_RED
        ? RED_CORNER_OPTIONS
        : myTeam === Team.TEAM_BLUE
          ? BLUE_CORNER_OPTIONS
          : [];

    for (const [region, btn] of this.spawnButtons) {
      const allowed = cornerOptions.some((opt) => opt.region === region);
      btn.style.display = allowed && isCaptain && interactive ? 'inline-block' : 'none';
      this.setActive(btn, region === this.selectedSpawn);
      btn.disabled = !isCaptain || !interactive;
    }
    for (const [region, btn] of this.hqButtons) {
      const corner = region - 10;
      const allowed = cornerOptions.some((opt) => opt.region === corner);
      btn.style.display = allowed && isCaptain && interactive ? 'inline-block' : 'none';
      this.setActive(btn, corner === this.selectedHq);
      btn.disabled = !isCaptain || !interactive;
    }

    if (this.readyButton) {
      this.readyButton.textContent = me.ready ? 'Unready' : 'Ready';
      this.setActive(this.readyButton, me.ready ?? false);
      const setupReady = !!teamSetupForMe?.spawnRegion && !!teamSetupForMe?.hqRegion;
      this.readyButton.disabled = !interactive || (myTeam !== Team.TEAM_NONE && !setupReady);
      this.readyButton.style.opacity = this.readyButton.disabled ? '0.5' : '1';
    }
    if (this.startButton) {
      this.startButton.style.display = me.isHost ? 'inline-block' : 'none';
      this.startButton.disabled = !interactive || !(lobby.canStart ?? false);
      this.startButton.style.opacity = this.startButton.disabled ? '0.5' : '1';
    }
  }

  private makeButton(text: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText =
      'padding:6px 12px;border:1px solid #444;border-radius:6px;background:#1f1f24;color:#ddd;' +
      'font-family:monospace;cursor:pointer;';
    btn.addEventListener('click', onClick);
    return btn;
  }

  private makeLabel(text: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.textContent = text;
    span.style.color = '#999';
    return span;
  }

  private setActive(btn: HTMLButtonElement, active: boolean): void {
    btn.style.background = active ? '#35c759' : '#1f1f24';
    btn.style.color = active ? '#0a0a0c' : '#ddd';
    btn.style.borderColor = active ? '#35c759' : '#444';
  }
}
