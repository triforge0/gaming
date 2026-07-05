import { useEffect, useState } from 'react';
import {
  formatJoinCode,
  formatTrackLabel,
  type RoomSummary,
} from '../shared';
import { apiBaseUrl } from '@triforge/shared-ui';
import { useF1Store } from '../store/f1Store';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function JoinRoomScreen({ socket }: Props) {
  const playerName = useF1Store((s) => s.playerName);
  const availableRooms = useF1Store((s) => s.availableRooms);
  const lanHosts = useF1Store((s) => s.lanHosts);
  const connected = useF1Store((s) => s.connected);
  const [name, setName] = useState(playerName);
  const [roomCode, setRoomCode] = useState('');
  const [selectedHost, setSelectedHost] = useState('local');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) setRoomCode(room);
  }, []);

  const join = (targetRoomId?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      useF1Store.getState().setError('Nhập tên tay đua trước.');
      return;
    }
    const code = (targetRoomId ?? roomCode).trim();
    if (!code) return;

    if (selectedHost === 'local') {
      socket.joinRoom(code, trimmedName);
      return;
    }
    const [hostIp, portRaw] = selectedHost.split(':');
    socket.joinRoom(code, trimmedName, { hostIp, port: Number(portRaw) || 8080 });
  };

  const refresh = () => {
    if (selectedHost === 'local') {
      socket.refreshRooms();
      return;
    }
    const [hostIp, portRaw] = selectedHost.split(':');
    socket.refreshRooms(hostIp, Number(portRaw) || 8080);
  };

  return (
    <div className="screen join-screen">
      <div className="panel wide">
        <div className="panel-header">
          <h2>Vào phòng</h2>
          <button type="button" className="btn small" onClick={() => useF1Store.getState().setScreen('menu')}>
            ← Menu
          </button>
        </div>

        <label className="field-label" htmlFor="join-name">Tên tay đua</label>
        <input
          id="join-name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label className="field-label" htmlFor="join-code">Mã phòng (vd. city-loop:FAST-DEV-42)</label>
        <div className="row">
          <input
            id="join-code"
            className="input"
            value={roomCode}
            placeholder="city-loop:FAST-DEV-42"
            onChange={(event) => setRoomCode(event.target.value)}
          />
          <button type="button" className="btn primary" onClick={() => join()}>Vào</button>
        </div>

        <label className="field-label" htmlFor="host-select">Máy chủ LAN</label>
        <select
          id="host-select"
          className="input"
          value={selectedHost}
          onChange={(event) => setSelectedHost(event.target.value)}
        >
          <option value="local">Cùng host ({apiBaseUrl()})</option>
          {lanHosts.map((host) => (
            <option key={`${host.hostIp}:${host.port}`} value={`${host.hostIp}:${host.port}`}>
              {host.hostIp}:{host.port}
            </option>
          ))}
        </select>

        <div className="room-list-header">
          <h3>Phòng F1 đang mở</h3>
          <button type="button" className="btn small" onClick={refresh} disabled={!connected}>
            Làm mới
          </button>
        </div>

        {availableRooms.length === 0 ? (
          <p className="hint">
            {connected ? 'Chưa có phòng F1. Tạo phòng mới từ menu chính.' : 'Đang kết nối...'}
          </p>
        ) : (
          <ul className="room-list">
            {availableRooms.map((room: RoomSummary) => {
              const slotsLeft = room.maxPlayers - room.playerCount;
              return (
                <li key={room.roomId} className="room-card">
                  <div>
                    <strong>{formatJoinCode(room.roomId)}</strong>
                    <span>{formatTrackLabel(room.roomId) ?? room.trackId}</span>
                    <span className="muted">
                      Host: {room.hostName} · {room.playerCount}/{room.maxPlayers}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn primary small"
                    disabled={slotsLeft <= 0}
                    onClick={() => join(room.roomId)}
                  >
                    Vào
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
