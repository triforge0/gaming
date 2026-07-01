import Phaser from 'phaser';
import {
  Direction,
  GameClient,
  GameEventType,
  IEntity,
  IFogSnapshot,
  IFullSnapshot,
  IDeltaSnapshot,
  IGameEvent,
  IMapSnapshot,
  IMatchPhaseUpdate,
  IMatchResult,
  InputState,
  MatchPhase,
  Team,
  TileType,
  toNum,
} from '@triforge/shared-ui';
import { flashTankBody, shakeCamera, spawnRespawnPulse } from '../render/effects';
import {
  fogCellsFromSnapshot,
  isFogSnapshotUsable,
} from '../render/fog';
import { FogLayer } from '../render/fogLayer';
import {
  boundsEqual,
  computeTileCullBounds,
  iterCullTiles,
  tileKey,
  type TileCullBounds,
} from '../render/tileCuller';
import {
  buildHeadquartersLayouts,
  HeadquartersOverlay,
} from '../render/headquarters';
import { spawnExplosion } from '../render/explosion';
import { createTileVisual, updateTileVisual } from '../render/tiles';
import { KillFeed } from '../ui/killFeed';
import { MatchHud } from '../ui/matchHud';
import { MatchStatusBanner } from '../ui/matchStatus';
import { ObjectivesPanel } from '../ui/objectivesPanel';
import { PlayerRegistry } from '../ui/playerRegistry';
import { ReloadBar } from '../ui/reloadBar';
import { TEAM_COLOR, TEAM_CSS } from '../ui/matchUi';

const TANK_SIZE = 28;
const BULLET_RADIUS = 4;
const SELF_OUTLINE = 0xffffff;
const BULLET_COLOR = 0xffcc00;
const INTERPOLATION_MS = 100;
const RESPAWN_SECONDS = 3;
const SELF_GLOW_COLOR = 0x35c759;

interface TankVisual {
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Rectangle;
  selfGlow: Phaser.GameObjects.Arc;
  youMarker: Phaser.GameObjects.Text;
  nameLabel: Phaser.GameObjects.Text;
  livesLabel: Phaser.GameObjects.Text;
  playerId: number;
  team: number;
  isSelf: boolean;
  targetX: number;
  targetY: number;
  targetRotation: number;
}

interface BulletVisual {
  sprite: Phaser.GameObjects.Arc;
  targetX: number;
  targetY: number;
}

export default class GameScene extends Phaser.Scene {
  private client!: GameClient;
  private tanks = new Map<number, TankVisual>();
  private bullets = new Map<number, BulletVisual>();
  private tileSprites = new Map<string, Phaser.GameObjects.Container>();
  private mapTiles: number[] = [];
  private fogLayer?: FogLayer;
  private fogCells: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
  private tileCullBounds: TileCullBounds = { minX: -1, minY: -1, maxX: -1, maxY: -1 };
  private mapWidth = 0;
  private mapHeight = 0;
  private mapTileSize = 32;
  private hqTeamByTile = new Map<string, number>();
  private hqCenterByTeam = new Map<number, { x: number; y: number }>();
  private redHqHp = 0;
  private blueHqHp = 0;
  private redHqMax = 0;
  private blueHqMax = 0;
  private hqOverlay?: HeadquartersOverlay;

  private matchHud!: MatchHud;
  private killFeed!: KillFeed;
  private matchStatus!: MatchStatusBanner;
  private objectivesPanel!: ObjectivesPanel;
  private reloadBar!: ReloadBar;
  private playerRegistry = new PlayerRegistry();

  private deathText!: Phaser.GameObjects.Text;
  private respawnTimer?: Phaser.Time.TimerEvent;

