import type { BattleArenaState } from '../../shared';
import { BOMB_COST, getLevelById } from '../../shared';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  battle: BattleArenaState;
  playerAName: string;
  playerBName: string;
  myPlayerId: string;
  phase: string;
}

export default function BattleHUD({
  battle,
  playerAName,
  playerBName,
  myPlayerId,
  phase,
}: Props) {
  const level = getLevelById(battle.levelId);
  const isA = myPlayerId === battle.playerAId;
  const myScore = isA ? battle.scoreA : battle.scoreB;
  const oppScore = isA ? battle.scoreB : battle.scoreA;
  const myName = isA ? playerAName : playerBName;
  const oppName = isA ? playerBName : playerAName;
  const myBuff = isA ? battle.strengthBuffA : battle.strengthBuffB;
  const myBombCd = isA ? battle.bombCooldownA : battle.bombCooldownB;
  const bombAffordable = myScore >= BOMB_COST;
  const danger = battle.timeRemaining <= 15;

  return (
    <div className="battle-hud challenge-hud-classic">
      <div className="battle-hud-corner battle-hud-left">
        <span className="battle-hud-name">{myName} (You)</span>
        <span className="battle-hud-score">{myScore}</span>
        {myBuff > 0 && <span className="battle-hud-buff">💪 {myBuff}s</span>}
        {phase === 'playing' && (
          <span className={`battle-hud-bomb ${myBombCd > 0 ? 'cooldown' : bombAffordable ? 'ready' : 'disabled'}`}>
            🩴 -{BOMB_COST} {myBombCd > 0 ? `${myBombCd}s` : bombAffordable ? '(B)' : ' thiếu điểm'}
          </span>
        )}
      </div>

      <div className="battle-hud-center">
        <span className="challenge-hud-goal">GOAL {level.targetScore}</span>
        <span className={`challenge-hud-timer ${danger ? 'danger' : ''}`}>
          {formatTime(battle.timeRemaining)}
        </span>
        <span className="battle-hud-mode">⚔️ BATTLE · {level.name}</span>
        {phase === 'playing' && (
          <span className="battle-hud-hint">Space: móc · B: ném dép tổ ong (-{BOMB_COST} điểm) · Trúng đối thủ: -100 điểm · Va chạm móc = mất lượt</span>
        )}
      </div>

      <div className="battle-hud-corner battle-hud-right">
        <span className="battle-hud-name">{oppName}</span>
        <span className="battle-hud-score opp">{oppScore}</span>
      </div>
    </div>
  );
}
