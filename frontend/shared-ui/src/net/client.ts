import { com } from './proto';

const proto = com.triforge.protocol.proto;
export const MessageEnvelope = proto.MessageEnvelope;
export const GameMessage = proto.GameMessage;
export const JoinRequest = proto.JoinRequest;
export const InputCommand = proto.InputCommand;
export const LobbyCommand = proto.LobbyCommand;
export const LobbyRejectReason = proto.LobbyRejectReason;
export const Direction = proto.Direction;
export const TileType = proto.TileType;
export const GameEventType = proto.GameEventType;
export const MatchPhase = proto.MatchPhase;
export const Team = proto.Team;
export const SpawnRegion = proto.SpawnRegion;
export const TreasureQuestMessage = proto.TreasureQuestMessage;
export const InteractCommand = proto.InteractCommand;
export const QuizSubmit = proto.QuizSubmit;
export const QuizAnswer = proto.QuizAnswer;
export const QuizOutcome = proto.QuizOutcome;
export const ChallengeResponse = proto.ChallengeResponse;
export const DuelSubmit = proto.DuelSubmit;
export const EncounterState = proto.EncounterState;
export const ItemType = proto.ItemType;
export const ItemUse = proto.ItemUse;

export type IEntity = com.triforge.protocol.proto.IEntityProto;
export type IOrientation = com.triforge.protocol.proto.IOrientationComponentProto;
export type IPosition = com.triforge.protocol.proto.IPositionComponentProto;
export type IFullSnapshot = com.triforge.protocol.proto.IFullSnapshot;
export type IDeltaSnapshot = com.triforge.protocol.proto.IDeltaSnapshot;
export type IMapSnapshot = com.triforge.protocol.proto.IMapSnapshot;
export type IFogSnapshot = com.triforge.protocol.proto.IFogSnapshot;
export type IGameEvent = com.triforge.protocol.proto.IGameEvent;
export type ITileChange = com.triforge.protocol.proto.ITileChange;
export type IRoomLobbySnapshot = com.triforge.protocol.proto.IRoomLobbySnapshot;
export type ILobbyPlayer = com.triforge.protocol.proto.ILobbyPlayer;
export type IMatchPhaseUpdate = com.triforge.protocol.proto.IMatchPhaseUpdate;
export type IMatchResult = com.triforge.protocol.proto.IMatchResult;
export type IPlayerMatchStats = com.triforge.protocol.proto.IPlayerMatchStats;
export type ITreasureQuestMessage = com.triforge.protocol.proto.ITreasureQuestMessage;
export type IQuizPrompt = com.triforge.protocol.proto.IQuizPrompt;
export type IQuizResult = com.triforge.protocol.proto.IQuizResult;
export type IHintReveal = com.triforge.protocol.proto.IHintReveal;
export type IPlayerStateUpdate = com.triforge.protocol.proto.IPlayerStateUpdate;
export type IQuizQuestionProto = com.triforge.protocol.proto.IQuizQuestionProto;
export type QuizOutcomeValue = com.triforge.protocol.proto.QuizOutcome;
export type IEncounterOffer = com.triforge.protocol.proto.IEncounterOffer;
export type IDuelPrompt = com.triforge.protocol.proto.IDuelPrompt;
export type IDuelResult = com.triforge.protocol.proto.IDuelResult;
export type EncounterStateValue = com.triforge.protocol.proto.EncounterState;
export type ItemTypeValue = com.triforge.protocol.proto.ItemType;
export type IInventoryItemProto = com.triforge.protocol.proto.IInventoryItemProto;
export type IInventoryUpdate = com.triforge.protocol.proto.IInventoryUpdate;
export type ILeaderboard = com.triforge.protocol.proto.ILeaderboard;
export type ILeaderboardEntry = com.triforge.protocol.proto.ILeaderboardEntry;

