import {
  GameClient,
  IEntity,
  IFullSnapshot,
  IDeltaSnapshot,
  IMapSnapshot,
  IMatchPhaseUpdate,
  IMatchResult,
  IRoomLobbySnapshot,
  IGameEvent,
  InputState,
  MatchPhase,
  toNum,
} from '@triforge/shared-ui';

/**
 * Live world state, mutated in place and read every frame by the Three.js render loop.
 * Kept OUTSIDE React so per-tick snapshot churn never triggers a re-render.
 */
export interface WorldState {
  map: IMapSnapshot | null;
  entities: Map<number, IEntity>;
  selfEntityId: number;
  selfPlayerId: number;
  tick: number;
}

/** UI-facing state; React subscribes to this and re-renders only when it changes. */
export interface UiState {
  connected: boolean;
  phase: number;
  lobby: IRoomLobbySnapshot | null;
  phaseUpdate: IMatchPhaseUpdate | null;
  result: IMatchResult | null;
  pingMs: number;
  events: IGameEvent[];
}

type UiListener = (state: UiState) => void;

/**
 * Bridges the framework-agnostic {@link GameClient} to (a) the Three.js render loop via
 * {@link world} and (b) React via {@link subscribe}. This is the single seam every other
 * frontend-3d module talks to.
 */
export class GameBridge {
  readonly client: GameClient;
  readonly world: WorldState = {
    map: null,
    entities: new Map(),
    selfEntityId: -1,
    selfPlayerId: -1,
    tick: 0,
  };

  private ui: UiState = {
    connected: false,
    phase: MatchPhase.LOBBY,
    lobby: null,
    phaseUpdate: null,
    result: null,
    pingMs: 0,
    events: [],
  };

  private listeners = new Set<UiListener>();

  /** Latest input packet (for debug overlay + render prediction). */
  lastInput: InputState | null = null;

  /** Live key state sampled on the render thread. */
  inputReader: (() => InputState | null) | null = null;

  /** Synchronous per-event hook for the render loop (explosions/sfx). Set by SceneRoot. */
  onRenderEvent: ((event: IGameEvent) => void) | null = null;

  constructor(roomId: string, playerName: string) {
    this.client = new GameClient(roomId, playerName, {
      onConnected: () => this.patchUi({ connected: true }),
      onDisconnected: () => this.patchUi({ connected: false }),
      onMapSnapshot: (map) => this.onMap(map),
      onLobbySnapshot: (lobby) => this.patchUi({ lobby, phase: toNum(lobby.phase) }),
      onFullSnapshot: (snap, selfEntityId) => this.onFull(snap, selfEntityId),
      onDeltaSnapshot: (delta) => this.onDelta(delta),
      onMatchPhaseUpdate: (update) => this.onPhase(update),
      onMatchResult: (result) => this.patchUi({ result }),
      onGameEvent: (event) => this.onEvent(event),
    });
  }

  connect(): void {
    this.client.connect();
    if (this.client.lastMap) {
      this.onMap(this.client.lastMap);
    }
  }

  subscribe(listener: UiListener): () => void {
    this.listeners.add(listener);
    listener(this.ui);
    return () => this.listeners.delete(listener);
  }

  snapshotUi(): UiState {
    return this.ui;
  }

  sendInput(input: InputState): void {
    this.client.sendInput(input);
  }

  // ── snapshot ingestion (render-loop state) ──────────────────────────

  private onMap(map: IMapSnapshot): void {
    this.world.map = map;
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

  // ── UI state (React) ────────────────────────────────────────────────

  private onPhase(update: IMatchPhaseUpdate): void {
    this.patchUi({ phase: toNum(update.phase), phaseUpdate: update });
  }

  private onEvent(event: IGameEvent): void {
    // Notify the render loop first so it can spawn effects at live mesh positions.
    this.onRenderEvent?.(event);
    // Keep a short rolling buffer for the kill feed / HUD.
    const events = [...this.ui.events, event].slice(-16);
    this.patchUi({ events });
  }

  private patchUi(patch: Partial<UiState>): void {
    this.ui = { ...this.ui, ...patch, pingMs: this.client.pingMs };
    for (const listener of this.listeners) {
      listener(this.ui);
    }
  }
}
