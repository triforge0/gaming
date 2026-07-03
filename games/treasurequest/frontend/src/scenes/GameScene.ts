import Phaser from 'phaser';
import {
  Direction,
  EncounterState,
  GameClient,
  IEntity,
  IFullSnapshot,
  IDeltaSnapshot,
  IMapSnapshot,
  IMatchPhaseUpdate,
  IMatchResult,
  InputState,
  ITreasureQuestMessage,
  MatchPhase,
  ChatOverlay,
  TileType,
  toNum,
} from '@triforge/shared-ui';
import { QUEST_VILLAGE_OVERLAY } from '../content/mapOverlay';
import { createTileVisual } from '../render/tiles';
import { drawCheckpointMarkers, drawTreasureMarker } from '../render/zones';
import { InteractPrompt } from '../ui/InteractPrompt';
import { QuestHud } from '../ui/QuestHud';
import { QuizOverlay } from '../ui/QuizOverlay';
import { DuelOverlay } from '../ui/pvp/DuelOverlay';
import { EncounterPrompt } from '../ui/pvp/EncounterPrompt';
import { formatProtectionLabel, protectionLabelColor } from '../ui/pvp/protectionLabel';
import { InventoryBar, inventoryFromPlayerState } from '../ui/inventory/InventoryBar';
import { LeaderboardPanel } from '../ui/leaderboard/LeaderboardPanel';
import { avatarOverlapsZone, findZone } from '../utils/zoneCheck';

const AVATAR_SIZE = 28;
const INTERPOLATION_MS = 100;
const SELF_OUTLINE = 0xffffff;
const SELF_GLOW_COLOR = 0xffd166;
const FLOOR_COLOR = 0x15151c;

const AVATAR_COLORS = [
  0x4ecdc4, 0xff6b6b, 0xffe66d, 0x95e1d3, 0xc77dff, 0x74c0fc, 0xff922b, 0x51cf66,
];

interface AvatarVisual {
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Rectangle;
  selfGlow: Phaser.GameObjects.Arc;
  youMarker: Phaser.GameObjects.Text;
  nameLabel: Phaser.GameObjects.Text;
  protectionLabel: Phaser.GameObjects.Text;
  playerId: number;
  isSelf: boolean;
  targetX: number;
  targetY: number;
  targetRotation: number;
}

export default class GameScene extends Phaser.Scene {
  private client!: GameClient;
  private avatars = new Map<number, AvatarVisual>();
  private tileSprites = new Map<string, Phaser.GameObjects.Container>();
  private mapTiles: number[] = [];
  private mapWidth = 0;
  private mapHeight = 0;
  private mapTileSize = 32;

  private questHud!: QuestHud;
  private interactPrompt!: InteractPrompt;
  private quizOverlay!: QuizOverlay;
  private encounterPrompt!: EncounterPrompt;
  private duelOverlay!: DuelOverlay;
  private inventoryBar!: InventoryBar;
  private leaderboardPanel!: LeaderboardPanel;

  private phase: number = MatchPhase.COUNTDOWN;
  private matchRemainingMs = 0;
  private selfScore = 0;
  private selfCheckpoint = '';
  private selfCleared = 0;
  private selfShielded = false;
  private selfPvpCooldown = false;
  private selfStealImmune = false;
  private selfWorldX = 0;
  private selfWorldY = 0;
  private hasSelfPosition = false;
  private transitionedToScoreboard = false;
  private awaitingQuizResult = false;
  private awaitingDuelResult = false;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private interactKey!: Phaser.Input.Keyboard.Key;

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
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.questHud = new QuestHud();
    this.interactPrompt = new InteractPrompt();
    this.quizOverlay = new QuizOverlay(this.client);
    this.encounterPrompt = new EncounterPrompt(this.client);
    this.duelOverlay = new DuelOverlay(this.client);
    this.inventoryBar = new InventoryBar(this.client, () => this.listOtherPlayers());
    this.leaderboardPanel = new LeaderboardPanel();
    this.inventoryBar.update(this.client.lastInventory);
    this.leaderboardPanel.update(this.client.lastLeaderboard, this.client.selfPlayerId);