export type MatchPhaseValue = com.triforge.protocol.proto.MatchPhase;
export type TeamValue = com.triforge.protocol.proto.Team;
export type SpawnRegionValue = com.triforge.protocol.proto.SpawnRegion;
export type LobbyRejectReasonValue = com.triforge.protocol.proto.LobbyRejectReason;
export type ILobbyCommandRejected = com.triforge.protocol.proto.ILobbyCommandRejected;

export interface InputState {
  // Legacy 2D 4-way input (Phaser client).
  moveUp: boolean;
  moveDown: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  shoot?: boolean;

  // 3D keyboard input: rotation intent, server accumulates yaw/pitch.
  moveForward?: boolean;
  moveBackward?: boolean;
  turnLeft?: boolean;
  turnRight?: boolean;
  aimUp?: boolean;
  aimDown?: boolean;
}

const SCHEMA_VERSION = '1.0.0';

export function toNum(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  return (value as { toNumber: () => number }).toNumber();
}

function wsUrl(connection?: GameClientConnection): string {
  const scheme = location.protocol === 'https:' ? 'wss' : 'ws';
  if (connection?.hostIp) {
    const port = connection.port ?? 8080;
    return `${scheme}://${connection.hostIp}:${port}/ws`;
  }
  const port = location.port === '3000' ? '8080' : location.port;
  const host = port ? `${location.hostname}:${port}` : location.hostname;
  return `${scheme}://${host}/ws`;
}

export interface GameClientConnection {
  hostIp?: string;
  port?: number;
}

export interface GameClientHandlers {
  onFullSnapshot?: (snapshot: IFullSnapshot, selfEntityId: number) => void;
  onDeltaSnapshot?: (delta: IDeltaSnapshot) => void;
  onMapSnapshot?: (map: IMapSnapshot) => void;
  onGameEvent?: (event: IGameEvent) => void;
  onLobbySnapshot?: (lobby: IRoomLobbySnapshot) => void;
  onMatchPhaseUpdate?: (update: IMatchPhaseUpdate) => void;
  onMatchResult?: (result: IMatchResult) => void;
  onJoinRejected?: (lobby: IRoomLobbySnapshot | null) => void;
  onLobbyCommandRejected?: (rejection: ILobbyCommandRejected) => void;
  onTreasureQuestMessage?: (message: ITreasureQuestMessage) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

/**
 * Single long-lived connection to a room. The same instance is shared across the room-lobby,
 * match and scoreboard scenes (stashed in the Phaser registry), so {@link handlers} is swapped by
 * whichever scene is active. The latest lobby snapshot / phase / result are cached so a freshly
 * activated scene can render current state immediately rather than waiting for the next push.
 */
export class GameClient {
  private ws?: WebSocket;
  private clientSeq = 0;

  handlers: GameClientHandlers;

  selfPlayerId = -1;
  selfEntityId = -1;

  /** Estimated RTT from last input send to last server message (ms). */
  pingMs = 0;
  private lastInputSentAt = 0;

  lastLobby: IRoomLobbySnapshot | null = null;
  lastPhase: IMatchPhaseUpdate | null = null;
  lastResult: IMatchResult | null = null;
  lastMap: IMapSnapshot | null = null;
  lastServerTick = 0;
  lastLeaderboard: ILeaderboard | null = null;
  lastInventory: IInventoryItemProto[] = [];

  /** TPS used for quiz countdown estimates (matches server GameLoop). */
  readonly serverTps = 60;

  constructor(
    private readonly roomId: string,
    private readonly playerName: string,
    handlers: GameClientHandlers = {},
    private readonly connection: GameClientConnection = {},
  ) {
    this.handlers = handlers;
  }

  connect(): void {
    const ws = new WebSocket(wsUrl(this.connection));
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => {
      this.sendJoin();
      this.handlers.onConnected?.();
    };
    ws.onmessage = (ev) => this.handleMessage(ev.data as ArrayBuffer);
    ws.onclose = () => this.handlers.onDisconnected?.();
    ws.onerror = (e) => console.error('WebSocket error', e);
    this.ws = ws;
  }

