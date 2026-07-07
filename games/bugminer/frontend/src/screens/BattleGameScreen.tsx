import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { BOMB_COST } from '../shared';
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
  const bombFlash = useGameStore((s) => s.bombFlash);

  const handleFire = useCallback(() => {
    if (gameState?.phase === 'playing') {
      socket.fireHook();
    }
  }, [gameState?.phase, socket]);

  const handleThrowBomb = useCallback(() => {
    if (gameState?.phase !== 'playing' || !gameState.battle || !playerId) return;
    const battle = gameState.battle;
    const myScore = playerId === battle.playerAId ? battle.scoreA : battle.scoreB;
    const cd = playerId === battle.playerAId ? battle.bombCooldownA : battle.bombCooldownB;
    if (myScore < BOMB_COST) {
      useGameStore.getState().setError(`Cần ít nhất ${BOMB_COST} điểm để ném dép tổ ong!`);
      setTimeout(() => useGameStore.getState().setError(null), 1500);
      return;
    }
    if (cd > 0) return;
    socket.throwBomb();
  }, [gameState?.phase, gameState?.battle, playerId, socket]);

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
  const myScore = playerId === battle.playerAId ? battle.scoreA : battle.scoreB;
  const canThrowBomb = isPlaying && myScore >= BOMB_COST
    && (playerId === battle.playerAId ? battle.bombCooldownA : battle.bombCooldownB) === 0;

  return (
    <div className={`game-layout game-screen battle-screen ${bombFlash ? 'bomb-flash' : ''}`}>
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
          {bombFlash && (
            <div className="bomb-hit-flash">
              <span>🩴 TRÚNG DÉP!</span>
            </div>
          )}
        </div>
        {isPlaying && (
          <p className="dual-panel-hint">Click / Space — móc · B — ném dép tổ ong (-{BOMB_COST} điểm)</p>
        )}
      </div>

      {isPlaying && (
        <button
          type="button"
          className={`battle-bomb-btn ${canThrowBomb ? '' : 'disabled'}`}
          onClick={handleThrowBomb}
          disabled={!canThrowBomb}
        >
          🩴 Ném dép tổ ong (-{BOMB_COST})
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
