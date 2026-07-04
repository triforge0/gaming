import { useGame } from '../state/store';

export function PauseOverlay() {
  const status = useGame((s) => s.status);
  const togglePause = useGame((s) => s.togglePause);
  if (status !== 'paused') return null;
  return (
    <div className="overlay">
      <h2>⏸ Tạm dừng</h2>
      <button className="tool-btn" onClick={togglePause}>Chơi tiếp (Space)</button>
    </div>
  );
}
