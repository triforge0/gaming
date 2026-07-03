import { useEffect, useRef, useState } from 'react';
import { MatchPhase } from '@triforge/shared-ui';
import { GameBridge } from './net/GameBridge';
import { SceneRoot } from './render/SceneRoot';
import { InputController } from './input/InputController';
import { GameUi } from './ui/GameUi';
import { useUiState } from './useBridge';
import { MoveDebugPanel } from './debug/MoveDebugPanel';

const PHASE_LABEL: Record<number, string> = {
  [MatchPhase.LOBBY]: 'Lobby',
  [MatchPhase.COUNTDOWN]: 'Countdown',
  [MatchPhase.PLAYING]: 'In match',
  [MatchPhase.ENDED]: 'Match ended',
};

const SHOW_DEBUG = new URLSearchParams(window.location.search).has('debug');

export function App() {
  const [bridge, setBridge] = useState<GameBridge | null>(null);
  const [roomId, setRoomId] = useState('lobby');
  const [name, setName] = useState('Pilot');

  const connect = () => {
    const b = new GameBridge(roomId, name);
    b.connect();
    setBridge(b);
  };

  if (!bridge) {
    return (
      <div className="ta-app ta-connect">
        <div className="ta-connect-grid" aria-hidden />
        <div className="ta-connect-card">
          <div className="ta-connect-badge">
            <span className="ta-connect-badge-dot" />
            Multiplayer · LAN
          </div>
          <h1 className="ta-connect-title">
            Tank Arena
            <span>3D Combat</span>
          </h1>
          <p className="ta-connect-sub">Join a room on the same network. No install required.</p>
          <label className="ta-field">
            <span className="ta-field-label">Room ID</span>
            <input
              className="ta-input"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="lobby"
              autoComplete="off"
            />
          </label>
          <label className="ta-field">
            <span className="ta-field-label">Callsign</span>
            <input
              className="ta-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pilot"
              autoComplete="off"
            />
          </label>
          <button type="button" className="ta-btn" onClick={connect}>
            Deploy
          </button>
        </div>
      </div>
    );
  }

  return <GameView bridge={bridge} />;
}

function GameView({ bridge }: { bridge: GameBridge }) {
  const ui = useUiState(bridge);
  const [tick, setTick] = useState(0);
  const [entityCount, setEntityCount] = useState(0);
  const canvasHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasHost.current) return;
    const scene = new SceneRoot(canvasHost.current, bridge);
    scene.start();
    const input = new InputController(bridge);
    input.start();
    return () => {
      input.stop();
      scene.dispose();
    };
  }, [bridge]);

  useEffect(() => {
    if (!SHOW_DEBUG) return;
    const id = window.setInterval(() => {
      setTick(bridge.world.tick);
      setEntityCount(bridge.world.entities.size);
    }, 250);
    return () => window.clearInterval(id);
  }, [bridge]);

  return (
    <div className="ta-app ta-game">
      <div ref={canvasHost} className="ta-canvas" />
      <div className="ta-vignette" aria-hidden />
      {ui && <GameUi bridge={bridge} ui={ui} />}
      <StatusChip ui={ui} tick={tick} entityCount={entityCount} />
      <MoveDebugPanel />
    </div>
  );
}

function StatusChip({
  ui,
  tick,
  entityCount,
}: {
  ui: ReturnType<typeof useUiState>;
  tick: number;
  entityCount: number;
}) {
  const connected = ui?.connected ?? false;
  const phase = PHASE_LABEL[ui?.phase ?? MatchPhase.LOBBY];
  const inMatch = ui?.phase === MatchPhase.PLAYING || ui?.phase === MatchPhase.COUNTDOWN;
  const ping = ui?.pingMs ?? 0;
  const pingClass = ping < 30 ? 'ta-status-ping--good' : ping < 80 ? 'ta-status-ping--warn' : 'ta-status-ping--bad';

  return (
    <div className="ta-status">
      <div className="ta-status-row">
        <span className={`ta-status-dot ${connected ? 'ta-status-dot--on' : 'ta-status-dot--off'}`} />
        <span>{connected ? 'Connected' : 'Reconnecting…'}</span>
        <span className="ta-status-phase">· {phase}</span>
        {inMatch && connected && (
          <span className={`ta-status-ping ${pingClass}`}>· {ping} ms</span>
        )}
      </div>
      {SHOW_DEBUG && (
        <div className="ta-status-meta">tick {tick} · entities {entityCount}</div>
      )}
    </div>
  );
}