  get phase(): MatchPhaseValue {
    return (this.lastPhase?.phase ?? this.lastLobby?.phase ?? MatchPhase.LOBBY) as MatchPhaseValue;
  }

  sendInput(input: InputState): void {
    this.lastInputSentAt = performance.now();
    this.send(
      GameMessage.create({
        inputCommand: InputCommand.create({
          moveUp: input.moveUp,
          moveDown: input.moveDown,
          moveLeft: input.moveLeft,
          moveRight: input.moveRight,
          shoot: input.shoot ?? false,
          moveForward: input.moveForward ?? false,
          moveBackward: input.moveBackward ?? false,
          turnLeft: input.turnLeft ?? false,
          turnRight: input.turnRight ?? false,
          aimUp: input.aimUp ?? false,
          aimDown: input.aimDown ?? false,
        }),
      }),
    );
  }

  setName(displayName: string): void {
    this.sendLobby(LobbyCommand.create({ setName: { displayName } }));
  }

  setTeam(team: TeamValue): void {
    this.sendLobby(LobbyCommand.create({ setTeam: { team } }));
  }

  setSpawn(region: SpawnRegionValue): void {
    this.sendLobby(LobbyCommand.create({ setSpawn: { region } }));
  }

  setTeamSetup(spawnRegion: SpawnRegionValue, hqRegion: SpawnRegionValue): void {
    this.sendLobby(LobbyCommand.create({ setTeamSetup: { spawnRegion, hqRegion } }));
  }

  setReady(ready: boolean): void {
    this.sendLobby(LobbyCommand.create({ setReady: { ready } }));
  }

  startMatch(): void {
    this.sendLobby(LobbyCommand.create({ startMatch: {} }));
  }

  sendInteract(checkpointId = ''): void {
    this.sendTreasureQuest(
      TreasureQuestMessage.create({
        interact: InteractCommand.create({ checkpointId }),
      }),
    );
  }

  sendQuizSubmit(
    quizId: string,
    answers: Array<{ questionId: string; selectedIndex: number }>,
  ): void {
    this.sendTreasureQuest(
      TreasureQuestMessage.create({
        quizSubmit: QuizSubmit.create({
          quizId,
          answers: answers.map((answer) =>
            QuizAnswer.create({
              questionId: answer.questionId,
              selectedIndex: answer.selectedIndex,
            }),
          ),
        }),
      }),
    );
  }

  sendChallengeResponse(encounterId: string, accept: boolean): void {
    this.sendTreasureQuest(
      TreasureQuestMessage.create({
        challengeResponse: ChallengeResponse.create({ encounterId, accept }),
      }),
    );
  }

  sendDuelSubmit(
    duelId: string,
    answers: Array<{ questionId: string; selectedIndex: number }>,
  ): void {
    this.sendTreasureQuest(
      TreasureQuestMessage.create({
        duelSubmit: DuelSubmit.create({
          duelId,
          answers: answers.map((answer) =>
            QuizAnswer.create({
              questionId: answer.questionId,
              selectedIndex: answer.selectedIndex,
            }),
          ),
        }),
      }),
    );
  }

  sendItemUse(item: ItemTypeValue, targetPlayerId = 0): void {
    this.sendTreasureQuest(
      TreasureQuestMessage.create({
        itemUse: ItemUse.create({ item, targetPlayerId }),
      }),
    );
  }

  close(): void {
    this.ws?.close();
    this.ws = undefined;
  }

  private sendLobby(command: com.triforge.protocol.proto.ILobbyCommand): void {
    this.send(GameMessage.create({ lobbyCommand: command }));
  }

  private sendTreasureQuest(message: com.triforge.protocol.proto.ITreasureQuestMessage): void {
    this.send(GameMessage.create({ tq: message }));
  }

  private send(gameMessage: com.triforge.protocol.proto.IGameMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    const envelope = MessageEnvelope.create({
      roomId: this.roomId,
      schemaVersion: SCHEMA_VERSION,
      clientSeq: ++this.clientSeq,
      payload: GameMessage.encode(gameMessage).finish(),
    });
    this.ws.send(MessageEnvelope.encode(envelope).finish());
  }

