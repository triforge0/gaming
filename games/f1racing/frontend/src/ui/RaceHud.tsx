import { useEffect, useState } from 'react';
import type { RaceBridge } from '../net/RaceBridge';
import {
  F1SessionPhase,
  formatCountdown,
  formatLapTime,
  type LiveTelemetry,
} from '../shared';
import { useF1Store } from '../store/f1Store';
import Minimap from './Minimap';

interface Props {
  bridge: RaceBridge | null;
  trackId: string;
  isHost: boolean;
  onSkipQualifying: () => void;
}

const EMPTY_TELEMETRY: LiveTelemetry = {
  speed: 0,
  gear: 0,
  nitro: 0,
  currentLap: 0,
  racePosition: 0,
};

export default function RaceHud({ bridge, trackId, isHost, onSkipQualifying }: Props) {
  const playerId = useF1Store((state) => state.playerId);
  const raceState = useF1Store((state) => state.raceState);
  const standings = useF1Store((state) => state.standings);
  const pingMs = useF1Store((state) => state.pingMs);
  const roomConfig = useF1Store((state) => state.roomConfig);
  const [telemetry, setTelemetry] = useState<LiveTelemetry>(EMPTY_TELEMETRY);

  useEffect(() => {
    if (!bridge) return;
    const id = window.setInterval(() => {
      const entity = bridge.world.entities.get(bridge.world.selfEntityId);
      const vehicle = entity?.vehicle;
      setTelemetry({
        speed: vehicle?.speed ?? 0,
        gear: vehicle?.gear ?? 0,
        nitro: vehicle?.nitro ?? 0,
        currentLap: vehicle?.currentLap ?? 0,
        racePosition: vehicle?.racePosition ?? 0,
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [bridge]);

  const sessionPhase = raceState?.sessionPhase ?? F1SessionPhase.RACE;
  const isQualifying = sessionPhase === F1SessionPhase.QUALIFYING;
  const sessionLabel = isQualifying ? 'Qualifying' : 'Race';
  const myStanding = standings.find((entry) => entry.playerId === playerId);
  const targetLaps = roomConfig?.lapCount ?? raceState?.lapCount ?? 3;
  const sessionTimer = formatCountdown(raceState?.sessionRemainingMs ?? 0);

  return (
    <div className="race-hud">
      <div className="hud-row top">
        <div className="hud-card">
          <span className="hud-label">{sessionLabel}</span>
          <strong className="hud-timer">{sessionTimer}</strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">Position</span>
          <strong>P{telemetry.racePosition || myStanding?.position || '—'}</strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">{isQualifying ? 'Best lap' : 'Lap'}</span>
          <strong>
            {isQualifying
              ? formatLapTime(myStanding?.bestLapMs ?? 0)
              : `${Math.min(telemetry.currentLap + 1, targetLaps)} / ${targetLaps}`}
          </strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">Speed</span>
          <strong>{Math.round(telemetry.speed)} km/h</strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">Gear</span>
          <strong>{telemetry.gear || 'N'}</strong>
        </div>
        <div className="hud-card nitro">
          <span className="hud-label">Nitro</span>
          <div className="nitro-bar">
            <div className="nitro-fill" style={{ width: `${Math.round(telemetry.nitro * 100)}%` }} />
          </div>
        </div>
        <div className="hud-card compact">
          <span className="hud-label">Ping</span>
          <strong>{pingMs} ms</strong>
        </div>
        {isQualifying && isHost && (
          <button type="button" className="btn small hud-btn" onClick={onSkipQualifying}>
            Skip quali
          </button>
        )}
      </div>

      <div className="hud-row bottom">
        <Minimap bridge={bridge} trackId={trackId} />
        <div className="standings-panel">
          <p className="hud-label">Standings</p>
          <ol className="standings-list">
            {standings.slice(0, 8).map((entry) => (
              <li key={entry.playerId} className={entry.playerId === playerId ? 'self' : ''}>
                <span>P{entry.position}</span>
                <span>{entry.displayName}</span>
                <span>L{entry.lap + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
