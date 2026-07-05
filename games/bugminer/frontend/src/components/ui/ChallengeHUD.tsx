import { getLevelById } from '../../shared';
import type { ChallengeState, GamePhase } from '../../shared';

interface Props {
  label: string;
  challenge: ChallengeState;
  phase: GamePhase;
  compact?: boolean;
  classic?: boolean;
}

export default function ChallengeHUD({ label, challenge, phase, compact, classic }: Props) {
  const level = getLevelById(challenge.levelId);
  const mins = Math.floor(challenge.timeRemaining / 60);
  const secs = challenge.timeRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isLowTime = challenge.timeRemaining <= 15 && phase === 'playing';

  return (
    <div className={`challenge-hud ${compact ? 'challenge-hud-compact' : ''} ${classic ? 'challenge-hud-classic' : ''}`}>
      <span className={classic ? 'classic-label' : ''} style={classic ? undefined : { fontWeight: 700, color: 'var(--gold)' }}>{label}</span>
      <span className={classic ? 'classic-level' : ''} style={classic ? undefined : { color: 'var(--text-dim)' }}>{level.name}</span>
      {(phase === 'playing' || phase === 'paused' || phase === 'countdown') && (
        <>
          <span
            className={classic ? `classic-time ${isLowTime ? 'danger' : ''}` : (isLowTime ? 'danger' : '')}
            style={classic ? undefined : { color: isLowTime ? 'var(--danger)' : 'var(--text)' }}
          >
            ⏱ {timeStr}
          </span>
          <span
            className={classic ? 'classic-score' : ''}
            style={classic ? undefined : { color: challenge.score >= challenge.targetScore ? 'var(--success)' : 'var(--gold)' }}
          >
            {challenge.score} / {challenge.targetScore}
          </span>
        </>
      )}
      {phase === 'dual_setup' && (
        <span className={classic ? 'classic-meta' : ''} style={classic ? undefined : { color: 'var(--text-dim)' }}>
          Target: {challenge.targetScore}
        </span>
      )}
      {challenge.setupLocked && phase === 'dual_setup' && (
        <span style={{ color: classic ? '#1b8a2e' : 'var(--success)' }}>✓ Locked</span>
      )}
    </div>
  );
}
