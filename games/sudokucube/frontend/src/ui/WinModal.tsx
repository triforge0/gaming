// src/ui/WinModal.tsx
import { ACHIEVEMENTS } from '../core/achievements';
import { SKINS } from '../skins';
import { useGame } from '../state/store';
import { fmtTime } from './format';

export function WinModal() {
  const summary = useGame((s) => s.winSummary);
  const newGame = useGame((s) => s.newGame);
  const backToMenu = useGame((s) => s.backToMenu);
  if (!summary) return null;

  return (
    <div className="overlay">
      <h1>🏆 HOÀN THÀNH!</h1>
      <p className="win-score">⭐ {summary.score.toLocaleString('vi-VN')} điểm</p>
      <p>
        🕐 {fmtTime(summary.elapsedMs)} · ❌ {summary.mistakes} lỗi · 💡 {summary.hintsUsed} hint
      </p>
      {summary.newAchievements.length > 0 && (
        <div className="win-badges">
          {summary.newAchievements.map((id) => {
            const a = ACHIEVEMENTS.find((x) => x.id === id)!;
            return <span key={id} className="badge-chip">{a.icon} {a.title}</span>;
          })}
        </div>
      )}
      {summary.newSkins.length > 0 && (
        <div className="win-badges">
          {summary.newSkins.map((id) => (
            <span key={id} className="badge-chip">{SKINS[id].icon} Skin mới: {SKINS[id].name}</span>
          ))}
        </div>
      )}
      <div className="difficulty-buttons">
        <button className="tool-btn" onClick={() => newGame(summary.difficulty)}>Chơi lại</button>
        <button className="tool-btn" onClick={backToMenu}>Về menu</button>
      </div>
    </div>
  );
}
