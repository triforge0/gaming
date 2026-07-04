import { useState } from 'react';
import { getLevelById, LEVELS } from '../shared';
import { useGameStore } from '../store/gameStore';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function HomeScreen({ socket }: Props) {
  const [name, setName] = useState(() => localStorage.getItem('triforge.sudokucube.v1') || '');
  
  // Read initial room ID from URL param if available
  const initialRoomId = new URLSearchParams(window.location.search).get('room') || '';
  const [roomId, setRoomId] = useState(initialRoomId);
  
  const [levelId, setLevelId] = useState('easy-mine');
  const availableRooms = useGameStore((s) => s.availableRooms);
  const connected = useGameStore((s) => s.connected);

  const handleCreate = () => {
    if (!name.trim()) return;
    localStorage.setItem('triforge.sudokucube.v1', name.trim());
    useGameStore.setState({ playerName: name.trim() });
    socket.createRoom(name.trim(), levelId);
  };

  const handleJoin = (targetRoomId?: string) => {
    const id = (targetRoomId ?? roomId).trim().toUpperCase();
    if (!name.trim() || !id) return;
    localStorage.setItem('triforge.sudokucube.v1', name.trim());
    useGameStore.setState({ playerName: name.trim() });
    socket.joinRoom(id, name.trim());
  };

  const handleAutoJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem('triforge.sudokucube.v1', name.trim());
    useGameStore.setState({ playerName: name.trim() });
    const openRoom = availableRooms.find(r => r.playerCount < r.maxPlayers);
    if (openRoom) {
      socket.joinRoom(openRoom.roomId, name.trim());
    } else {
      socket.createRoom(name.trim(), levelId);
    }
  };

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

          <button type="button" className="btn btn-primary" onClick={handleCreate} style={{ width: '100%', marginBottom: '8px' }}>
            Tạo phòng mới
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={handleAutoJoin} style={{ width: '100%' }}>
            Chơi ngay (Auto Join)
          </button>

          <div className="home-join-row" style={{ marginTop: '16px' }}>
            <input
              className="input-field"
              placeholder="Room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
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

          {availableRooms.length === 0 ? (
            <p className="home-room-empty">
              {connected ? 'Chưa có phòng trống. Tạo phòng mới hoặc chờ người khác.' : 'Đang kết nối server...'}
            </p>
          ) : (
            <ul className="home-room-list">
              {availableRooms.map((room) => {
                const level = getLevelById(room.levelId);
                const slotsLeft = room.maxPlayers - room.playerCount;
                return (
                  <li key={room.roomId} className="home-room-card">
                    <div className="home-room-info">
                      <span className="home-room-id">{room.roomId}</span>
                      <span className="home-room-meta">{level.name}</span>
                      <span className="home-room-meta">
                        Host: {room.hostName} · {room.playerCount}/{room.maxPlayers} người
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary home-room-join"
                      onClick={() => handleJoin(room.roomId)}
                      disabled={!name.trim() || slotsLeft <= 0}
                      title={!name.trim() ? 'Nhập tên trước' : 'Vào phòng'}
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
