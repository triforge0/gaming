import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import BattleMineScene from '../components/game/BattleMineScene';
import BattleHUD from '../components/ui/BattleHUD';
import CountdownOverlay from '../components/ui/CountdownOverlay';
import PauseOverlay from '../components/ui/PauseOverlay';
import ScorePopups from '../components/ui/ScorePopups';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function BattleGameScreen({ socket }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);
  const isPaused = useGameStore((s) => s.isPaused);
  const poisonFlash = useGameStore((s) => s.poisonFlash);

  const handleFire = useCallback(() => {
    if (gameState?.phase === 'playing') {
      socket.fireHook();
    }
  }, [gameState?.phase, socket]);

  const handleThrowBomb = useCallback(() => {
    if (gameState?.phase === 'playing') {
      socket.throwBomb();
    }
  }, [gameState?.phase, socket]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleFire();
      }
      if (e.code === 'KeyB') {
        e.preventDefault();
        handleThrowBomb();
      }
      if (e.code === 'KeyP') {
        const paused = !useGameStore.getState().isPaused;
        useGameStore.getState().setPaused(paused);
        socket.pause(paused);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleFire, handleThrowBomb, socket]);

  if (!gameState || !playerId || !gameState.battle) {
    return (
      <div className="screen">
        <p style={{ color: 'var(--text-dim)' }}>Loading battle...</p>
      </div>
    );
  }

  const battle = gameState.battle;
  const playerA = gameState.players.find((p) => p.id === battle.playerAId);
  const playerB = gameState.players.find((p) => p.id === battle.playerBId);
  const isPlaying = gameState.phase === 'playing';

  return (
    <div className="game-layout game-screen battle-screen">
      <header className="game-top-bar">
        <span className="game-top-title">Bug Miner — ⚔️ Battle Mode</span>
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

      <BattleHUD
        battle={battle}
        playerAName={playerA?.name ?? 'P1'}
        playerBName={playerB?.name ?? 'P2'}
        myPlayerId={playerId}
        phase={gameState.phase}
      />

      <div
        className={`battle-canvas-wrap ${isPlaying ? 'canvas-interactive' : ''}`}
        onClick={isPlaying ? handleFire : undefined}
        onKeyDown={undefined}
        role="presentation"
      >
        <div className="canvas-container">
          <BattleMineScene battle={battle} phase={gameState.phase} />
          <ScorePopups />
          {gameState.phase === 'countdown' && (
            <CountdownOverlay count={gameState.countdown} />
          )}
          {poisonFlash && (
            <div className="poison-flash">
              <span>🪤 BẪY CHUỘT!</span>
            </div>
          )}
        </div>
        {isPlaying && (
          <p className="dual-panel-hint">Click / Space — móc · B — ném bom sang đối thủ</p>
        )}
      </div>

      {isPlaying && (
        <button type="button" className="battle-bomb-btn" onClick={handleThrowBomb}>
          💣 Ném bom (B)
        </button>
      )}

      {isPaused && gameState.phase === 'paused' && (
        <PauseOverlay onResume={() => {
          useGameStore.getState().setPaused(false);
          socket.pause(false);
        }} />
      )}
    </div>
  );
}