  private sendJoin(): void {
    this.send(GameMessage.create({ joinRequest: JoinRequest.create({ playerName: this.playerName }) }));
  }

  private handleMessage(data: ArrayBuffer): void {
    if (this.lastInputSentAt > 0) {
      this.pingMs = Math.round(performance.now() - this.lastInputSentAt);
    }
    const envelope = MessageEnvelope.decode(new Uint8Array(data));
    const gameMessage = GameMessage.decode(envelope.payload as Uint8Array);

    if (gameMessage.joinResponse) {
      const join = gameMessage.joinResponse;
      this.selfPlayerId = toNum(join.playerId);
      if (this.selfPlayerId === 0) {
        // Rejected late join (match in progress).
        this.handlers.onJoinRejected?.(join.lobby ?? null);
        return;
      }
      if (join.map) {
        this.lastMap = join.map;
        this.handlers.onMapSnapshot?.(join.map);
      }
      if (join.lobby) {
        this.lastLobby = join.lobby;
        this.handlers.onLobbySnapshot?.(join.lobby);
      }
    } else if (gameMessage.roomLobbySnapshot) {
      this.lastLobby = gameMessage.roomLobbySnapshot;
      this.handlers.onLobbySnapshot?.(gameMessage.roomLobbySnapshot);
    } else if (gameMessage.lobbyCommandRejected) {
      this.handlers.onLobbyCommandRejected?.(gameMessage.lobbyCommandRejected);
    } else if (gameMessage.matchPhaseUpdate) {
      this.lastPhase = gameMessage.matchPhaseUpdate;
      this.lastServerTick = toNum(gameMessage.matchPhaseUpdate.serverTick);
      this.handlers.onMatchPhaseUpdate?.(gameMessage.matchPhaseUpdate);
    } else if (gameMessage.matchResult) {
      this.lastResult = gameMessage.matchResult;
      this.handlers.onMatchResult?.(gameMessage.matchResult);
    } else if (gameMessage.fullSnapshot) {
      this.lastServerTick = toNum(gameMessage.fullSnapshot.tick) || this.lastServerTick;
      this.trackSelfEntity(gameMessage.fullSnapshot.entities ?? []);
      this.handlers.onFullSnapshot?.(gameMessage.fullSnapshot, this.selfEntityId);
    } else if (gameMessage.deltaSnapshot) {
      this.lastServerTick = toNum(gameMessage.deltaSnapshot.tick) || this.lastServerTick;
      this.trackSelfEntity(gameMessage.deltaSnapshot.updatedEntities ?? []);
      this.handlers.onDeltaSnapshot?.(gameMessage.deltaSnapshot);
    } else if (gameMessage.gameEvent) {
      this.handlers.onGameEvent?.(gameMessage.gameEvent);
    } else if (gameMessage.mapSnapshot) {
      this.lastMap = gameMessage.mapSnapshot;
      this.handlers.onMapSnapshot?.(gameMessage.mapSnapshot);
    } else if (gameMessage.tq) {
      if (gameMessage.tq.leaderboard) {
        this.lastLeaderboard = gameMessage.tq.leaderboard;
      }
      if (gameMessage.tq.inventoryUpdate?.items) {
        this.lastInventory = gameMessage.tq.inventoryUpdate.items;
      }
      this.handlers.onTreasureQuestMessage?.(gameMessage.tq);
    }
  }

  /** Entity id is learned from snapshots once the match spawns player-controlled entities. */
  private trackSelfEntity(entities: IEntity[]): void {
    if (this.selfPlayerId < 0) {
      return;
    }
    for (const entity of entities) {
      if (entity.questAvatar && toNum(entity.questAvatar.playerId) === this.selfPlayerId) {
        this.selfEntityId = toNum(entity.entityId);
        return;
      }
      if (entity.player && toNum(entity.player.playerId) === this.selfPlayerId) {
        this.selfEntityId = toNum(entity.entityId);
        return;
      }
    }
  }
}
