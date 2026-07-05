import {
  GameClient,
  type GameClientConnection,
  type GameClientHandlers,
  type IDeltaSnapshot,
  type IFullSnapshot,
  type IEntity,
  toNum,
} from '@triforge/shared-ui';

/** Live entity state for the Three.js render loop — never stored in React. */
export interface WorldState {
  entities: Map<number, IEntity>;
  selfEntityId: number;
  selfPlayerId: number;
  tick: number;
}

/**
 * Bridges {@link GameClient} snapshot traffic into {@link world} for the render loop.
 */
export class RaceBridge {
  readonly client: GameClient;
  readonly world: WorldState = {
    entities: new Map(),
    selfEntityId: -1,
    selfPlayerId: -1,
    tick: 0,
  };

  constructor(
    roomId: string,
    playerName: string,
    handlers: GameClientHandlers = {},
    connection: GameClientConnection = {},
  ) {
    this.client = new GameClient(roomId, playerName, {
      ...handlers,
      onFullSnapshot: (snapshot, selfEntityId) => {
        this.onFull(snapshot, selfEntityId);
        handlers.onFullSnapshot?.(snapshot, selfEntityId);
      },
      onDeltaSnapshot: (delta) => {
        this.onDelta(delta);
        handlers.onDeltaSnapshot?.(delta);
      },
    }, connection);
  }

  connect(): void {
    this.client.connect();
  }

  close(): void {
    this.client.close();
  }

  private onFull(snapshot: IFullSnapshot, selfEntityId: number): void {
    this.world.selfEntityId = selfEntityId;
    this.world.selfPlayerId = this.client.selfPlayerId;
    this.world.tick = toNum(snapshot.tick);
    this.world.entities.clear();
    for (const entity of snapshot.entities ?? []) {
      this.world.entities.set(toNum(entity.entityId), entity);
    }
  }

  private onDelta(delta: IDeltaSnapshot): void {
    this.world.selfEntityId = this.client.selfEntityId;
    this.world.tick = toNum(delta.tick);
    for (const entity of delta.updatedEntities ?? []) {
      this.world.entities.set(toNum(entity.entityId), entity);
    }
    for (const removed of delta.removedEntityIds ?? []) {
      this.world.entities.delete(toNum(removed));
    }
  }
}
