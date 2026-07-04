import { useEffect, useRef, useState } from 'react';
import {
  GameEventType,
  IGameEvent,
  ILobbyPlayer,
  IMatchResult,
  IPlayerMatchStats,
  MatchPhase,
  SpawnRegion,
  Team,
  toNum,
} from '@triforge/shared-ui';
import { GameBridge, UiState } from '../net/GameBridge';
import { alarmSiren } from '../audio/alarm';

const HQ_MAX_HP = 12;

const TEAM_REGIONS: Record<number, { value: number; label: string }[]> = {
  [Team.TEAM_RED]: [
    { value: SpawnRegion.TOP_LEFT, label: 'Top-Left' },
    { value: SpawnRegion.BOTTOM_LEFT, label: 'Bottom-Left' },
  ],
  [Team.TEAM_BLUE]: [
    { value: SpawnRegion.TOP_RIGHT, label: 'Top-Right' },
    { value: SpawnRegion.BOTTOM_RIGHT, label: 'Bottom-Right' },
  ],
};

const TEAM_NAME: Record<number, string> = {
  [Team.TEAM_NONE]: '—',
  [Team.TEAM_RED]: 'Red',
  [Team.TEAM_BLUE]: 'Blue',
};

const TEAM_CLASS: Record<number, string> = {
  [Team.TEAM_NONE]: '',
  [Team.TEAM_RED]: 'ta-hud-team--red',
  [Team.TEAM_BLUE]: 'ta-hud-team--blue',
};

const TEAM_COLOR: Record<number, string> = {
  [Team.TEAM_NONE]: '#8b93a7',
  [Team.TEAM_RED]: '#ff4d57',
  [Team.TEAM_BLUE]: '#4d9dff',
};

const MAX_NAME_LENGTH = 24;

function resolvePlayerName(bridge: GameBridge, playerId: number): string {
  if (playerId <= 0) return 'Unknown';
  for (const entity of bridge.world.entities.values()) {
    if (entity.player && toNum(entity.player.playerId) === playerId) {
      return entity.player.name?.trim() || 'Pilot';
    }
  }
  const lobbyPlayer = bridge.snapshotUi().lobby?.players?.find(
    (p) => toNum(p.playerId) === playerId,
  );
  return lobbyPlayer?.displayName?.trim() || `Pilot #${playerId}`;
}

/** The local player's team, from their live tank if present, else the lobby roster. */
function selfTeam(bridge: GameBridge): number {
  const selfId = bridge.client.selfPlayerId;
  for (const entity of bridge.world.entities.values()) {
    if (entity.player && toNum(entity.player.playerId) === selfId) {
      return entity.player.team ?? Team.TEAM_NONE;
    }
  }
  const lobbyPlayer = bridge.snapshotUi().lobby?.players?.find((p) => toNum(p.playerId) === selfId);
  return lobbyPlayer?.team ?? Team.TEAM_NONE;
}

const MUTE_STORAGE_KEY = 'ta-alarm-muted';

/** Persisted sound-mute preference; keeps the alarm siren in sync and survives reloads. */
function useMuted(): [boolean, () => void] {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    alarmSiren.setMuted(muted);
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0');
    } catch {
      /* storage unavailable — preference just won't persist */
    }
  }, [muted]);
  return [muted, () => setMuted((m) => !m)];
}

/** True for a few seconds after the given HP drops, so a base attack raises a visible alert. */
function useUnderAttack(hp: number): boolean {
  const prev = useRef(hp);
  const [alerting, setAlerting] = useState(false);
  useEffect(() => {
    const dropped = hp < prev.current;
    prev.current = hp;
    if (!dropped) return;
    setAlerting(true);
    const id = window.setTimeout(() => setAlerting(false), 3500);
    return () => window.clearTimeout(id);
  }, [hp]);
  return alerting;
}

