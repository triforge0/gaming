import {
  getChallengeDesignedBy,
  getChallengeForPlayer,
  getLevelById,
} from '../shared';
import { useGameStore } from '../store/gameStore';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function ResultScreen({ socket }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);

  if (!gameState || !playerId) return null;

  const battle = gameState.battle;
  const isBattle = Boolean(gameState.fairMode.battle && battle);

  const won = gameState.winnerId === playerId;
  const isDraw = gameState.winnerId === null;
  const myChallenge = !isBattle ? getChallengeForPlayer(gameState, playerId) : null;
  const oppChallenge = !isBattle ? getChallengeDesignedBy(gameState, playerId) : null;

  const myScore = isBattle
    ? (playerId === battle!.playerAId ? battle!.scoreA : battle!.scoreB)
    : myChallenge?.score ?? 0;
  const oppScore = isBattle
    ? (playerId === battle!.playerAId ? battle!.scoreB : battle!.scoreA)
    : oppChallenge?.score ?? 0;
  const targetScore = isBattle
    ? battle!.targetScore
    : myChallenge?.targetScore ?? 800;
  const levelName = isBattle
    ? getLevelById(battle!.levelId).name
    : getLevelById(myChallenge?.levelId ?? 'easy-mine').name;

  const reasonText = (() => {
    if (gameState.endReason === 'target') {
      return won ? 'Bạn đạt target trước!' : 'Đối thủ đạt target trước!';
    }
    if (gameState.endReason === 'poison') {
      return won ? 'Đối thủ dính bẫy chuột!' : '🪤 Bạn dính bẫy chuột!';
    }
    if (isDraw) return 'Hòa — cùng điểm khi hết giờ';
    return 'Hết thời gian — so điểm';
  })();

  return (
    <div className="screen" style={{
      background: won
        ? 'radial-gradient(ellipse at center, #1a3d1a 0%, #1a1208 70%)'
        : isDraw
          ? 'radial-gradient(ellipse at center, #2a2a1a 0%, #1a1208 70%)'
          : 'radial-gradient(ellipse at center, #3d1a1a 0%, #1a1208 70%)',
    }}>
      <div className="panel" style={{ width: 520, textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 8 }}>
          {won ? '🏆' : isDraw ? '🤝' : '😅'}
        </div>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 700, marginBottom: 8,
          color: won ? 'var(--success)' : isDraw ? 'var(--gold)' : 'var(--danger)',
        }}>
          {won ? 'YOU WIN!' : isDraw ? 'DRAW!' : 'YOU LOSE!'}
        </h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>{reasonText}</p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24,
        }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16 }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{isBattle ? 'BẠN' : 'MAP CỦA BẠN'}</p>
            {!isBattle && myChallenge && (
              <p style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>{levelName}</p>
            )}
            {isBattle && (
              <p style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>⚔️ {levelName}</p>
            )}
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{myScore}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/ {targetScore}</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16 }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{isBattle ? 'ĐỐI THỦ' : 'MAP ĐỐI THỦ'}</p>
            {!isBattle && oppChallenge && (
              <p style={{ fontSize: '0.85rem', color: 'var(--accent2)' }}>
                {getLevelById(oppChallenge.levelId).name}
              </p>
            )}
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent2)' }}>{oppScore}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/ {targetScore}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => socket.restart()}>
            Restart
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => {
              useGameStore.getState().reset();
              socket.leave();
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
