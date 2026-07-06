import type { BattleArenaState, EndReason, GamePhase } from './types';

export interface ActiveWinnerResult {
  winnerId: string | null;
  endReason: EndReason;
}

/** Mirrors useSocket board winner resolution — ignores stale winner during active battle. */
export function resolveActiveWinner(
  battle: BattleArenaState | null,
  boardWinnerId: string | null,
  boardEndReason: EndReason,
): ActiveWinnerResult {
  if (battle != null) {
    if (!battle.finished) {
      return { winnerId: null, endReason: null };
    }
    return {
      winnerId: battle.winnerId ?? boardWinnerId,
      endReason: battle.endReason ?? boardEndReason,
    };
  }
  return {
    winnerId: boardWinnerId,
    endReason: boardEndReason,
  };
}

export type WireMatchPhase = 'lobby' | 'countdown' | 'playing' | 'ended';

/** True when a LOBBY/COUNTDOWN wire update should force the lobby screen. */
export function shouldInterruptForLobbyPhase(
  updatePhase: WireMatchPhase,
  currentGamePhase: GamePhase | undefined,
): boolean {
  if (updatePhase !== 'lobby' && updatePhase !== 'countdown') {
    return false;
  }
  const inActiveRound = currentGamePhase === 'playing'
    || currentGamePhase === 'countdown'
    || currentGamePhase === 'paused'
    || currentGamePhase === 'dual_setup';
  return !inActiveRound;
}

/** Clears stale outcome when server announces PLAYING with existing client state. */
export function mergePlayingPhaseUpdate<T extends { phase: GamePhase; winnerId: string | null; endReason: EndReason }>(
  gameState: T,
): T {
  return {
    ...gameState,
    phase: gameState.phase === 'lobby' ? 'countdown' : gameState.phase,
    winnerId: null,
    endReason: null,
  };
}
