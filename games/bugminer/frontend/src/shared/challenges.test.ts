import { describe, it, expect } from 'vitest';
import type { ChallengeState, GameState } from './types';
import { getChallengeDesignedBy, getChallengeForPlayer, getOpponentId, getPlayerIds } from './challenges';

function makeChallenge(
  designerId: string,
  playerId: string,
  overrides: Partial<ChallengeState> = {},
): ChallengeState {
  return {
    designerId,
    playerId,
    levelId: 'easy-mine',
    timeLimit: 90,
    timeRemaining: 90,
    targetScore: 800,
    score: 0,
    items: [],
    hook: { angle: 0, length: 40, state: 'swinging', attachedItemId: null, swingDirection: 1 },
    setupLocked: false,
    endReason: null,
    finished: false,
    strengthBuffRemaining: 0,
    ...overrides,
  };
}

describe('challenge helpers — designerId based lookup', () => {
  const playerA = 'socket-host';
  const playerB = 'socket-guest';

  const baseState: GameState = {
    roomId: 'R1',
    phase: 'dual_setup',
    hostId: playerA,
    players: [
      { id: playerA, name: 'Host', role: null, ready: true },
      { id: playerB, name: 'Guest', role: null, ready: true },
    ],
    challenges: {
      forPlayerA: makeChallenge(playerB, playerA, { setupLocked: false }),
      forPlayerB: makeChallenge(playerA, playerB, { setupLocked: true }),
    },
    winnerId: null,
    endReason: null,
    countdown: 0,
    battle: null,
    fairMode: { enabled: false, battle: false, levelId: 'easy-mine', timeLimit: 90 },
  };

  it('returns correct design map regardless of players array order', () => {
    const reversed: GameState = {
      ...baseState,
      players: [...baseState.players].reverse(),
    };

    expect(getChallengeDesignedBy(baseState, playerB)?.designerId).toBe(playerB);
    expect(getChallengeDesignedBy(reversed, playerB)?.designerId).toBe(playerB);
    expect(getChallengeDesignedBy(baseState, playerB)?.setupLocked).toBe(false);
    expect(getChallengeDesignedBy(reversed, playerB)?.setupLocked).toBe(false);
  });

  it('player B design is forPlayerA, player A design is forPlayerB', () => {
    expect(getChallengeDesignedBy(baseState, playerA)?.playerId).toBe(playerB);
    expect(getChallengeDesignedBy(baseState, playerB)?.playerId).toBe(playerA);
    expect(getChallengeForPlayer(baseState, playerA)?.designerId).toBe(playerB);
    expect(getChallengeForPlayer(baseState, playerB)?.designerId).toBe(playerA);
  });

  it('returns null when challenges undefined (battle mode)', () => {
    const battleState: GameState = {
      ...baseState,
      phase: 'countdown',
      challenges: undefined,
      fairMode: { enabled: true, battle: true, levelId: 'easy-mine', timeLimit: 90 },
      battle: {
        levelId: 'easy-mine',
        timeLimit: 90,
        timeRemaining: 90,
        targetScore: 800,
        items: [],
        playerAId: playerA,
        playerBId: playerB,
        hookA: { angle: 0, length: 0, state: 'swinging', attachedItemId: null, swingDirection: 1 },
        hookB: { angle: 0, length: 0, state: 'swinging', attachedItemId: null, swingDirection: 1 },
        scoreA: 0,
        scoreB: 0,
        finished: false,
        winnerId: null,
        endReason: null,
        strengthBuffA: 0,
        strengthBuffB: 0,
        bombCooldownA: 0,
        bombCooldownB: 0,
        bombs: [],
      },
    };

    expect(getChallengeForPlayer(battleState, playerA)).toBeNull();
    expect(getChallengeDesignedBy(battleState, playerA)).toBeNull();
    expect(getPlayerIds(battleState)).toEqual({ playerA, playerB });
    expect(getOpponentId(battleState, playerA)).toBe(playerB);
  });
});
