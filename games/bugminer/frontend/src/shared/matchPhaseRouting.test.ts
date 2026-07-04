import { describe, it, expect } from 'vitest';
import {
  mergePlayingPhaseUpdate,
  shouldInterruptForLobbyPhase,
} from './boardStateSync';

describe('shouldInterruptForLobbyPhase', () => {
  it('does not interrupt during playing', () => {
    expect(shouldInterruptForLobbyPhase('lobby', 'playing')).toBe(false);
    expect(shouldInterruptForLobbyPhase('countdown', 'playing')).toBe(false);
  });

  it('does not interrupt during dual_setup', () => {
    expect(shouldInterruptForLobbyPhase('lobby', 'dual_setup')).toBe(false);
  });

  it('does not interrupt during paused or client countdown', () => {
    expect(shouldInterruptForLobbyPhase('lobby', 'paused')).toBe(false);
    expect(shouldInterruptForLobbyPhase('countdown', 'countdown')).toBe(false);
  });

  it('interrupts when idle in lobby', () => {
    expect(shouldInterruptForLobbyPhase('lobby', 'lobby')).toBe(true);
    expect(shouldInterruptForLobbyPhase('countdown', undefined)).toBe(true);
  });

  it('ignores playing wire phase', () => {
    expect(shouldInterruptForLobbyPhase('playing', 'lobby')).toBe(false);
  });
});

describe('mergePlayingPhaseUpdate', () => {
  it('clears stale winner when match starts', () => {
    const next = mergePlayingPhaseUpdate({
      phase: 'lobby',
      winnerId: '1',
      endReason: 'target',
    });
    expect(next.phase).toBe('countdown');
    expect(next.winnerId).toBeNull();
    expect(next.endReason).toBeNull();
  });

  it('preserves in-round phase while clearing outcome', () => {
    const next = mergePlayingPhaseUpdate({
      phase: 'dual_setup',
      winnerId: '2',
      endReason: 'timeout',
    });
    expect(next.phase).toBe('dual_setup');
    expect(next.winnerId).toBeNull();
  });
});