export function GameUi({ bridge, ui }: { bridge: GameBridge; ui: UiState }) {
  const inLobby = ui.phase === MatchPhase.LOBBY;
  const inMatch = ui.phase === MatchPhase.PLAYING || ui.phase === MatchPhase.COUNTDOWN;

  return (
    <div className="ta-overlay">
      {inLobby && <div className="ta-backdrop" aria-hidden />}
      {inLobby && <LobbyPanel bridge={bridge} ui={ui} />}
      {ui.phase === MatchPhase.COUNTDOWN && <Countdown seconds={ui.phaseUpdate?.countdownSeconds ?? 0} />}
      {inMatch && <Hud ui={ui} bridge={bridge} />}
      {ui.phase === MatchPhase.PLAYING && <KillFeed events={ui.events} bridge={bridge} />}
      {ui.phase === MatchPhase.PLAYING && <ControlsHint />}
      {ui.phase === MatchPhase.ENDED && ui.result && <Scoreboard result={ui.result} bridge={bridge} />}
    </div>
  );
}

function LobbyPanel({ bridge, ui }: { bridge: GameBridge; ui: UiState }) {
  const players = ui.lobby?.players ?? [];
  const selfId = bridge.client.selfPlayerId;
  const self = players.find((p) => toNum(p.playerId) === selfId);
  const isHost = self?.isHost ?? false;
  const canStart = ui.lobby?.canStart ?? false;
  const roomName = ui.lobby?.roomName ?? 'Room';

  return (
    <div className="ta-panel">
      <header className="ta-panel-header">
        <p className="ta-panel-eyebrow">Waiting room</p>
        <h2 className="ta-panel-title">{roomName}</h2>
        <p className="ta-panel-sub">
          {players.length} pilot{players.length === 1 ? '' : 's'} · set your callsign, pick a team and ready up
        </p>
      </header>

      <RenameControls bridge={bridge} self={self} />

      <ul className="ta-player-list">
        {players.length === 0 && (
          <li className="ta-player-row">
            <span className="ta-player-name" style={{ color: 'var(--ta-muted)' }}>No players yet…</span>
          </li>
        )}
        {players.map((p: ILobbyPlayer) => {
          const team = p.team ?? Team.TEAM_NONE;
          const initial = (p.displayName || 'P').charAt(0).toUpperCase();
          return (
            <li key={toNum(p.playerId)} className="ta-player-row">
              <div className="ta-player-info">
                <div
                  className="ta-player-avatar"
                  style={{
                    background: `${TEAM_COLOR[team]}22`,
                    color: TEAM_COLOR[team],
                    border: `1px solid ${TEAM_COLOR[team]}44`,
                  }}
                >
                  {initial}
                </div>
                <span className="ta-player-name" style={{ color: TEAM_COLOR[team] }}>
                  {p.displayName || 'Pilot'}
                  {p.isHost && <span className="ta-player-host" title="Host">👑</span>}
                </span>
              </div>
              <span className={`ta-badge ${p.ready ? 'ta-badge--ready' : 'ta-badge--waiting'}`}>
                {p.ready ? 'Ready' : 'Waiting'}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="ta-team-pick">
        <button
          type="button"
          className={`ta-team-btn ta-team-btn--red${self?.team === Team.TEAM_RED ? ' ta-team-btn--active' : ''}`}
          onClick={() => bridge.client.setTeam(Team.TEAM_RED)}
        >
          Red
        </button>
        <button
          type="button"
          className={`ta-team-btn ta-team-btn--blue${self?.team === Team.TEAM_BLUE ? ' ta-team-btn--active' : ''}`}
          onClick={() => bridge.client.setTeam(Team.TEAM_BLUE)}
        >
          Blue
        </button>
      </div>

      {self?.isTeamCaptain && (self.team === Team.TEAM_RED || self.team === Team.TEAM_BLUE) && (
        <TeamSetupControls bridge={bridge} team={self.team} />
      )}

      <div className="ta-actions">
        <button
          type="button"
          className={`ta-btn ta-btn--ready${self?.ready ? ' ta-btn--ghost' : ''}`}
          onClick={() => bridge.client.setReady(!(self?.ready ?? false))}
        >
          {self?.ready ? 'Cancel ready' : 'Ready up'}
        </button>
        {isHost && (
          <button
            type="button"
            className="ta-btn ta-btn--start"
            disabled={!canStart}
            onClick={() => bridge.client.startMatch()}
          >
            Start match
          </button>
        )}
      </div>
    </div>
  );
}

function RenameControls({
  bridge,
  self,
}: {
  bridge: GameBridge;
  self: ILobbyPlayer | undefined;
}) {
  const [draft, setDraft] = useState(self?.displayName ?? 'Pilot');

  useEffect(() => {
    if (self?.displayName) {
      setDraft(self.displayName);
    }
  }, [self?.displayName]);

  const applyName = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > MAX_NAME_LENGTH) return;
    bridge.client.setName(trimmed);
  };

  return (
    <div className="ta-rename">
      <label className="ta-field-label">
        Callsign
        <div className="ta-rename-row">
          <input
            className="ta-input"
            value={draft}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyName();
            }}
            placeholder="Pilot"
            autoComplete="off"
          />
          <button
            type="button"
            className="ta-btn ta-btn--ghost"
            onClick={applyName}
            disabled={!draft.trim()}
          >
            Set name
          </button>
        </div>
      </label>
    </div>
  );
}

