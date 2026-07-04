import { getLevelById } from '../../shared';
import type { ChallengeState, GamePhase } from '../../shared';

interface Props {
  label: string;
  challenge: ChallengeState;
  phase: GamePhase;
  compact?: boolean;
}

export default function ChallengeHUD({ label, challenge, phase, compact }: Props) {
  const level = getLevelById(challenge.levelId);
  const mins = Math.floor(challenge.timeRemaining / 60);
  const secs = challenge.timeRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isLowTime = challenge.timeRemaining <= 15 && phase === 'playing';

  return (
    <div className={`challenge-hud ${compact ? 'challenge-hud-compact' : ''}`}>
      <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{label}</span>
      <span style={{ color: 'var(--text-dim)' }}>{level.name}</span>
      {(phase === 'playing' || phase === 'paused' || phase === 'countdown') && (
        <>
          <span className={isLowTime ? 'danger' : ''} style={{ color: isLowTime ? 'var(--danger)' : 'var(--text)' }}>
            ⏱ {timeStr}
          </span>
          <span style={{ color: challenge.score >= challenge.targetScore ? 'var(--success)' : 'var(--gold)' }}>
            {challenge.score} / {challenge.targetScore}
          </span>
        </>
      )}
      {phase === 'dual_setup' && (
        <span style={{ color: 'var(--text-dim)' }}>Target: {challenge.targetScore}</span>
      )}
      {challenge.setupLocked && phase === 'dual_setup' && (
        <span style={{ color: 'var(--success)' }}>✓ Locked</span>
      )}
    </div>
  );
}
