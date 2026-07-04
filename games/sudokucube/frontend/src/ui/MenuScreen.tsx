// src/ui/MenuScreen.tsx
import { DIFFICULTIES, type Difficulty } from '../core/generator';
import { useGame } from '../state/store';

const LABELS: Record<Difficulty, string> = {
  easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert',
};

export function MenuScreen() {
  const status = useGame((s) => s.status);
  const newGame = useGame((s) => s.newGame);
  if (status !== 'menu' && status !== 'generating') return null;

  return (
    <div className="overlay menu-screen">
      <h1>🧩 Mini Sudoku Cube</h1>
      <p>Sudoku 4×4 trên 6 mặt cube — số trên cạnh chung phải khớp nhau.</p>
      {status === 'generating' ? (
        <p className="generating">Đang tạo cube…</p>
      ) : (
        <div className="difficulty-buttons">
          {DIFFICULTIES.map((d) => (
            <button key={d} className="tool-btn" onClick={() => newGame(d)}>{LABELS[d]}</button>
          ))}
        </div>
      )}
    </div>
  );
}
