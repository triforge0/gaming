import Phaser from 'phaser';
import {
  fetchAvailablePlugins,
  fetchHostRooms,
  fetchLobbySnapshot,
  GamePluginEntry,
  HostPresence,
  isHostOffline,
  SelectedRoom,
} from '@triforge/shared-ui';

interface JoinSelection {
  roomId: string;
  playerName: string;
  hostIp: string;
  port: number;
}

export default class LobbyScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;
  private pluginInfoText!: Phaser.GameObjects.Text;
  private hostTexts: Phaser.GameObjects.Text[] = [];
  private roomTexts: Phaser.GameObjects.Text[] = [];
  private discoveredHosts: HostPresence[] = [];
  private hostRooms: SelectedRoom[] = [];
  private hostPlugins: GamePluginEntry[] = [];
  private defaultGamePluginId?: string;
  private ttlMs = 3000;
  private selectedHostIndex = 0;
  private selectedRoomIndex = 0;
  private loadingRooms = false;
  private playerName = `Player-${Math.floor(Math.random() * 1000)}`;
  private nameInput!: HTMLInputElement;

  constructor() {
    super({ key: 'LobbyScene' });
  }

  create(): void {
    this.add
      .text(400, 40, 'Tank Arena — LAN Lobby', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(400, 85, 'Scanning LAN for hosts…', {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.pluginInfoText = this.add
      .text(400, 470, '', {
        fontSize: '12px',
        color: '#666666',
        fontFamily: 'monospace',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);

    this.add
      .text(400, 120, 'Player name', {
        fontSize: '14px',
        color: '#cccccc',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.value = this.playerName;
    this.nameInput.maxLength = 24;
    this.nameInput.style.position = 'absolute';
    this.nameInput.style.left = '50%';
    this.nameInput.style.top = '145px';
    this.nameInput.style.transform = 'translateX(-50%)';
    this.nameInput.style.width = '260px';
    this.nameInput.style.padding = '8px 10px';
    this.nameInput.style.border = '1px solid #444';
    this.nameInput.style.borderRadius = '6px';
    this.nameInput.style.background = '#1a1a1f';
    this.nameInput.style.color = '#ffffff';
    this.nameInput.style.fontFamily = 'monospace';
    document.body.appendChild(this.nameInput);

    this.add
      .text(200, 195, 'LAN hosts (click to select)', {
        fontSize: '13px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(600, 195, 'Rooms on selected host', {
        fontSize: '13px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    const joinButton = this.add
      .text(400, 520, '[ Join Selected Room ]', {
        fontSize: '18px',
        color: '#35c759',
        fontFamily: 'monospace',
        backgroundColor: '#1f1f24',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    joinButton.on('pointerdown', () => this.joinSelectedRoom());
    joinButton.on('pointerover', () => joinButton.setColor('#ffffff'));
    joinButton.on('pointerout', () => joinButton.setColor('#35c759'));

    this.input.keyboard?.on('keydown-ENTER', () => this.joinSelectedRoom());

    this.refreshHosts();
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => this.refreshHosts(),
    });
  }

  shutdown(): void {
    this.nameInput?.remove();
  }

  private async refreshHosts(): Promise<void> {
    try {
      const snapshot = await fetchLobbySnapshot();
      this.discoveredHosts = snapshot.hosts ?? [];
      this.ttlMs = snapshot.ttlMs ?? 3000;

      if (this.selectedHostIndex >= this.discoveredHosts.length) {
        this.selectedHostIndex = 0;
      }

      this.renderHostList();
      await this.loadRoomsForSelectedHost(false);

      const onlineHosts = this.discoveredHosts.filter(
        (host) => !isHostOffline(host, this.ttlMs, snapshot.timestampMs)
      );
      this.statusText.setText(
        onlineHosts.length === 0
          ? 'No LAN hosts found yet — start a host JAR on this network'
          : `${onlineHosts.length} host(s) online on the LAN`
      );
    } catch (error) {
      console.error('Lobby discovery failed', error);
      this.statusText.setText('Failed to query lobby API');
    }
  }

  private async loadRoomsForSelectedHost(showLoadingStatus: boolean): Promise<void> {
    if (this.discoveredHosts.length === 0) {
      this.hostRooms = [];
      this.hostPlugins = [];
      this.defaultGamePluginId = undefined;
      this.renderRoomList();
      this.renderPluginInfo();
      return;
    }

    const host = this.discoveredHosts[this.selectedHostIndex];
    if (isHostOffline(host, this.ttlMs)) {
      this.hostRooms = [];
      this.hostPlugins = [];
      this.defaultGamePluginId = undefined;
      this.renderRoomList('Host offline or stale');
      this.renderPluginInfo();
      return;
    }

    if (showLoadingStatus) {
      this.statusText.setText(`Loading rooms from ${host.hostIp}:${host.port}…`);
    }

    this.loadingRooms = true;
    try {
      const [roomsResponse, pluginsResponse] = await Promise.all([
        fetchHostRooms(host.hostIp, host.port),
        fetchAvailablePlugins(host.hostIp, host.port),
      ]);

      this.defaultGamePluginId = roomsResponse.defaultGamePluginId;
      this.hostPlugins = pluginsResponse.plugins ?? [];
      this.hostRooms = (roomsResponse.rooms ?? []).map((room) => ({
        hostIp: host.hostIp,
        port: host.port,
        roomId: room.roomId,
        roomName: room.roomName,
        gamePluginId: room.gamePluginId,
        gameDisplayName: room.gameDisplayName,
        playerCount: room.playerCount,
        maxPlayers: room.maxPlayers,
      }));
      if (this.selectedRoomIndex >= this.hostRooms.length) {
        this.selectedRoomIndex = 0;
      }
      this.renderRoomList();
      this.renderPluginInfo();
    } catch (error) {
      console.error('Failed to load rooms for host', error);
      this.hostRooms = [];
      this.hostPlugins = [];
      this.defaultGamePluginId = undefined;
      this.renderRoomList('Failed to load rooms');
      this.renderPluginInfo();
    } finally {
      this.loadingRooms = false;
    }
  }

  private renderHostList(): void {
    for (const text of this.hostTexts) {
      text.destroy();
    }
    this.hostTexts = [];

    if (this.discoveredHosts.length === 0) {
      const empty = this.add
        .text(200, 240, 'Waiting for UDP discovery…', {
          fontSize: '14px',
          color: '#666666',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
      this.hostTexts.push(empty);
      return;
    }

    this.discoveredHosts.forEach((host, index) => {
      const y = 230 + index * 34;
      const offline = isHostOffline(host, this.ttlMs);
      const suffix = offline ? ' (offline)' : '';
      const label = `${host.hostIp}:${host.port}${suffix}`;
      const text = this.add
        .text(200, y, label, {
          fontSize: '14px',
          color: offline ? '#666666' : index === this.selectedHostIndex ? '#ffffff' : '#cccccc',
          fontFamily: 'monospace',
          backgroundColor: index === this.selectedHostIndex ? '#2a2a32' : undefined,
          padding: { x: 8, y: 4 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on('pointerdown', () => {
        if (this.loadingRooms) {
          return;
        }
        this.selectedHostIndex = index;
        this.selectedRoomIndex = 0;
        this.renderHostList();
        void this.loadRoomsForSelectedHost(true);
      });

      this.hostTexts.push(text);
    });
  }

  private renderRoomList(message?: string): void {
    for (const text of this.roomTexts) {
      text.destroy();
    }
    this.roomTexts = [];

    if (message) {
      const status = this.add
        .text(600, 240, message, {
          fontSize: '14px',
          color: '#666666',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
      this.roomTexts.push(status);
      return;
    }

    if (this.hostRooms.length === 0) {
      const empty = this.add
        .text(600, 240, this.loadingRooms ? 'Loading rooms…' : 'No rooms on this host', {
          fontSize: '14px',
          color: '#666666',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
      this.roomTexts.push(empty);
      return;
    }

    this.hostRooms.forEach((room, index) => {
      const y = 230 + index * 40;
      const gameLabel = room.gameDisplayName ?? room.gamePluginId ?? 'Unknown game';
      const label = `${room.roomName} · ${gameLabel}\n${room.playerCount}/${room.maxPlayers} players`;
      const text = this.add
        .text(600, y, label, {
          fontSize: '13px',
          color: index === this.selectedRoomIndex ? '#ffffff' : '#cccccc',
          fontFamily: 'monospace',
          backgroundColor: index === this.selectedRoomIndex ? '#2a2a32' : undefined,
          padding: { x: 8, y: 4 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on('pointerdown', () => {
        this.selectedRoomIndex = index;
        this.renderRoomList();
      });

      this.roomTexts.push(text);
    });
  }

  private renderPluginInfo(): void {
    if (this.hostPlugins.length === 0) {
      this.pluginInfoText.setText('');
      return;
    }

    const pluginNames = this.hostPlugins.map((plugin) => plugin.displayName).join(', ');
    const defaultHint = this.defaultGamePluginId
      ? `Default new rooms: ${this.defaultGamePluginId}`
      : '';
    this.pluginInfoText.setText(
      defaultHint ? `Games on host: ${pluginNames} · ${defaultHint}` : `Games on host: ${pluginNames}`
    );
  }

  private joinSelectedRoom(): void {
    if (this.hostRooms.length === 0 || this.loadingRooms) {
      return;
    }

    const selected = this.hostRooms[this.selectedRoomIndex];
    const playerName = this.nameInput.value.trim() || this.playerName;
    const gameLabel = selected.gameDisplayName ?? selected.gamePluginId ?? 'game';
    const payload: JoinSelection = {
      roomId: selected.roomId,
      playerName,
      hostIp: selected.hostIp,
      port: selected.port,
    };

    this.statusText.setText(`Connecting to ${selected.roomName} (${gameLabel})…`);
    this.nameInput.remove();

    // Drop any prior room connection so the room lobby opens a fresh socket.
    const prior = this.registry.get('client') as { close?: () => void } | undefined;
    prior?.close?.();
    this.registry.remove('client');
    this.registry.remove('connected');
    this.registry.remove('connection');

    this.scene.start('RoomLobbyScene', payload);
  }
}
