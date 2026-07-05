import { useEffect, useState } from 'react';
import { MatchPhase } from '@triforge/shared-ui';
import { formatCarLabel } from '../garage/catalog';
import { readGarageLoadout } from '../garage/storage';
import { buildShareUrl, formatJoinCode, formatTrackLabel, TRACKS } from '../shared';
import { useF1Store } from '../store/f1Store';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function LobbyScreen({ socket }: Props) {
  const roomId = useF1Store((s) => s.roomId);
  const playerId = useF1Store((s) => s.playerId);
  const players = useF1Store((s) => s.lobbyPlayers);
  const roomConfig = useF1Store((s) => s.roomConfig);
  const canStart = useF1Store((s) => s.canStart);
  const matchPhase = useF1Store((s) => s.matchPhase);
  const pingMs = useF1Store((s) => s.pingMs);
  const loadout = readGarageLoadout();

  const isHost = Boolean(playerId && players.some((player) => player.id === playerId && player.host));
  const me = players.find((player) => player.id === playerId);
  const joinCode = roomId ? formatJoinCode(roomId) : '';
  const shareUrl = roomId ? buildShareUrl(roomId) : '';
  const countdown = matchPhase === MatchPhase.COUNTDOWN;

  const [lapCount, setLapCount] = useState(roomConfig?.lapCount ?? 3);
  const [maxPlayers, setMaxPlayers] = useState(roomConfig?.maxPlayers ?? 10);
  const [enableQualifying, setEnableQualifying] = useState(roomConfig?.enableQualifying ?? true);
  const [qualifyingDurationSec, setQualifyingDurationSec] = useState(roomConfig?.qualifyingDurationSec ?? 180);
  const [collisionOn, setCollisionOn] = useState(roomConfig?.collisionOn ?? true);

  useEffect(() => {
    if (!roomConfig) return;
    setLapCount(roomConfig.lapCount);
    setMaxPlayers(roomConfig.maxPlayers);
    setEnableQualifying(roomConfig.enableQualifying);
    setQualifyingDurationSec(roomConfig.qualifyingDurationSec);
    setCollisionOn(roomConfig.collisionOn);
  }, [roomConfig]);

  const copyShare = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
  };

  const applyHostConfig = () => {
    socket.updateRoomConfig({
      lapCount,
      maxPlayers,
      enableQualifying,
      qualifyingDurationSec,
      collisionOn,
    });
  };

  return (
    <div className="screen lobby-screen">
      <div className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Lobby</p>
            <h2>{joinCode || '—'}</h2>
            {roomId && <p className="muted">{formatTrackLabel(roomId)}</p>}
          </div>
          <div className="lobby-meta">
            <span className="ping-chip">{pingMs} ms</span>
            <button type="button" className="btn small" onClick={socket.leave}>Rời phòng</button>
          </div>
        </div>

        {shareUrl && (
          <div className="share-box">
            <p className="field-label">Link chia sẻ</p>
            <code>{shareUrl}</code>
            <button type="button" className="btn small" onClick={copyShare}>Copy link</button>
          </div>
        )}

        <div className="garage-preview">
          <span className="color-swatch" style={{ background: loadout.primaryColor }} />
          <div>
            <strong>{formatCarLabel(loadout.carId)}</strong>
            <p className="muted">{loadout.carId} · {loadout.primaryColor}</p>
          </div>
          <button type="button" className="btn small" onClick={() => socket.sendGarageLoadout()}>
            Sync loadout
          </button>
        </div>

        {isHost ? (
          <section className="host-panel">
            <h3>Host settings</h3>
            <div className="host-grid">
              <label>
                Track
                <select
                  className="input"
                  value={roomConfig?.trackId ?? 'city-loop'}
                  onChange={(event) => socket.updateRoomConfig({ trackId: event.target.value })}
                >
                  {TRACKS.map((track) => (
                    <option key={track.id} value={track.id}>{track.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Laps
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={99}
                  value={lapCount}
                  onChange={(event) => setLapCount(Number(event.target.value))}
                />
              </label>
              <label>
                Max players
                <input
                  className="input"
                  type="number"
                  min={2}
                  max={20}
                  value={maxPlayers}
                  onChange={(event) => setMaxPlayers(Number(event.target.value))}
                />
              </label>
              <label>
                Quali duration (s)
                <input
                  className="input"
                  type="number"
                  min={30}
                  max={600}
                  value={qualifyingDurationSec}
                  disabled={!enableQualifying}
                  onChange={(event) => setQualifyingDurationSec(Number(event.target.value))}
                />
              </label>
            </div>
            <div className="host-toggles">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={enableQualifying}
                  onChange={(event) => setEnableQualifying(event.target.checked)}
                />
                Qualifying
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={collisionOn}
                  onChange={(event) => setCollisionOn(event.target.checked)}
                />
                Car collision
              </label>
            </div>
            <div className="host-actions">
              <button type="button" className="btn" onClick={applyHostConfig}>Apply config</button>
              <button type="button" className="btn" onClick={() => socket.addBot()}>Add bot</button>
            </div>
          </section>
        ) : roomConfig && (
          <div className="config-grid">
            <span>Track: {roomConfig.trackDisplayName}</span>
            <span>Laps: {roomConfig.lapCount}</span>
            <span>Max: {roomConfig.maxPlayers}</span>
            <span>Quali: {roomConfig.enableQualifying ? `${roomConfig.qualifyingDurationSec}s` : 'Off'}</span>
            <span>Collision: {roomConfig.collisionOn ? 'On' : 'Off'}</span>
          </div>
        )}

        <ul className="player-list">
          {players.map((player) => (
            <li key={player.id} className={player.ready ? 'ready' : ''}>
              <span>{player.name}{player.host ? ' 👑' : ''}</span>
              <span className="player-actions">
                {player.ready ? 'Sẵn sàng' : 'Chưa ready'}
                {isHost && !player.host && (
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => socket.kickPlayer(player.id)}
                  >
                    Kick
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="lobby-actions">
          <button
            type="button"
            className="btn"
            onClick={() => socket.setReady(!(me?.ready ?? false))}
          >
            {me?.ready ? 'Bỏ ready' : 'Ready'}
          </button>
          {isHost && (
            <button
              type="button"
              className="btn primary"
              disabled={!canStart || countdown}
              onClick={() => socket.startRace()}
            >
              {countdown ? 'Countdown...' : 'Start race'}
            </button>
          )}
        </div>

        {!canStart && !countdown && (
          <p className="hint">Cần ít nhất 2 tay đua ready để bắt đầu.</p>
        )}
      </div>
    </div>
  );
}
