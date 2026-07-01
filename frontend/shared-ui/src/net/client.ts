import { com } from './proto';

const proto = com.triforge.protocol.proto;
export const MessageEnvelope = proto.MessageEnvelope;
export const GameMessage = proto.GameMessage;
export const JoinRequest = proto.JoinRequest;
export const InputCommand = proto.InputCommand;
export const LobbyCommand = proto.LobbyCommand;
export const Direction = proto.Direction;
export const TileType = proto.TileType;
export const GameEventType = proto.GameEventType;
export const MatchPhase = proto.MatchPhase;
export const Team = proto.Team;
export const SpawnRegion = proto.SpawnRegion;

export type IEntity = com.triforge.protocol.proto.IEntityProto;
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

export type MatchPhaseValue = com.triforge.protocol.proto.MatchPhase;
export type TeamValue = com.triforge.protocol.proto.Team;
export type SpawnRegionValue = com.triforge.protocol.proto.SpawnRegion;

export interface InputState {
  moveUp: boolean;
  moveDown: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  shoot?: boolean;
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

  close(): void {
    this.ws?.close();
    this.ws = undefined;
  }

  private sendLobby(command: com.triforge.protocol.proto.ILobbyCommand): void {
    this.send(GameMessage.create({ lobbyCommand: command }));
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
    } else if (gameMessage.matchPhaseUpdate) {
      this.lastPhase = gameMessage.matchPhaseUpdate;
      this.handlers.onMatchPhaseUpdate?.(gameMessage.matchPhaseUpdate);
    } else if (gameMessage.matchResult) {
      this.lastResult = gameMessage.matchResult;
      this.handlers.onMatchResult?.(gameMessage.matchResult);
    } else if (gameMessage.fullSnapshot) {
      this.trackSelfEntity(gameMessage.fullSnapshot.entities ?? []);
      this.handlers.onFullSnapshot?.(gameMessage.fullSnapshot, this.selfEntityId);
    } else if (gameMessage.deltaSnapshot) {
      this.trackSelfEntity(gameMessage.deltaSnapshot.updatedEntities ?? []);
      this.handlers.onDeltaSnapshot?.(gameMessage.deltaSnapshot);
    } else if (gameMessage.gameEvent) {
      this.handlers.onGameEvent?.(gameMessage.gameEvent);
    } else if (gameMessage.mapSnapshot) {
      this.lastMap = gameMessage.mapSnapshot;
      this.handlers.onMapSnapshot?.(gameMessage.mapSnapshot);
    }
  }

  /** Tank entities are created at match start, so we learn our own entity id from snapshots. */
  private trackSelfEntity(entities: IEntity[]): void {
    if (this.selfPlayerId < 0) {
      return;
    }
    for (const entity of entities) {
      if (entity.player && toNum(entity.player.playerId) === this.selfPlayerId) {
        this.selfEntityId = toNum(entity.entityId);
        return;
      }
    }
  }
}