  private phase: number = MatchPhase.COUNTDOWN;
  private matchRemainingMs = 0;
  private countdownSeconds = 0;
  private selfLives = 0;
  private selfKills = 0;
  private selfDeaths = 0;
  private selfAssists = 0;
  private redScore = 0;
  private blueScore = 0;
  private selfCooldownMax = 0;
  private selfCooldownRemaining = 0;
  private transitionedToScoreboard = false;
  private fogPending = true;
  private fogUnknownPainted = false;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private spaceKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const client = this.registry.get('client') as GameClient | undefined;
    if (!client) {
      this.scene.start('LobbyScene');
      return;
    }
    this.client = client;

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.matchHud = new MatchHud(this);
    this.killFeed = new KillFeed(this);
    this.matchStatus = new MatchStatusBanner(this);
    this.objectivesPanel = new ObjectivesPanel(this);
    this.reloadBar = new ReloadBar(this, 12, 136);
    this.fogLayer = new FogLayer(this);

    this.deathText = this.add
      .text(400, 340, '', { fontSize: '22px', color: '#ff7676', fontFamily: 'monospace' })
      .setOrigin(0.5)
      .setDepth(22)
      .setScrollFactor(0);

    this.pinUiToCamera();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

    this.client.handlers = {
      onMapSnapshot: (map) => this.renderMap(map),
      onFullSnapshot: (snapshot, selfEntityId) => this.renderFullSnapshot(snapshot, selfEntityId),
      onDeltaSnapshot: (delta) => this.applyDeltaSnapshot(delta),
      onGameEvent: (event) => this.handleGameEvent(event),
      onMatchPhaseUpdate: (update) => this.onMatchPhaseUpdate(update),
      onMatchResult: (result) => this.toScoreboard(result),
      onDisconnected: () => this.matchStatus.showBanner('Disconnected', '#ff7676', 5000),
    };

