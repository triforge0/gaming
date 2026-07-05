import { LEVELS, TIME_LIMIT_MAX, TIME_LIMIT_MIN, DEFAULT_FAIR_MODE, getLevelById, formatJoinCode, formatRoomLevelLabel } from '../shared';
import { useGameStore } from '../store/gameStore';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LobbyScreen({ socket }: Props) {
  const roomId = useGameStore((s) => s.roomId);
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);
  const playerName = useGameStore((s) => s.playerName);
  const connected = useGameStore((s) => s.connected);

  const isHost = Boolean(playerId && gameState?.hostId === playerId);
  const playerCount = gameState?.players.length ?? 0;
  const canStart = playerCount >= 2;
  const fairMode = gameState?.fairMode ?? DEFAULT_FAIR_MODE;
  const fairLevel = fairMode ? getLevelById(fairMode.levelId) : null;
  const setupMode = !fairMode.enabled ? 'free' : fairMode.battle ? 'battle' : 'fair';

  const joinCode = roomId ? formatJoinCode(roomId) : '';
  const levelLabel = roomId ? formatRoomLevelLabel(roomId) : null;

  const copyRoomId = () => {
    if (joinCode) navigator.clipboard.writeText(joinCode);
  };

  const setSetupMode = (mode: 'free' | 'fair' | 'battle') => {
    if (mode === 'free') socket.configureFairMode({ enabled: false, battle: false });
    else if (mode === 'fair') socket.configureFairMode({ enabled: true, battle: false });
    else socket.configureFairMode({ enabled: true, battle: true });
  };

  return (
    <div className="screen lobby-screen" style={{
      background: 'radial-gradient(ellipse at center, #5c4730 0%, #3d2e1e 70%)',
    }}>
      <div className="panel lobby-panel">
        <div className="lobby-room-header">
          <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Room ID</p>
            <h2 className="lobby-room-id">{joinCode || '—'}</h2>
            {levelLabel && (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: 2 }}>
                Level: {levelLabel}
              </p>
            )}
          </div>
          <button type="button" className="btn btn-secondary" onClick={copyRoomId} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Copy ID
          </button>
        </div>

        <div className="lobby-intro">
          <p>
            <strong>Free</strong> — thiết kế map cho đối thủ · <strong>Fair</strong> — map giống nhau · <strong>Battle</strong> — cùng màn hình, tranh vàng giữa map.
          </p>
        </div>

        <div className="lobby-mode-section">
          <p className="lobby-section-label">CHẾ ĐỘ SETUP</p>

          {isHost ? (
            <div className="lobby-mode-options lobby-mode-options-3">
              <button
                type="button"
                className={`lobby-mode-btn ${setupMode === 'free' ? 'active' : ''}`}
                onClick={() => setSetupMode('free')}
              >
                <span className="lobby-mode-title">Free setup</span>
                <span className="lobby-mode-desc">Mỗi người chọn level &amp; time cho đối thủ</span>
              </button>
              <button
                type="button"
                className={`lobby-mode-btn ${setupMode === 'fair' ? 'active' : ''}`}
                onClick={() => setSetupMode('fair')}
              >
                <span className="lobby-mode-title">⚖️ Fair</span>
                <span className="lobby-mode-desc">Map giống nhau · jackpot đáy · quanh bẫy</span>
              </button>
              <button
                type="button"
                className={`lobby-mode-btn battle ${setupMode === 'battle' ? 'active' : ''}`}
                onClick={() => setSetupMode('battle')}
              >
                <span className="lobby-mode-title">⚔️ Battle</span>
                <span className="lobby-mode-desc">Màn hình chung · vàng giữa · va móc &amp; cướp</span>
              </button>
            </div>
          ) : (
            <div className={`lobby-mode-guest ${setupMode}`}>
              {setupMode === 'battle' ? (
                <>
                  <strong>⚔️ Battle mode</strong>
                  <span>{fairLevel?.name} · {formatTime(fairMode.timeLimit)} · Shared screen · Vàng giữa map</span>
                </>
              ) : setupMode === 'fair' ? (
                <>
                  <strong>⚖️ Fair mode</strong>
                  <span>{fairLevel?.name} · {formatTime(fairMode.timeLimit)} · Target {fairLevel?.targetScore} · Map giống nhau</span>
                </>
              ) : (
                <>
                  <strong>Free setup</strong>
                  <span>Mỗi người tự chọn level &amp; time cho đối thủ</span>
                </>
              )}
            </div>
          )}

          {isHost && setupMode !== 'free' && (
            <div className="lobby-fair-settings">
              <p className="setup-toolbar-label">Level chung</p>
              <div className="home-level-row">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`setup-level-btn ${fairMode.levelId === l.id ? 'active' : ''}`}
                    onClick={() => socket.configureFairMode({ levelId: l.id })}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <p className="setup-toolbar-label">
                Time chung: {formatTime(fairMode.timeLimit)}
              </p>
              <input
                type="range"
                min={TIME_LIMIT_MIN}
                max={TIME_LIMIT_MAX}
                step={5}
                value={fairMode.timeLimit}
                onChange={(e) => socket.configureFairMode({ timeLimit: Number(e.target.value) })}
                className="setup-time-slider"
                aria-label="Thời gian chung fair mode"
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <p className="lobby-section-label">PLAYERS</p>
          {gameState?.players.map((p) => (
            <div key={p.id} className={`lobby-player-row ${p.id === playerId ? 'self' : ''}`}>
              <span style={{ fontSize: '1.5rem' }}>⛏️</span>
              <div>
                <p style={{ fontWeight: 600 }}>{p.name} {p.id === playerId && '(You)'}</p>
                {p.id === gameState.hostId && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>Host</span>
                )}
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--success)' }}>✓</span>
            </div>
          ))}
          {playerCount < 2 && (
            <div className="lobby-wait-opponent">Waiting for opponent...</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isHost ? (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => socket.startGame()}
                disabled={!canStart || !connected}
                style={{ flex: 1, opacity: canStart && connected ? 1 : 0.5 }}
              >
                Start Game
              </button>
              {!canStart && (
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent)' }}>
                  Cần 2 người chơi ({playerCount}/2). Mở tab thứ 2 → nhập Room ID <strong>{joinCode}</strong>.
                </p>
              )}
            </>
          ) : (
            <div style={{ flex: 1, textAlign: 'center', color: 'var(--text-dim)', padding: 14 }}>
              Waiting for host to start...
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Xin chào, <strong style={{ color: 'var(--gold)' }}>{playerName}</strong>
        </p>
      </div>
    </div>
  );
}
