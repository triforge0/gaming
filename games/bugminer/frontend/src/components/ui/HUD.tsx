import { getChallengeForPlayer, getLevelById } from '../../shared';
import { useGameStore } from '../../store/gameStore';

interface Props {
  onPause?: () => void;
}

export default function HUD({ onPause }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);

  if (!gameState || !playerId) return null;

  const challenge = getChallengeForPlayer(gameState, playerId);
  if (!challenge) return null;

  const level = getLevelById(challenge.levelId);
  const mins = Math.floor(challenge.timeRemaining / 60);
  const secs = challenge.timeRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isLowTime = challenge.timeRemaining <= 15 && gameState.phase === 'playing';

  const phaseLabel: Record<string, string> = {
    lobby: 'Lobby',
    dual_setup: 'Setup',
    countdown: 'Starting...',
    playing: 'Playing',
    paused: 'Paused',
    finished: 'Finished',
  };

  return (
    <div className="hud-bar">
      <div className="hud-stat">
        <span className="hud-label">Level</span>
        <span className="hud-value" style={{ fontSize: '1rem' }}>{level.name}</span>
      </div>

      <div className="hud-stat">
        <span className="hud-label">Phase</span>
        <span className="hud-value" style={{ fontSize: '1rem', color: 'var(--accent2)' }}>
          {phaseLabel[gameState.phase]}
        </span>
      </div>

      {(gameState.phase === 'playing' || gameState.phase === 'paused' || gameState.phase === 'countdown') && (
        <>
          <div className="hud-stat">
            <span className="hud-label">Time</span>
            <span className={`hud-value ${isLowTime ? 'danger' : ''}`}>{timeStr}</span>
          </div>

          <div className="hud-stat">
            <span className="hud-label">Score</span>
            <span className={`hud-value ${challenge.score >= challenge.targetScore ? 'success' : ''}`}>
              {challenge.score} / {challenge.targetScore}
            </span>
          </div>
        </>
      )}

      {gameState.phase === 'dual_setup' && (
        <div className="hud-stat">
          <span className="hud-label">Target</span>
          <span className="hud-value">{challenge.targetScore}</span>
        </div>
      )}

      {(gameState.phase === 'playing' || gameState.phase === 'paused') && onPause && (
        <button
          className="btn btn-secondary"
          onClick={onPause}
          style={{ padding: '8px 16px', fontSize: '0.85rem', marginLeft: 'auto' }}
        >
          Pause
        </button>
      )}
    </div>
  );
}
