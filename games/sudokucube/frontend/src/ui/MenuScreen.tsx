// src/ui/MenuScreen.tsx
import { DIFFICULTIES, type Difficulty } from '../core/generator';
import { useGame } from '../state/store';

const LABELS: Record<Difficulty, string> = {
  easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert',
};

const ICONS: Record<Difficulty, string> = {
  easy: '🌱', medium: '⭐', hard: '🔥', expert: '💀',
};

export function MenuScreen() {
  const status = useGame((s) => s.status);
  const newGame = useGame((s) => s.newGame);
  if (status !== 'menu' && status !== 'generating') return null;

  return (
    <div className="overlay menu-screen">
      <h1>🧩 Mini Sudoku Cube</h1>
      <p style={{ color: '#94a3b8', marginBottom: 10 }}>Sudoku 4×4 trên 6 mặt cube — số trên cạnh chung phải khớp nhau.</p>
      {status === 'generating' ? (
        <p className="generating">Đang tạo cube…</p>
      ) : (
        <div className="difficulty-buttons">
          {DIFFICULTIES.map((d) => (
            <button key={d} className="menu-block-btn" onClick={() => newGame(d)}>
              <span style={{ fontSize: '24px' }}>{ICONS[d]}</span>
              <span>{LABELS[d]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
