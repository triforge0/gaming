import { useEffect, useCallback } from 'react';
import {
  getChallengeDesignedBy,
  getChallengeForPlayer,
  getOpponentName,
} from '../shared';
import { useGameStore } from '../store/gameStore';
import MineScene from '../components/game/MineScene';
import ChallengeHUD from '../components/ui/ChallengeHUD';
import CountdownOverlay from '../components/ui/CountdownOverlay';
import PauseOverlay from '../components/ui/PauseOverlay';
import ScorePopups from '../components/ui/ScorePopups';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function GameScreen({ socket }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);
  const isPaused = useGameStore((s) => s.isPaused);
  const poisonFlash = useGameStore((s) => s.poisonFlash);

  const handleFire = useCallback(() => {
    if (gameState?.phase === 'playing') {
      socket.fireHook();
    }
  }, [gameState?.phase, socket]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleFire();
      }
      if (e.code === 'KeyP') {
        const paused = !useGameStore.getState().isPaused;
        useGameStore.getState().setPaused(paused);
        socket.pause(paused);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleFire, socket]);

  if (!gameState || !playerId) {
    return (
      <div className="screen">
        <p style={{ color: 'var(--text-dim)' }}>Loading game...</p>
      </div>
    );
  }

  const myChallenge = getChallengeForPlayer(gameState, playerId);
  const oppChallenge = getChallengeDesignedBy(gameState, playerId);
  const opponentName = getOpponentName(gameState, playerId);

  if (!myChallenge || !oppChallenge) {
    return (
      <div className="screen">
        <p style={{ color: 'var(--text-dim)' }}>Đang tải map...</p>
      </div>
    );
  }

  const isPlaying = gameState.phase === 'playing';
  const isCountdown = gameState.phase === 'countdown';

  return (
    <div className="game-layout game-screen">
      <header className="game-top-bar">
        <span className="game-top-title">Bug Miner — Dual PvP</span>
        {isCountdown && (
          <span className="game-countdown-hint">
            Setup xong — map đối thủ sẽ hiện khi bắt đầu ({gameState.countdown}s)
          </span>
        )}
        {(gameState.phase === 'playing' || gameState.phase === 'paused') && (
          <button
            type="button"
            className="btn btn-secondary game-pause-btn"
            onClick={() => {
              const paused = !isPaused;
              useGameStore.getState().setPaused(paused);
              socket.pause(paused);
            }}
          >
            Pause
          </button>
        )}
      </header>

      <div className="dual-game-layout">
        <div
          className={`dual-panel ${isPlaying ? 'dual-panel-active' : ''}`}
          onClick={isPlaying ? handleFire : undefined}
          onKeyDown={undefined}
          role="presentation"
        >
          <ChallengeHUD label="Map của bạn" challenge={myChallenge} phase={gameState.phase} compact classic />
          <div className={`canvas-container ${isPlaying ? 'canvas-interactive' : ''}`}>
            <MineScene challenge={myChallenge} phase={gameState.phase} showItems={!isCountdown} />
            <ScorePopups />
            {isCountdown && (
              <CountdownOverlay
                count={gameState.countdown}
                subtitle="Map đối thủ đang ẩn — chuẩn bị!"
              />
            )}
            {poisonFlash && (
              <div className="poison-flash">
                <span>🪤 BẪY CHUỘT!</span>
              </div>
            )}
          </div>
          {isPlaying && (
            <p className="dual-panel-hint">Click / Space để thả móc</p>
          )}
        </div>

        <div className="dual-panel">
          <ChallengeHUD label={`Map ${opponentName}`} challenge={oppChallenge} phase={gameState.phase} compact classic />
          <div className="canvas-container">
            <MineScene challenge={oppChallenge} phase={gameState.phase} readOnly />
          </div>
          <p className="dual-panel-hint">Theo dõi đối thủ đào map bạn thiết kế</p>
        </div>
      </div>

      {isPaused && gameState.phase === 'paused' && (
        <PauseOverlay onResume={() => {
          useGameStore.getState().setPaused(false);
          socket.pause(false);
        }} />
      )}
    </div>
  );
}
