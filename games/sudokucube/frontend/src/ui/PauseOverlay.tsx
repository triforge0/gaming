import { useGame } from '../state/store';

export function PauseOverlay() {
  const status = useGame((s) => s.status);
  const togglePause = useGame((s) => s.togglePause);
  const newGame = useGame((s) => s.newGame);
  const backToMenu = useGame((s) => s.backToMenu);
  const diff = useGame((s) => s.persisted.currentGame?.puzzle.difficulty);

  if (status !== 'paused') return null;
  return (
    <div className="overlay">
      <h2>⏸ Tạm dừng</h2>
      <div className="difficulty-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <button className="tool-btn" onClick={togglePause}>Chơi tiếp (Space)</button>
        <button className="tool-btn" onClick={() => diff && newGame(diff)}>Chơi lại ván mới</button>
        <button className="tool-btn" onClick={backToMenu} style={{ color: '#ef4444' }}>Thoát ra Menu</button>
      </div>
    </div>
  );
}
