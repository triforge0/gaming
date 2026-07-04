import type { GameState, ChallengeState } from './types';

export type ChallengeSide = 'forPlayerA' | 'forPlayerB';

/** Map this player mines (designed by opponent). */
export function getChallengeForPlayer(state: GameState, playerId: string): ChallengeState | null {
  if (!state.challenges) return null;
  const { forPlayerA, forPlayerB } = state.challenges;
  if (forPlayerA.playerId === playerId) return forPlayerA;
  if (forPlayerB.playerId === playerId) return forPlayerB;
  return null;
}

/** Map this player designed for opponent. */
export function getChallengeDesignedBy(state: GameState, playerId: string): ChallengeState | null {
  if (!state.challenges) return null;
  const { forPlayerA, forPlayerB } = state.challenges;
  if (forPlayerA.designerId === playerId) return forPlayerA;
  if (forPlayerB.designerId === playerId) return forPlayerB;
  return null;
}

export function getPlayerIds(state: GameState): { playerA: string; playerB: string } | null {
  if (state.battle) {
    return { playerA: state.battle.playerAId, playerB: state.battle.playerBId };
  }
  if (!state.challenges) return null;
  if (state.players.length < 2) return null;
  const playerA = state.challenges.forPlayerA.playerId;
  const playerB = state.challenges.forPlayerB.playerId;
  return { playerA, playerB };
}

export function getChallengeSideForPlayer(playerId: string, playerAId: string): ChallengeSide {
  return playerId === playerAId ? 'forPlayerA' : 'forPlayerB';
}

export function getOpponentId(state: GameState, playerId: string): string | null {
  if (state.battle) {
    if (playerId === state.battle.playerAId) return state.battle.playerBId;
    if (playerId === state.battle.playerBId) return state.battle.playerAId;
  }
  const designed = getChallengeDesignedBy(state, playerId);
  if (!designed) return null;
  return designed.playerId;
}

export function getOpponentName(state: GameState, playerId: string): string {
  const oppId = getOpponentId(state, playerId);
  if (!oppId) return 'Đối thủ';
  return state.players.find((p) => p.id === oppId)?.name ?? 'Đối thủ';
}