    this.add
      .text(8, 572, 'WASD / arrows move · E interact at checkpoint', {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setDepth(100)
      .setScrollFactor(0);

    this.client.handlers = {
      onFullSnapshot: (snapshot, selfEntityId) => this.applyFullSnapshot(snapshot, selfEntityId),
      onDeltaSnapshot: (delta) => this.applyDeltaSnapshot(delta),
      onMapSnapshot: (map) => this.applyMap(map),
      onMatchPhaseUpdate: (update) => this.onPhaseUpdate(update),
      onMatchResult: (result) => this.toScoreboard(result),
      onTreasureQuestMessage: (message) => this.onTreasureQuestMessage(message),
      onLobbySnapshot: (lobby) => {
        if ((lobby.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY) {
          this.toScoreboard();
        }
      },
      onDisconnected: () => this.scene.start('LobbyScene'),
    };

    if (this.client.lastMap) {
      this.applyMap(this.client.lastMap);
    }
    if (this.client.lastPhase) {
      this.onPhaseUpdate(this.client.lastPhase);
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.refreshHud();
  }

  shutdown(): void {
    this.questHud.destroy();
    this.interactPrompt.destroy();
    this.quizOverlay.destroy();
    this.encounterPrompt.destroy();
    this.duelOverlay.destroy();
    this.inventoryBar.destroy();
    this.leaderboardPanel.destroy();
    this.avatars.clear();
    this.tileSprites.clear();
  }

  update(_time: number, delta: number): void {
    this.trackSelfPosition();
    this.sendMovementInput();
    this.interpolateAvatars(delta);
    this.followSelfCamera();
    this.updateInteractPrompt();
    this.handleInteractInput();
    this.quizOverlay.updateTimer();
    this.encounterPrompt.updateTimer();
    this.duelOverlay.updateTimer();
    this.refreshItemBarEnabled();
    this.refreshHud();
  }

  private refreshItemBarEnabled(): void {
    const blocked =
      this.phase !== MatchPhase.PLAYING ||
      this.quizOverlay.isOpen() ||
      this.duelOverlay.isOpen() ||
      this.awaitingQuizResult ||
      this.awaitingDuelResult;
    this.inventoryBar.setEnabled(!blocked);
  }

  private listOtherPlayers(): Array<{ playerId: number; name: string }> {
    const players: Array<{ playerId: number; name: string }> = [];
    for (const visual of this.avatars.values()) {
      if (visual.isSelf) {
        continue;
      }
      players.push({
        playerId: visual.playerId,
        name: visual.nameLabel.text,
      });
    }
    return players;
  }

  private sendMovementInput(): void {
    if (
      this.phase !== MatchPhase.PLAYING ||
      this.quizOverlay.isOpen() ||
      this.duelOverlay.isOpen() ||
      ChatOverlay.isInputFocused()
    ) {
      return;
    }
    const input: InputState = {
      moveUp: this.cursors.up.isDown || this.wasd.W.isDown,
      moveDown: this.cursors.down.isDown || this.wasd.S.isDown,
      moveLeft: this.cursors.left.isDown || this.wasd.A.isDown,
      moveRight: this.cursors.right.isDown || this.wasd.D.isDown,
      shoot: false,
    };
    this.client.sendInput(input);
  }

  private handleInteractInput(): void {
    if (
      this.phase !== MatchPhase.PLAYING ||
      this.quizOverlay.isOpen() ||
      this.duelOverlay.isOpen() ||
      this.awaitingQuizResult ||
      this.awaitingDuelResult ||
      ChatOverlay.isInputFocused() ||
      !Phaser.Input.Keyboard.JustDown(this.interactKey)
    ) {
      return;
    }
    if (!this.canInteractAtCheckpoint()) {
      return;
    }
    this.interactPrompt.hide();
    this.client.sendInteract(this.selfCheckpoint);
  }

  private canInteractAtCheckpoint(): boolean {
    if (!this.selfCheckpoint || !this.hasSelfPosition) {
      return false;
    }
    const zone = findZone(this.selfCheckpoint, QUEST_VILLAGE_OVERLAY.checkpoints);
    if (!zone) {
      return false;
    }
    return avatarOverlapsZone(this.selfWorldX, this.selfWorldY, zone, this.mapTileSize);
  }

  private updateInteractPrompt(): void {
    if (
      this.phase !== MatchPhase.PLAYING ||
      this.quizOverlay.isOpen() ||
      this.duelOverlay.isOpen() ||
      this.awaitingQuizResult ||
      this.awaitingDuelResult ||
      !this.canInteractAtCheckpoint()
    ) {
      this.interactPrompt.hide();
      return;
    }
    this.interactPrompt.show(this.selfCheckpoint);
  }

  private trackSelfPosition(): void {
    for (const visual of this.avatars.values()) {
      if (!visual.isSelf) {
        continue;
      }
      this.selfWorldX = visual.container.x;
      this.selfWorldY = visual.container.y;
      this.hasSelfPosition = true;
      return;
    }
    this.hasSelfPosition = false;
  }

  private onTreasureQuestMessage(message: ITreasureQuestMessage): void {
    if (message.playerStateUpdate) {
      const update = message.playerStateUpdate;
      this.selfScore = toNum(update.score);
      this.selfCheckpoint = update.currentCheckpoint ?? '';
      this.selfCleared = toNum(update.checkpointsCleared);
      this.selfShielded = update.shielded ?? false;
      this.selfPvpCooldown = update.pvpCooldown ?? false;
      this.selfStealImmune = update.stealImmune ?? false;
      if (update.inventory) {
        this.inventoryBar.update(inventoryFromPlayerState(update.inventory));
      }
      return;
    }

    if (message.inventoryUpdate) {
      this.inventoryBar.update(inventoryFromPlayerState(message.inventoryUpdate.items));
      return;
    }

    if (message.leaderboard) {
      this.leaderboardPanel.update(message.leaderboard, this.client.selfPlayerId);
      return;
    }

    if (message.quizPrompt) {
      const prompt = message.quizPrompt;
      this.awaitingQuizResult = false;
      this.interactPrompt.hide();
      this.quizOverlay.openPrompt(prompt, (answers) => {
        this.awaitingQuizResult = true;
        this.client.sendQuizSubmit(prompt.quizId ?? '', answers);
      });
      return;
    }

    if (message.quizResult) {
      this.awaitingQuizResult = false;
      this.quizOverlay.showResult(message.quizResult);
      return;
    }

    if (message.hintReveal) {
      this.quizOverlay.showHint(message.hintReveal);
      return;
    }

    if (message.expeditionComplete) {
      const complete = message.expeditionComplete;
      const won = complete.youWon ?? false;
      const winner = complete.winnerName ?? 'Explorer';
      this.add
        .text(400, 300, won ? 'You reached the treasure!' : `${winner} reached the treasure!`, {
          fontSize: '22px',
          color: '#ffd166',
          fontFamily: 'monospace',
          backgroundColor: '#000000cc',
          padding: { x: 16, y: 10 },
        })
        .setOrigin(0.5)
        .setDepth(200)
        .setScrollFactor(0);
      return;
    }

    if (message.encounterOffer) {
      this.handleEncounterOffer(message.encounterOffer);
      return;
    }

    if (message.duelPrompt) {
      const prompt = message.duelPrompt;
      this.encounterPrompt.hide();
      this.awaitingDuelResult = false;
      this.interactPrompt.hide();
      this.duelOverlay.openPrompt(prompt, (answers) => {
        this.awaitingDuelResult = true;
        this.client.sendDuelSubmit(prompt.duelId ?? '', answers);
      });
      return;
    }

    if (message.duelResult) {
      this.awaitingDuelResult = false;
      this.duelOverlay.showResult(message.duelResult, this.client.selfPlayerId);
      return;
    }
  }

  private handleEncounterOffer(offer: NonNullable<ITreasureQuestMessage['encounterOffer']>): void {
    const state = offer.state ?? EncounterState.ENC_OFFERED;
    if (state === EncounterState.ENC_OFFERED) {
      this.encounterPrompt.show(offer, (accept) => {
        this.client.sendChallengeResponse(offer.encounterId ?? '', accept);
      });
      return;
    }
    this.encounterPrompt.hide();
  }

  private applyMap(map: IMapSnapshot): void {
    this.mapWidth = toNum(map.width);
    this.mapHeight = toNum(map.height);
    this.mapTileSize = toNum(map.tileSize) || 32;
    this.mapTiles = (map.tiles ?? []).map((tile) => toNum(tile));

    this.cameras.main.setBounds(0, 0, this.mapWidth * this.mapTileSize, this.mapHeight * this.mapTileSize);

    for (const sprite of this.tileSprites.values()) {
      sprite.destroy();
    }
    this.tileSprites.clear();

    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const tile = this.mapTiles[y * this.mapWidth + x] ?? TileType.EMPTY;
        const cx = x * this.mapTileSize + this.mapTileSize / 2;
        const cy = y * this.mapTileSize + this.mapTileSize / 2;
        const key = `${x},${y}`;

        if (tile === TileType.EMPTY) {
          const floor = this.add
            .rectangle(cx, cy, this.mapTileSize, this.mapTileSize, FLOOR_COLOR, 1)
            .setStrokeStyle(1, 0x1f1f28, 0.35)
            .setDepth(0);
          const container = this.add.container(0, 0).add(floor);
          this.tileSprites.set(key, container);
        } else {
          this.tileSprites.set(key, createTileVisual(this, cx, cy, tile, this.mapTileSize));
        }
      }
    }

    drawCheckpointMarkers(this, QUEST_VILLAGE_OVERLAY.checkpoints, this.mapTileSize);
    drawTreasureMarker(this, QUEST_VILLAGE_OVERLAY.treasure, this.mapTileSize);
  }

  private applyFullSnapshot(snapshot: IFullSnapshot, selfEntityId: number): void {
    const seen = new Set<number>();
    for (const entity of snapshot.entities ?? []) {
      const entityId = toNum(entity.entityId);
      seen.add(entityId);
      this.upsertAvatar(entity, entityId === selfEntityId);
    }
    for (const entityId of this.avatars.keys()) {
      if (!seen.has(entityId)) {
        this.removeAvatar(entityId);
      }
    }
  }

  private applyDeltaSnapshot(delta: IDeltaSnapshot): void {
    for (const entity of delta.updatedEntities ?? []) {
      const entityId = toNum(entity.entityId);
      this.upsertAvatar(entity, entityId === this.client.selfEntityId);
    }
    for (const entityId of delta.removedEntityIds ?? []) {
      this.removeAvatar(toNum(entityId));
    }
  }

  private upsertAvatar(entity: IEntity, isSelf: boolean): void {
    if (!entity.questAvatar || !entity.position) {
      return;
    }

    const entityId = toNum(entity.entityId);
    const playerId = toNum(entity.questAvatar.playerId);
    const x = toNum(entity.position.x);
    const y = toNum(entity.position.y);
    const rotation = this.directionToAngle(entity);
    const name = entity.questAvatar.name ?? `P${playerId}`;

    if (isSelf) {
      this.selfScore = toNum(entity.questAvatar.score);
      this.selfCheckpoint = entity.questAvatar.currentCheckpoint ?? '';
      this.selfCleared = toNum(entity.questAvatar.checkpointsCleared);
      this.selfShielded = entity.questAvatar.shielded ?? false;
      this.selfPvpCooldown = entity.questAvatar.pvpCooldown ?? false;
      this.selfStealImmune = entity.questAvatar.stealImmune ?? false;
    }

    const protection = this.protectionFromAvatar(entity.questAvatar);

    let visual = this.avatars.get(entityId);
    if (!visual) {
      visual = this.createAvatarVisual(entityId, playerId, name, isSelf, x, y, rotation);
      this.avatars.set(entityId, visual);
      this.applyProtectionLabel(visual, protection);
      return;
    }

    visual.isSelf = isSelf;
    visual.playerId = playerId;
    visual.targetX = x;
    visual.targetY = y;
    visual.targetRotation = rotation;
    visual.nameLabel.setText(name);
    visual.youMarker.setVisible(isSelf);
    visual.selfGlow.setVisible(isSelf);
    visual.body.setStrokeStyle(isSelf ? 3 : 1, isSelf ? SELF_OUTLINE : 0x111111, isSelf ? 1 : 0.6);
    this.applyProtectionLabel(visual, protection);
  }

  private protectionFromAvatar(
    avatar: NonNullable<IEntity['questAvatar']>,
  ): { shielded: boolean; pvpCooldown: boolean; stealImmune: boolean } {
    return {
      shielded: avatar.shielded ?? false,
      pvpCooldown: avatar.pvpCooldown ?? false,
      stealImmune: avatar.stealImmune ?? false,
    };
  }

  private applyProtectionLabel(
    visual: AvatarVisual,
    flags: { shielded: boolean; pvpCooldown: boolean; stealImmune: boolean },
  ): void {
    const label = formatProtectionLabel(flags);
    visual.protectionLabel.setText(label);
    visual.protectionLabel.setColor(protectionLabelColor(flags));
    visual.protectionLabel.setVisible(label.length > 0);
  }

  private createAvatarVisual(
    _entityId: number,
    playerId: number,
    name: string,
    isSelf: boolean,
    x: number,
    y: number,
    rotation: number,
  ): AvatarVisual {
    const color = AVATAR_COLORS[playerId % AVATAR_COLORS.length];
    const container = this.add.container(x, y).setDepth(10);
    const selfGlow = this.add
      .circle(0, 0, AVATAR_SIZE * 0.72, SELF_GLOW_COLOR, 0.18)
      .setVisible(isSelf);
    const body = this.add
      .rectangle(0, 0, AVATAR_SIZE, AVATAR_SIZE, color, 1)
      .setStrokeStyle(isSelf ? 3 : 1, isSelf ? SELF_OUTLINE : 0x111111, isSelf ? 1 : 0.6);
    const youMarker = this.add
      .text(0, -AVATAR_SIZE * 0.9, 'YOU', {
        fontSize: '9px',
        color: '#ffd166',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setVisible(isSelf);
    const nameLabel = this.add
      .text(0, AVATAR_SIZE * 0.75, name, {
        fontSize: '10px',
        color: '#eeeeee',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
    const protectionLabel = this.add
      .text(0, -AVATAR_SIZE * 1.35, '', {
        fontSize: '8px',
        color: '#4ecdc4',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setVisible(false);

    container.add([selfGlow, body, youMarker, protectionLabel, nameLabel]);
    container.setRotation(rotation);

    return {
      container,
      body,
      selfGlow,
      youMarker,
      nameLabel,
      protectionLabel,
      playerId,
      isSelf,
      targetX: x,
      targetY: y,
      targetRotation: rotation,
    };
  }

  private removeAvatar(entityId: number): void {
    const visual = this.avatars.get(entityId);
    visual?.container.destroy();
    this.avatars.delete(entityId);
  }

  private interpolateAvatars(delta: number): void {
    const t = Math.min(1, delta / INTERPOLATION_MS);
    for (const visual of this.avatars.values()) {
      const cx = Phaser.Math.Linear(visual.container.x, visual.targetX, t);
      const cy = Phaser.Math.Linear(visual.container.y, visual.targetY, t);
      visual.container.setPosition(cx, cy);
      visual.container.setRotation(
        Phaser.Math.Angle.RotateTo(visual.container.rotation, visual.targetRotation, t * 0.25),
      );
    }
  }

  private followSelfCamera(): void {
    for (const visual of this.avatars.values()) {
      if (visual.isSelf) {
        this.cameras.main.centerOn(visual.container.x, visual.container.y);
        return;
      }
    }
  }

  private onPhaseUpdate(update: IMatchPhaseUpdate): void {
    this.phase = update.phase ?? MatchPhase.LOBBY;
    this.matchRemainingMs = toNum(update.matchRemainingMs);
    if (this.phase === MatchPhase.ENDED) {
      this.toScoreboard();
    }
  }

  private toScoreboard(result?: IMatchResult): void {
    if (this.transitionedToScoreboard) {
      return;
    }
    this.transitionedToScoreboard = true;
    this.scene.start('ScoreboardScene', { result });
  }

  private refreshHud(): void {
    const phaseLabel =
      this.phase === MatchPhase.PLAYING
        ? 'PLAYING'
        : this.phase === MatchPhase.COUNTDOWN
          ? 'STARTING'
          : 'LOBBY';
    const timeSec = Math.max(0, Math.ceil(this.matchRemainingMs / 1000));
    this.questHud.update({
      phaseLabel,
      matchSeconds: timeSec,
      score: this.selfScore,
      cleared: this.selfCleared,
      checkpoint: this.selfCheckpoint,
      pingMs: this.client.pingMs,
      shielded: this.selfShielded,
      pvpCooldown: this.selfPvpCooldown,
      stealImmune: this.selfStealImmune,
    });
  }

  private directionToAngle(entity: IEntity): number {
    switch (entity.direction?.direction) {
      case Direction.DOWN:
        return Math.PI / 2;
      case Direction.LEFT:
        return Math.PI;
      case Direction.RIGHT:
        return 0;
      case Direction.UP:
        return -Math.PI / 2;
      default:
        return 0;
    }
  }
}
