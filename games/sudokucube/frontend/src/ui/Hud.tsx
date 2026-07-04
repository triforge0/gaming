// src/ui/Hud.tsx
import { DIFFICULTIES } from '../core/generator';
import { computeScore } from '../core/scoring';
import { useGame } from '../state/store';
import { fmtTime } from './format';

export function Hud({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const game = useGame((s) => s.persisted.currentGame);
  const status = useGame((s) => s.status);
  const fill = useGame((s) => s.fill);
  const hint = useGame((s) => s.hint);
  const undo = useGame((s) => s.undo);
  if (!game || (status !== 'playing' && status !== 'paused')) return null;

  const score = computeScore(game.puzzle.difficulty, game.elapsedMs, game.mistakes, 3 - game.hintsLeft);
  const diffIdx = DIFFICULTIES.indexOf(game.puzzle.difficulty);

  return (
    <>
      <header className="hud-top">
        <span>🧩 Mini Sudoku Cube</span>
        <span>
          ⭐ {score.toLocaleString('vi-VN')}
          <button onClick={onOpenDrawer} style={{ marginLeft: 10, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>🎨</button>
        </span>
      </header>
      <footer className="hud-bottom">
        <div className="numpad">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} className="num-btn" onClick={() => fill(n as 1|2|3|4)}>{n}</button>
          ))}
        </div>
        <div className="hud-tools">
          <button className="tool-btn" onClick={hint} disabled={game.hintsLeft <= 0}>
            💡 Hint ({game.hintsLeft})
          </button>
          <button className="tool-btn" onClick={undo}>↩️ Undo</button>
        </div>
        <div className="hud-meta">
          <span className="difficulty">
            {game.puzzle.difficulty}{' '}
            {DIFFICULTIES.map((_, i) => (i <= diffIdx ? '●' : '○')).join('')}
          </span>
          <span>🕐 {fmtTime(game.elapsedMs)}</span>
        </div>
      </footer>
    </>
  );
}
