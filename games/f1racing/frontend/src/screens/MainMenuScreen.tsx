import { useState } from 'react';
import { DEFAULT_TRACK_ID, TRACKS } from '../shared';
import { useF1Store } from '../store/f1Store';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function MainMenuScreen({ socket }: Props) {
  const [name, setName] = useState(useF1Store.getState().playerName);
  const [trackId, setTrackId] = useState(DEFAULT_TRACK_ID);
  const connected = useF1Store((s) => s.connected);

  const startCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      useF1Store.getState().setError('Nhập tên tay đua trước.');
      return;
    }
    useF1Store.getState().setPlayer('', trimmed, '');
    socket.createRoom(trimmed, trackId);
  };

  return (
    <div className="screen menu-screen">
      <div className="hero">
        <p className="eyebrow">Triforge LAN</p>
        <h1>F1 RACING</h1>
        <p className="subtitle">Qualifying → Race · authoritative host · không cần cài client</p>
      </div>

      <div className="panel menu-panel">
        <label className="field-label" htmlFor="driver-name">Tên tay đua</label>
        <input
          id="driver-name"
          className="input"
          placeholder="Tên của bạn..."
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
        />

        <label className="field-label" htmlFor="track-select">Track mặc định (tạo phòng)</label>
        <select
          id="track-select"
          className="input"
          value={trackId}
          onChange={(event) => setTrackId(event.target.value)}
        >
          {TRACKS.map((track) => (
            <option key={track.id} value={track.id}>{track.name}</option>
          ))}
        </select>

        <button type="button" className="btn primary" onClick={startCreate}>
          Tạo phòng
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            useF1Store.getState().setPlayer('', name.trim(), '');
            useF1Store.getState().setScreen('join');
          }}
        >
          Vào phòng
        </button>
        <button type="button" className="btn" onClick={() => useF1Store.getState().setScreen('replay')}>
          Replay
        </button>
        <button type="button" className="btn" onClick={() => useF1Store.getState().setScreen('garage')}>
          Garage
        </button>
        <button type="button" className="btn" onClick={() => useF1Store.getState().setScreen('settings')}>
          Cài đặt
        </button>
        <button type="button" className="btn" onClick={() => useF1Store.getState().setScreen('singleplayer')}>
          Single Player
        </button>
        <a className="btn link" href="/">Về launcher</a>

        <p className="hint">
          {connected ? `Server: ${window.location.origin}` : 'Đang kết nối lobby API...'}
        </p>
      </div>
    </div>
  );
}
