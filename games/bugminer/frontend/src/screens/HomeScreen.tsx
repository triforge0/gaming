import { useState } from 'react';
import { DEFAULT_FAIR_MODE, getLevelById, getRoomSetupMode, LEVELS, formatJoinCode } from '../shared';
import { useGameStore } from '../store/gameStore';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function roomModeLabel(fairMode = DEFAULT_FAIR_MODE): string {
  const mode = getRoomSetupMode(fairMode);
  if (mode === 'free') return '🎮 Free setup';
  const level = getLevelById(fairMode.levelId);
  if (mode === 'battle') {
    return `⚔️ Battle · ${level.name} · ${formatTime(fairMode.timeLimit)} · Shared screen`;
  }
  return `⚖️ Fair · ${level.name} · ${formatTime(fairMode.timeLimit)}`;
}

export default function HomeScreen({ socket }: Props) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [levelId, setLevelId] = useState('easy-mine');
  const [modeFilter, setModeFilter] = useState<'all' | 'free' | 'fair' | 'battle'>('all');
  const availableRooms = useGameStore((s) => s.availableRooms);
  const connected = useGameStore((s) => s.connected);

  const handleCreate = () => {
    if (!name.trim()) return;
    useGameStore.setState({ playerName: name.trim() });
    socket.createRoom(name.trim(), levelId);
  };

  const handleJoin = (targetRoomId?: string) => {
    const id = (targetRoomId ?? roomId).trim();
    if (!name.trim()) {
      useGameStore.getState().setError('Nhập tên của bạn trước khi vào phòng.');
      setTimeout(() => useGameStore.getState().setError(null), 4000);
      return;
    }
    if (!id) return;
    useGameStore.setState({ playerName: name.trim() });
    socket.joinRoom(id, name.trim());
  };

  const filteredRooms = availableRooms.filter((room) => {
    const mode = getRoomSetupMode(room.fairMode ?? DEFAULT_FAIR_MODE);
    if (modeFilter === 'all') return true;
    return mode === modeFilter;
  });

  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="home-logo">🐛</div>
        <h1 className="home-title">BUG MINER</h1>
        <p className="home-subtitle">Dual PvP — Thiết kế thử thách & đào vàng</p>
      </div>

      <div className="home-panels">
        <div className="panel home-panel">
          <input
            className="input-field"
            placeholder="Tên của bạn..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <p className="home-section-label">Level mặc định (khi tạo phòng)</p>
            <div className="home-level-row">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLevelId(l.id)}
                  className={`setup-level-btn ${levelId === l.id ? 'active' : ''}`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleCreate} style={{ width: '100%' }}>
            Tạo phòng mới
          </button>

          <div className="home-join-row">
            <input
              className="input-field"
              placeholder="Room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={{ flex: 1, maxWidth: 'none' }}
            />
            <button type="button" className="btn btn-secondary" onClick={() => handleJoin()}>
              Vào phòng
            </button>
          </div>
        </div>

        <div className="panel home-panel home-room-panel">
          <div className="home-room-header">
            <h3 className="home-room-title">Phòng đang chờ</h3>
            <button
              type="button"
              className="btn btn-secondary home-refresh-btn"
              onClick={() => socket.refreshRoomList()}
              disabled={!connected}
            >
              ↻ Làm mới
            </button>
          </div>

          <div className="home-room-filters">
            {(['all', 'free', 'fair', 'battle'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`home-room-filter ${modeFilter === f ? 'active' : ''} ${f === 'battle' ? 'battle' : ''}`}
                onClick={() => setModeFilter(f)}
              >
                {f === 'all' ? 'Tất cả' : f === 'free' ? '🎮 Free' : f === 'fair' ? '⚖️ Fair' : '⚔️ Battle'}
              </button>
            ))}
          </div>

          {connected && (
            <p className="home-server-hint">
              Server: <code>{window.location.origin}</code>
              {' · '}
              Máy khác phải mở <strong>cùng URL</strong> (không dùng localhost nếu không phải máy host).
            </p>
          )}

          {filteredRooms.length === 0 ? (
            <p className="home-room-empty">
              {connected
                ? (availableRooms.length === 0
                  ? 'Chưa có phòng trống. Tạo phòng mới hoặc chờ người khác.'
                  : 'Không có phòng nào khớp bộ lọc.')
                : 'Đang kết nối server...'}
            </p>
          ) : (
            <ul className="home-room-list">
              {filteredRooms.map((room) => {
                const fair = room.fairMode ?? DEFAULT_FAIR_MODE;
                const setupMode = getRoomSetupMode(fair);
                const slotsLeft = room.maxPlayers - room.playerCount;
                return (
                  <li key={room.roomId} className="home-room-card">
                    <button
                      type="button"
                      className="home-room-card-main"
                      onClick={() => handleJoin(room.roomId)}
                      disabled={slotsLeft <= 0}
                    >
                      <div className="home-room-info">
                        <span className="home-room-id">{formatJoinCode(room.roomId)}</span>
                        <span className={`home-room-mode ${setupMode}`}>
                          {roomModeLabel(fair)}
                        </span>
                        <span className="home-room-meta">
                          Host: {room.hostName} · {room.playerCount}/{room.maxPlayers} người
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary home-room-join"
                      onClick={() => handleJoin(room.roomId)}
                      disabled={slotsLeft <= 0}
                      title={slotsLeft <= 0 ? 'Phòng đầy' : 'Vào phòng'}
                    >
                      Vào ({slotsLeft} slot)
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