function TeamSetupControls({ bridge, team }: { bridge: GameBridge; team: number }) {
  const regions = TEAM_REGIONS[team] ?? [];
  const [spawn, setSpawn] = useState(regions[0]?.value ?? SpawnRegion.TOP_LEFT);
  const [hq, setHq] = useState(regions[1]?.value ?? regions[0]?.value ?? SpawnRegion.TOP_LEFT);

  return (
    <div className="ta-setup">
      <p className="ta-setup-title">Captain · {TEAM_NAME[team]} setup</p>
      <div className="ta-setup-grid">
        <label className="ta-field-label">
          Spawn
          <select className="ta-select" value={spawn} onChange={(e) => setSpawn(Number(e.target.value))}>
            {regions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <label className="ta-field-label">
          HQ
          <select className="ta-select" value={hq} onChange={(e) => setHq(Number(e.target.value))}>
            {regions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
      </div>
      <button type="button" className="ta-btn ta-btn--ghost" onClick={() => bridge.client.setTeamSetup(spawn, hq)}>
        Confirm setup
      </button>
    </div>
  );
}

function Countdown({ seconds }: { seconds: number }) {
  const isGo = seconds <= 0;
  return (
    <div key={seconds} className={`ta-countdown${isGo ? ' ta-countdown--go' : ''}`}>
      {isGo ? 'GO!' : seconds}
    </div>
  );
}

function Hud({ ui, bridge }: { ui: UiState; bridge: GameBridge }) {
  const p = ui.phaseUpdate;
  const timeMs = toNum(p?.matchRemainingMs);
  const mm = Math.floor(timeMs / 60000);
  const ss = Math.floor((timeMs % 60000) / 1000).toString().padStart(2, '0');
  const redHp = p?.redHqHp ?? 0;
  const blueHp = p?.blueHqHp ?? 0;

  const team = selfTeam(bridge);
  const ownHp = team === Team.TEAM_RED ? redHp : team === Team.TEAM_BLUE ? blueHp : HQ_MAX_HP;
  const underAttack = useUnderAttack(ownHp);
  const [muted, toggleMuted] = useMuted();

  useEffect(() => {
    if (underAttack && !muted) alarmSiren.start();
    else alarmSiren.stop();
    return () => alarmSiren.stop();
  }, [underAttack, muted]);

  return (
    <>
      <div className="ta-hud">
        <TeamHq side="red" hp={redHp} alert={underAttack && team === Team.TEAM_RED} />
        <div className="ta-hud-timer">{mm}:{ss}</div>
        <TeamHq side="blue" hp={blueHp} alert={underAttack && team === Team.TEAM_BLUE} />
      </div>
      <MuteButton muted={muted} onToggle={toggleMuted} />
      {underAttack && <BaseAlert hp={ownHp} />}
    </>
  );
}

function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`ta-mute-btn${muted ? ' ta-mute-btn--muted' : ''}`}
      onClick={onToggle}
      aria-label={muted ? 'Unmute alarm' : 'Mute alarm'}
      title={muted ? 'Sound off' : 'Sound on'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

function TeamHq({ side, hp, alert }: { side: 'red' | 'blue'; hp: number; alert: boolean }) {
  const team = side === 'red' ? Team.TEAM_RED : Team.TEAM_BLUE;
  const pct = Math.max(0, Math.min(100, (hp / HQ_MAX_HP) * 100));
  const label = side === 'red' ? 'RED' : 'BLUE';
  return (
    <div className={`ta-hud-team ${TEAM_CLASS[team]}${alert ? ' ta-hud-team--alert' : ''}`}>
      <span className="ta-hud-tag">{label}</span>
      <div className="ta-hud-hp-track">
        <div className="ta-hud-hp-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="ta-hud-hp-value">{hp}</span>
    </div>
  );
}

/** Center-screen warning shown while the local player's base is taking fire. */
function BaseAlert({ hp }: { hp: number }) {
  const destroyed = hp <= 0;
  return (
    <div className={`ta-base-alert${destroyed ? ' ta-base-alert--critical' : ''}`} role="alert">
      <span className="ta-base-alert-icon">⚠</span>
      <span className="ta-base-alert-text">
        {destroyed ? 'BASE DESTROYED' : 'YOUR BASE IS UNDER ATTACK'}
      </span>
      <span className="ta-base-alert-hp">HP {Math.max(0, hp)}/{HQ_MAX_HP}</span>
    </div>
  );
}

function KillFeed({ events, bridge }: { events: IGameEvent[]; bridge: GameBridge }) {
  const selfId = bridge.client.selfPlayerId;
  const deaths = events.filter((e) => e.type === GameEventType.PLAYER_DEATH).slice(-5);
  if (deaths.length === 0) return null;

  return (
    <div className="ta-killfeed">
      {deaths.map((e, i) => {
        const victim = toNum(e.playerId);
        const killer = toNum(e.killerPlayerId);
        const victimName = resolvePlayerName(bridge, victim);
        const killerName = killer > 0 ? resolvePlayerName(bridge, killer) : null;
        const mine = killer === selfId || victim === selfId;
        return (
          <div key={`${victim}-${i}`} className={`ta-killfeed-entry${mine ? ' ta-killfeed-entry--mine' : ''}`}>
            {killerName ? `${killerName} eliminated ${victimName}` : `☠ ${victimName} was eliminated`}
          </div>
        );
      })}
    </div>
  );
}

function ControlsHint() {
  return (
    <div className="ta-controls">
      <span><span className="ta-kbd">↑↓</span> move</span>
      <span><span className="ta-kbd">←→</span> turn</span>
      <span><span className="ta-kbd">Q</span><span className="ta-kbd">E</span> aim</span>
      <span><span className="ta-kbd">F</span> lock</span>
      <span><span className="ta-kbd">Space</span> fire</span>
    </div>
  );
}

function Scoreboard({ result, bridge }: { result: IMatchResult; bridge: GameBridge }) {
  const winner = result.winningTeam ?? Team.TEAM_NONE;
  const stats = (result.stats ?? []).slice().sort((a, b) => (b.kills ?? 0) - (a.kills ?? 0));
  const selfId = bridge.client.selfPlayerId;
  const winnerLabel =
    winner === Team.TEAM_NONE ? 'Draw' : `${winner === Team.TEAM_RED ? 'Red' : 'Blue'} victory`;

  return (
    <div className="ta-panel">
      <h2 className="ta-scoreboard-winner" style={{ color: TEAM_COLOR[winner] }}>
        {winnerLabel}
      </h2>
      <div className="ta-score-summary">
        Red {result.redScore ?? 0} — {result.blueScore ?? 0} Blue
      </div>
      <table className="ta-stats-table">
        <thead>
          <tr>
            <th>Player</th><th>K</th><th>D</th><th>A</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s: IPlayerMatchStats) => {
            const mine = toNum(s.playerId) === selfId;
            return (
              <tr key={toNum(s.playerId)} className={mine ? 'ta-stats-row--self' : undefined}>
                <td style={{ color: TEAM_COLOR[s.team ?? Team.TEAM_NONE], fontWeight: mine ? 700 : 500 }}>
                  {s.displayName || 'Pilot'}
                </td>
                <td>{s.kills ?? 0}</td>
                <td>{s.deaths ?? 0}</td>
                <td>{s.assists ?? 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
