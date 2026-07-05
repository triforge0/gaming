import { useState } from 'react';
import {
  DEFAULT_TRACK_ID,
  SINGLE_PLAYER_MODES,
  TRACKS,
  type SinglePlayerMode,
} from '../shared';
import { useF1Store } from '../store/f1Store';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function SinglePlayerScreen({ socket }: Props) {
  const playerName = useF1Store((state) => state.playerName);
  const [name, setName] = useState(playerName);
  const [trackId, setTrackId] = useState(DEFAULT_TRACK_ID);

  const launch = (mode: SinglePlayerMode) => {
    const trimmed = name.trim();
    if (!trimmed) {
      useF1Store.getState().setError('Nhập tên tay đua trước.');
      return;
    }
    useF1Store.getState().setPlayer('', trimmed, '');
    socket.startSinglePlayer(mode, trackId, trimmed);
  };

  return (
    <div className="screen singleplayer-screen">
      <div className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Single Player</p>
            <h2>Chọn chế độ</h2>
          </div>
          <button
            type="button"
            className="btn small"
            onClick={() => useF1Store.getState().setScreen('menu')}
          >
            ← Menu
          </button>
        </div>

        <label className="field-label" htmlFor="sp-driver-name">Tên tay đua</label>
        <input
          id="sp-driver-name"
          className="input"
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
        />

        <label className="field-label" htmlFor="sp-track-select">Track</label>
        <select
          id="sp-track-select"
          className="input"
          value={trackId}
          onChange={(event) => setTrackId(event.target.value)}
        >
          {TRACKS.map((track) => (
            <option key={track.id} value={track.id}>{track.name}</option>
          ))}
        </select>

        <div className="car-grid">
          {SINGLE_PLAYER_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className="car-card solo-mode-card"
              onClick={() => launch(mode.id)}
            >
              <strong>{mode.title}</strong>
              <span className="muted">{mode.description}</span>
            </button>
          ))}
        </div>

        <p className="hint">Phòng solo tự tạo và auto-start — không cần lobby thứ hai.</p>
      </div>
    </div>
  );
}
