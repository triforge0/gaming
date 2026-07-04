import type { BattleArenaState } from '../shared';
import { getLevelById } from '../shared';

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
  const danger = battle.timeRemaining <= 15;

  return (
    <div className="battle-hud challenge-hud-classic">
      <div className="battle-hud-corner battle-hud-left">
        <span className="battle-hud-name">{myName} (You)</span>
        <span className="battle-hud-score">{myScore}</span>
        {myBuff > 0 && <span className="battle-hud-buff">💪 {myBuff}s</span>}
      </div>

      <div className="battle-hud-center">
        <span className="challenge-hud-goal">GOAL {level.targetScore}</span>
        <span className={`challenge-hud-timer ${danger ? 'danger' : ''}`}>
          {formatTime(battle.timeRemaining)}
        </span>
        <span className="battle-hud-mode">⚔️ BATTLE · {level.name}</span>
        {phase === 'playing' && (
          <span className="battle-hud-hint">Va chạm móc = mất lượt · Gắm vào vật đối thủ đang kéo = cướp</span>
        )}
      </div>

      <div className="battle-hud-corner battle-hud-right">
        <span className="battle-hud-name">{oppName}</span>
        <span className="battle-hud-score opp">{oppScore}</span>
      </div>
    </div>
  );
}