    if (this.client.lastMap) {
      this.renderMap(this.client.lastMap);
    }
    if (this.client.lastPhase) {
      this.onMatchPhaseUpdate(this.client.lastPhase);
    }
    this.objectivesPanel.setSelfTeam(this.playerRegistry.selfTeam(this.client.selfPlayerId));
    this.refreshHud();
  }

  shutdown(): void {
    this.hqOverlay?.destroyAll();
    this.hqOverlay = undefined;
    this.fogLayer?.destroy();
    this.fogLayer = undefined;
    for (const sprite of this.tileSprites.values()) {
      sprite.destroy();
    }
    this.tileSprites.clear();
    this.mapTiles = [];
    this.matchHud.destroy();
    this.killFeed.destroy();
    this.matchStatus.destroy();
    this.objectivesPanel.destroy();
    this.reloadBar.destroy();
    this.playerRegistry.clear();
  }

  update(_time: number, delta: number): void {
    this.sendInput();
    this.interpolateTanks(delta);
    this.interpolateBullets(delta);
    this.killFeed.tick(this.time.now);
    this.refreshHud();
    this.updateReloadBar();
    this.updateTileCulling();
    if (this.fogPending && this.phase === MatchPhase.PLAYING && !this.fogUnknownPainted) {
      this.renderPendingFog();
      this.fogUnknownPainted = true;
    }
  }

  private sendInput(): void {
    if (this.phase !== MatchPhase.PLAYING) {
      return;
    }
    const input: InputState = {
      moveUp: this.wasd.W.isDown || this.cursors.up!.isDown,
      moveDown: this.wasd.S.isDown || this.cursors.down!.isDown,
      moveLeft: this.wasd.A.isDown || this.cursors.left!.isDown,
      moveRight: this.wasd.D.isDown || this.cursors.right!.isDown,
      shoot: this.spaceKey.isDown,
    };
    this.client.sendInput(input);
  }

  private onMatchPhaseUpdate(update: IMatchPhaseUpdate): void {
    const previous = this.phase;
    this.phase = update.phase ?? MatchPhase.LOBBY;
    this.matchRemainingMs = toNum(update.matchRemainingMs);
    this.countdownSeconds = update.countdownSeconds ?? 0;
    if (update.redHqHp != null) {
      this.redHqHp = update.redHqHp;
    }
    if (update.blueHqHp != null) {
      this.blueHqHp = update.blueHqHp;
    }

    if (this.phase === MatchPhase.COUNTDOWN) {
      if (previous !== MatchPhase.COUNTDOWN) {
        this.resetMatchStats();
      }
      this.matchStatus.showCountdownNumber(this.countdownSeconds);
    } else if (this.phase === MatchPhase.PLAYING) {
      if (previous === MatchPhase.COUNTDOWN) {
        this.resetMatchStats();
        this.matchStatus.showCountdownNumber(0);
      }
    } else if (this.phase === MatchPhase.ENDED) {
      this.matchStatus.clearBanner();
    }

    this.matchStatus.update({
      phase: this.phase,
      countdownSeconds: this.countdownSeconds,
      redScore: this.redScore,
      blueScore: this.blueScore,
    });
    this.refreshHud();
  }

  private resetMatchStats(): void {
    this.selfKills = 0;
    this.selfDeaths = 0;
    this.selfAssists = 0;
    this.redScore = 0;
    this.blueScore = 0;
    this.fogPending = true;
    this.fogUnknownPainted = false;
  }

  private toScoreboard(result: IMatchResult): void {
    if (this.transitionedToScoreboard) {
      return;
    }
    this.transitionedToScoreboard = true;
    this.registry.set('matchResult', result);
    this.scene.start('ScoreboardScene', { result });
  }

  private refreshHud(): void {
    this.matchHud.update({
      timeMs: this.matchRemainingMs,
      phasePlaying: this.phase === MatchPhase.PLAYING,
      redScore: this.redScore,
      blueScore: this.blueScore,
      kills: this.selfKills,
      deaths: this.selfDeaths,
      assists: this.selfAssists,
      lives: this.selfLives,
      pingMs: this.client.pingMs,
      fps: this.game.loop.actualFps,
      roomName: this.client.lastLobby?.roomName ?? undefined,
    });
    this.syncHqOverlayHp();
  }

  private updateReloadBar(): void {
    if (this.selfCooldownMax <= 0) {
      this.reloadBar.setProgress(1);
      return;
    }
    const ratio = 1 - this.selfCooldownRemaining / this.selfCooldownMax;
    this.reloadBar.setProgress(ratio);
  }

  private syncHqOverlayHp(): void {
    if (!this.hqOverlay) {
      return;
    }
    if (this.redHqMax > 0) {
      this.hqOverlay.setHp(Team.TEAM_RED, this.redHqHp, this.redHqMax);
    }
    if (this.blueHqMax > 0) {
      this.hqOverlay.setHp(Team.TEAM_BLUE, this.blueHqHp, this.blueHqMax);
    }
  }

  private renderMap(map: IMapSnapshot): void {
    this.mapTileSize = map.tileSize ?? 32;
    this.mapWidth = map.width ?? 0;
    this.mapHeight = map.height ?? 0;
    const tiles = map.tiles ?? [];

    this.hqTeamByTile.clear();
    this.hqCenterByTeam.clear();
    for (const hq of map.headquarters ?? []) {
      const team = hq.team ?? Team.TEAM_NONE;
      const x = hq.x ?? 0;
      const y = hq.y ?? 0;
      const width = hq.width ?? 1;
      const height = hq.height ?? 1;
      const maxHp = hq.maxHp ?? 5;
      if (team === Team.TEAM_RED) {
        this.redHqMax = maxHp;
        this.redHqHp = maxHp;
      } else if (team === Team.TEAM_BLUE) {
        this.blueHqMax = maxHp;
        this.blueHqHp = maxHp;
      }
      const centerX = (x + width / 2) * this.mapTileSize;
      const centerY = (y + height / 2) * this.mapTileSize;
      this.hqCenterByTeam.set(team, { x: centerX, y: centerY });
      for (let tileY = y; tileY < y + height; tileY++) {
        for (let tileX = x; tileX < x + width; tileX++) {
          this.hqTeamByTile.set(`${tileX},${tileY}`, team);
        }
      }
    }

    for (const sprite of this.tileSprites.values()) {
      sprite.destroy();
    }
    this.tileSprites.clear();
    this.tileCullBounds = { minX: -1, minY: -1, maxX: -1, maxY: -1 };
    this.mapTiles = [...tiles];

    this.fogLayer?.resize(this.mapWidth, this.mapHeight, this.mapTileSize);
    this.updateTileCulling(true);

    if (!this.hqOverlay) {
      this.hqOverlay = new HeadquartersOverlay(this);
    }
    this.hqOverlay.build(buildHeadquartersLayouts(map, this.mapTileSize));
    this.syncHqOverlayHp();

    if (this.fogCells.length > 0) {
      this.fogPending = false;
      this.fogLayer?.applySnapshot(this.fogCells);
    }

    this.setupWorldCamera();
  }

  private tileAt(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
      return TileType.EMPTY;
    }
    return this.mapTiles[y * this.mapWidth + x] ?? TileType.EMPTY;
  }

  private isTileInCull(x: number, y: number): boolean {
    const b = this.tileCullBounds;
    return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
  }

  private updateTileCulling(force = false): void {
    if (this.mapWidth <= 0 || this.mapHeight <= 0) {
      return;
    }
    const cam = this.cameras.main;
    const nextBounds = computeTileCullBounds(
      cam.scrollX,
      cam.scrollY,
      cam.width,
      cam.height,
      this.mapWidth,
      this.mapHeight,
      this.mapTileSize,
    );
    if (!force && boundsEqual(nextBounds, this.tileCullBounds)) {
      return;
    }

    const needed = new Set<string>();
    for (const { x, y } of iterCullTiles(nextBounds)) {
      const key = tileKey(x, y);
      needed.add(key);
      const tile = this.tileAt(x, y);
      if (tile === TileType.EMPTY) {
        const existing = this.tileSprites.get(key);
        if (existing) {
          existing.destroy();
          this.tileSprites.delete(key);
        }
        continue;
      }
      if (!this.tileSprites.has(key)) {
        this.createTileVisual(x, y, tile);
      }
    }

    for (const [key, sprite] of this.tileSprites) {
      if (!needed.has(key)) {
        sprite.destroy();
        this.tileSprites.delete(key);
      }
    }

    this.tileCullBounds = nextBounds;
  }

  private createTileVisual(x: number, y: number, tile: number): void {
    const key = tileKey(x, y);
    const centerX = x * this.mapTileSize + this.mapTileSize / 2;
    const centerY = y * this.mapTileSize + this.mapTileSize / 2;
    const visual = createTileVisual(this, centerX, centerY, tile, this.mapTileSize);
    this.tileSprites.set(key, visual);
  }

  private setupWorldCamera(): void {
    const worldW = this.mapWidth * this.mapTileSize;
    const worldH = this.mapHeight * this.mapTileSize;
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setZoom(1);
  }

  private pinUiToCamera(): void {
    for (const child of this.children.list) {
      if (child instanceof Phaser.GameObjects.GameObject && 'setScrollFactor' in child) {
        (child as Phaser.GameObjects.GameObject & { setScrollFactor(x: number, y?: number): void })
          .setScrollFactor(0);
      }
    }
  }

  private upsertTile(x: number, y: number, tile: number): void {
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
      return;
    }
    this.mapTiles[y * this.mapWidth + x] = tile;

    const key = tileKey(x, y);
    const existing = this.tileSprites.get(key);
    if (tile === TileType.EMPTY) {
      existing?.destroy();
      this.tileSprites.delete(key);
      return;
    }

    if (!this.isTileInCull(x, y)) {
      existing?.destroy();
      this.tileSprites.delete(key);
      return;
    }

    if (existing) {
      updateTileVisual(existing, tile, this.mapTileSize);
      return;
    }

    this.createTileVisual(x, y, tile);
  }

  private applyFogSnapshot(fog: IFogSnapshot | null | undefined): void {
    if (!isFogSnapshotUsable(fog, this.mapWidth, this.mapHeight)) {
      return;
    }
    this.fogCells = fogCellsFromSnapshot(fog);
    this.fogPending = false;
    this.fogLayer?.applySnapshot(this.fogCells);
  }

  private renderPendingFog(): void {
    if (this.mapWidth <= 0 || this.mapHeight <= 0) {
      return;
    }
    this.fogCells = new Uint8Array(this.mapWidth * this.mapHeight);
    this.fogLayer?.fillUnknown();
  }

  private applyTileChanges(delta: IDeltaSnapshot): void {
    for (const change of delta.tileChanges ?? []) {
      const x = change.x ?? 0;
      const y = change.y ?? 0;
      const tile = change.tile ?? TileType.EMPTY;
      const key = `${x},${y}`;
      if (tile === TileType.EMPTY && this.hqTeamByTile.has(key)) {
        const team = this.hqTeamByTile.get(key)!;
        this.hqTeamByTile.delete(key);
        if (![...this.hqTeamByTile.values()].includes(team)) {
          this.hqOverlay?.destroyTeam(team);
        }
      }
      this.upsertTile(x, y, tile);
    }
  }

  private handleGameEvent(event: IGameEvent): void {
    const playerId = toNum(event.playerId);
    const killerId = toNum(event.killerPlayerId);
    const lives = event.livesRemaining ?? 0;
    const isSelf = playerId === this.client.selfPlayerId;
    const assistIds = (event.assistPlayerIds ?? []).map((id) => toNum(id));

    switch (event.type) {
      case GameEventType.PLAYER_DEATH: {
        if (killerId > 0 && killerId !== playerId) {
          const killerTeam = this.playerRegistry.team(killerId);
          const victimName = this.playerRegistry.name(playerId);
          const killerName = this.playerRegistry.name(killerId);
          this.killFeed.pushKill(killerName, victimName, killerTeam);
          if (killerTeam === Team.TEAM_RED) {
            this.redScore += 1;
          } else if (killerTeam === Team.TEAM_BLUE) {
            this.blueScore += 1;
          }
          if (killerId === this.client.selfPlayerId) {
            this.selfKills += 1;
          }
        }
        if (isSelf) {
          this.selfDeaths += 1;
          this.selfLives = lives;
          this.showRespawnCountdown(lives);
          shakeCamera(this, 0.006, 180);
        }
        for (const assistId of assistIds) {
          if (assistId === this.client.selfPlayerId) {
            this.selfAssists += 1;
          }
        }
        const victimTank = [...this.tanks.values()].find((t) => t.playerId === playerId);
        if (victimTank) {
          flashTankBody(this, victimTank.body, this.tankColorForTeam(victimTank.team));
        }
        this.matchStatus.update({
          phase: this.phase,
          countdownSeconds: this.countdownSeconds,
          redScore: this.redScore,
          blueScore: this.blueScore,
        });
        break;
      }
      case GameEventType.PLAYER_RESPAWN:
        if (isSelf) {
          this.selfLives = lives;
          this.clearRespawnCountdown();
        }
        break;
      case GameEventType.MATCH_ENDED:
        this.matchStatus.clearBanner();
        break;
      case GameEventType.HQ_DAMAGED:
        this.applyHqEvent(event);
        break;
      case GameEventType.HQ_DESTROYED:
        this.applyHqEvent(event);
        this.flashHqDestroyed(event.team ?? Team.TEAM_NONE);
        break;
      default:
        break;
    }
    this.refreshHud();
  }

  private showRespawnCountdown(lives: number): void {
    this.clearRespawnCountdown();
    if (lives <= 0) {
      this.deathText.setText('ELIMINATED');
      this.deathText.setAlpha(0);
      this.tweens.add({ targets: this.deathText, alpha: 1, duration: 200 });
      return;
    }
    let remaining = RESPAWN_SECONDS;
    this.deathText.setText(`DESTROYED — respawn in ${remaining}`);
    this.deathText.setAlpha(1);
    this.respawnTimer = this.time.addEvent({
      delay: 1000,
      repeat: RESPAWN_SECONDS - 1,
      callback: () => {
        remaining -= 1;
        this.deathText.setText(
          remaining > 0 ? `DESTROYED — respawn in ${remaining}` : 'RESPAWNING…',
        );
      },
    });
  }

  private applyHqEvent(event: IGameEvent): void {
    const team = event.team ?? Team.TEAM_NONE;
    const hp = event.livesRemaining ?? 0;
    if (team === Team.TEAM_RED) {
      this.redHqHp = hp;
    } else if (team === Team.TEAM_BLUE) {
      this.blueHqHp = hp;
    }
    this.hqOverlay?.flashDamage(team);
    const center = this.hqCenterByTeam.get(team);
    if (center) {
      spawnExplosion(this, center.x, center.y, 1.4);
      shakeCamera(this, 0.005, 100);
    }
  }

  private flashHqDestroyed(team: number): void {
    const center = this.hqCenterByTeam.get(team);
    if (center) {
      spawnExplosion(this, center.x, center.y, 2.8);
      shakeCamera(this, 0.012, 280);
    }
    this.hqOverlay?.destroyTeam(team);
    const label =
      team === Team.TEAM_RED
        ? 'RED HQ DESTROYED!'
        : team === Team.TEAM_BLUE
          ? 'BLUE HQ DESTROYED!'
          : 'HQ DESTROYED!';
    const color = TEAM_CSS[team] ?? '#ff4444';
    this.matchStatus.showBanner(label, color, 2800);
  }

  private clearRespawnCountdown(): void {
    this.respawnTimer?.remove();
    this.respawnTimer = undefined;
    this.deathText.setText('');
  }

  private interpolateTanks(delta: number): void {
    const alpha = Math.min(1, delta / INTERPOLATION_MS);

    for (const tank of this.tanks.values()) {
      const { container, targetX, targetY, targetRotation } = tank;
      container.x += (targetX - container.x) * alpha;
      container.y += (targetY - container.y) * alpha;

      let rotationDelta = targetRotation - container.rotation;
      while (rotationDelta > Math.PI) rotationDelta -= Math.PI * 2;
      while (rotationDelta < -Math.PI) rotationDelta += Math.PI * 2;
      container.rotation += rotationDelta * alpha;

      if (tank.isSelf) {
        this.cameras.main.centerOn(container.x, container.y);
        this.updateTileCulling();
      }
    }
  }

  private interpolateBullets(delta: number): void {
    const alpha = Math.min(1, delta / INTERPOLATION_MS);

    for (const bullet of this.bullets.values()) {
      bullet.sprite.x += (bullet.targetX - bullet.sprite.x) * alpha;
      bullet.sprite.y += (bullet.targetY - bullet.sprite.y) * alpha;
    }
  }

  private renderFullSnapshot(snapshot: IFullSnapshot, selfEntityId: number): void {
    const entities = snapshot.entities ?? [];
    this.playerRegistry.updateFromEntities(entities);
    this.objectivesPanel.setSelfTeam(this.playerRegistry.selfTeam(this.client.selfPlayerId));

    const seenTanks = new Set<number>();
    const seenBullets = new Set<number>();

    for (const entity of entities) {
      if (!entity.position) continue;
      const id = toNum(entity.entityId);

      if (this.isTank(entity)) {
        seenTanks.add(id);
        this.upsertTank(id, entity, this.isSelfEntity(entity, selfEntityId), true);
      } else if (this.isBullet(entity)) {
        seenBullets.add(id);
        this.upsertBullet(id, entity, true);
      }
    }

    this.removeMissingTanks(seenTanks);
    this.removeMissingBullets(seenBullets);
    this.applyFogSnapshot(snapshot.fog ?? null);
  }

  private applyDeltaSnapshot(delta: IDeltaSnapshot): void {
    this.applyTileChanges(delta);
    const updated = delta.updatedEntities ?? [];
    this.playerRegistry.updateFromEntities(updated);
    if (delta.fog) {
      this.applyFogSnapshot(delta.fog);
    }

    for (const entity of updated) {
      if (!entity.position) continue;
      const id = toNum(entity.entityId);

      if (this.isTank(entity)) {
        this.upsertTank(id, entity, this.isSelfEntity(entity, this.client.selfEntityId), false);
      } else if (this.isBullet(entity)) {
        this.upsertBullet(id, entity, false);
      }
    }

    for (const removedId of delta.removedEntityIds ?? []) {
      const id = toNum(removedId);
      this.destroyTank(id);
      this.destroyBullet(id);
    }
  }

  private isTank(entity: IEntity): boolean {
    return !!entity.player;
  }

  private isBullet(entity: IEntity): boolean {
    return !!entity.bullet && !entity.player;
  }

  private isSelfEntity(entity: IEntity, selfEntityId: number): boolean {
    const id = toNum(entity.entityId);
    if (id === selfEntityId) {
      return true;
    }
    return !!entity.player && toNum(entity.player.playerId) === this.client.selfPlayerId;
  }

  private upsertTank(id: number, entity: IEntity, isSelf: boolean, snapPosition: boolean): void {
    const x = entity.position!.x ?? 0;
    const y = entity.position!.y ?? 0;
    const rotation = this.directionToAngle(entity);
    const team = entity.player?.team ?? Team.TEAM_NONE;
    const lives = entity.player?.lives ?? 0;

    if (isSelf && entity.player) {
      this.selfLives = lives;
      this.syncSelfCooldown(entity);
    }

    let tank = this.tanks.get(id);
    const isNew = !tank;
    if (!tank) {
      tank = this.createTankVisual(isSelf, entity);
      tank.targetX = x;
      tank.targetY = y;
      tank.targetRotation = rotation;
      this.tanks.set(id, tank);
    } else {
      tank.targetX = x;
      tank.targetY = y;
      tank.targetRotation = rotation;
      tank.isSelf = isSelf;
      tank.team = team;
      tank.playerId = toNum(entity.player?.playerId);
      tank.body.setFillStyle(this.tankColor(entity));
      tank.body.setStrokeStyle(isSelf ? 3 : 2, isSelf ? SELF_OUTLINE : 0x000000);
      tank.isSelf = isSelf;
      tank.selfGlow.setVisible(isSelf);
      this.updateTankLabels(tank, entity, isSelf);
    }

    tank.container.setDepth(5);

    if (snapPosition) {
      tank.container.setPosition(x, y);
      tank.container.setRotation(rotation);
    }

    if (snapPosition && tank.isSelf) {
      this.updateTileCulling(true);
    }

    if (isNew && isSelf) {
      spawnRespawnPulse(this, tank.container);
    }
  }

  private syncSelfCooldown(entity: IEntity): void {
    const tank = entity.tank;
    if (!tank) {
      return;
    }
    this.selfCooldownMax = toNum(tank.shootCooldownTicks);
    this.selfCooldownRemaining = toNum(tank.cooldownRemainingTicks);
  }

  private upsertBullet(id: number, entity: IEntity, snapPosition: boolean): void {
    const x = entity.position!.x ?? 0;
    const y = entity.position!.y ?? 0;

    let bullet = this.bullets.get(id);
    if (!bullet) {
      const sprite = this.add.circle(x, y, BULLET_RADIUS, BULLET_COLOR).setStrokeStyle(1, 0x000000);
      sprite.setDepth(6);
      bullet = { sprite, targetX: x, targetY: y };
      this.bullets.set(id, bullet);
    } else {
      bullet.targetX = x;
      bullet.targetY = y;
    }

    if (snapPosition) {
      bullet.sprite.setPosition(x, y);
    }
  }

  private removeMissingTanks(seen: Set<number>): void {
    for (const [id, tank] of this.tanks) {
      if (!seen.has(id)) {
        tank.container.destroy();
        this.tanks.delete(id);
      }
    }
  }

  private removeMissingBullets(seen: Set<number>): void {
    for (const [id, bullet] of this.bullets) {
      if (!seen.has(id)) {
        bullet.sprite.destroy();
        this.bullets.delete(id);
      }
    }
  }

  private destroyTank(id: number): void {
    const tank = this.tanks.get(id);
    if (tank) {
      spawnExplosion(this, tank.container.x, tank.container.y, 2);
      tank.container.destroy();
      this.tanks.delete(id);
    }
  }

  private destroyBullet(id: number): void {
    const bullet = this.bullets.get(id);
    if (bullet) {
      spawnExplosion(this, bullet.sprite.x, bullet.sprite.y, 0.8);
      bullet.sprite.destroy();
      this.bullets.delete(id);
    }
  }

  private tankColor(entity: IEntity): number {
    return this.tankColorForTeam(entity.player?.team ?? Team.TEAM_NONE);
  }

  private tankColorForTeam(team: number): number {
    return TEAM_COLOR[team] ?? TEAM_COLOR[Team.TEAM_NONE];
  }

  private createTankVisual(isSelf: boolean, entity: IEntity): TankVisual {
    const team = entity.player?.team ?? Team.TEAM_NONE;

    const selfGlow = this.add
      .circle(0, 2, TANK_SIZE * 0.62, SELF_GLOW_COLOR, 0.28)
      .setVisible(isSelf);
    this.tweens.add({
      targets: selfGlow,
      alpha: { from: 0.18, to: 0.38 },
      scale: { from: 0.92, to: 1.06 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const body = this.add
      .rectangle(0, 0, TANK_SIZE, TANK_SIZE, this.tankColor(entity))
      .setStrokeStyle(isSelf ? 3 : 2, isSelf ? SELF_OUTLINE : 0x000000);
    const barrel = this.add.rectangle(0, -TANK_SIZE / 2, 4, TANK_SIZE / 2, 0x222222);

    const youMarker = this.add
      .text(0, -TANK_SIZE / 2 - 6, '▲', {
        fontSize: '9px',
        color: '#35c759',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 1)
      .setVisible(isSelf);

    const nameLabel = this.add
      .text(0, TANK_SIZE / 2 + 2, '', { fontSize: '10px', fontFamily: 'monospace' })
      .setOrigin(0.5, 0);

    const livesLabel = this.add
      .text(0, TANK_SIZE / 2 + 14, '', { fontSize: '9px', fontFamily: 'monospace' })
      .setOrigin(0.5, 0);

    const container = this.add.container(0, 0, [selfGlow, body, barrel, youMarker, nameLabel, livesLabel]);

    const tank: TankVisual = {
      container,
      body,
      selfGlow,
      youMarker,
      nameLabel,
      livesLabel,
      playerId: toNum(entity.player?.playerId),
      team,
      isSelf,
      targetX: 0,
      targetY: 0,
      targetRotation: 0,
    };
    this.updateTankLabels(tank, entity, isSelf);
    return tank;
  }

  private updateTankLabels(tank: TankVisual, entity: IEntity, isSelf: boolean): void {
    const team = entity.player?.team ?? Team.TEAM_NONE;
    const name = entity.player?.name ?? '';
    const lives = entity.player?.lives ?? 0;
    const selfTeam = this.playerRegistry.selfTeam(this.client.selfPlayerId);
    const isAlly = team === selfTeam && team !== Team.TEAM_NONE;

    tank.youMarker.setVisible(isSelf);

    if (name) {
      let color = TEAM_CSS[team] ?? '#cccccc';
      if (isSelf) {
        color = '#e8ffe8';
      } else if (!isAlly && selfTeam !== Team.TEAM_NONE) {
        color = '#ff9999';
      }
      tank.nameLabel.setText(isSelf ? `YOU · ${name}` : name);
      tank.nameLabel.setColor(color);
      tank.nameLabel.setFontStyle(isSelf ? 'bold' : 'normal');
    }

    const hearts = '♥'.repeat(Math.max(0, lives));
    tank.livesLabel.setText(hearts);
    tank.livesLabel.setColor(isSelf ? '#35c759' : '#888888');
  }

  private directionToAngle(entity: IEntity): number {
    switch (entity.direction?.direction) {
      case Direction.DOWN:
        return Math.PI;
      case Direction.LEFT:
        return -Math.PI / 2;
      case Direction.RIGHT:
        return Math.PI / 2;
      case Direction.UP:
      default:
        return 0;
    }
  }
}
