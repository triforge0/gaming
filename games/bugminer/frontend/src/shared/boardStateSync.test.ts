import { describe, it, expect } from 'vitest';
import type { BattleArenaState } from './types';
import { resolveActiveWinner } from './boardStateSync';

const baseBattle = (): BattleArenaState => ({
  levelId: 'easy-mine',
  timeLimit: 90,
  timeRemaining: 90,
  targetScore: 800,
  items: [],
  playerAId: '1',
  playerBId: '2',
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
});

describe('resolveActiveWinner', () => {
  it('ignores stale board winner during active battle', () => {
    const result = resolveActiveWinner(baseBattle(), '1', 'target');
    expect(result.winnerId).toBeNull();
    expect(result.endReason).toBeNull();
  });

  it('uses arena winner when battle finished', () => {
    const battle = { ...baseBattle(), finished: true, winnerId: '2', endReason: 'target' as const };
    const result = resolveActiveWinner(battle, '1', 'timeout');
    expect(result.winnerId).toBe('2');
    expect(result.endReason).toBe('target');
  });

  it('falls back to board winner when battle finished without arena winner', () => {
    const battle = { ...baseBattle(), finished: true, winnerId: null, endReason: 'timeout' as const };
    const result = resolveActiveWinner(battle, '1', 'timeout');
    expect(result.winnerId).toBe('1');
    expect(result.endReason).toBe('timeout');
  });

  it('uses board winner for free/fair dual challenge mode', () => {
    const result = resolveActiveWinner(null, '1', 'target');
    expect(result.winnerId).toBe('1');
    expect(result.endReason).toBe('target');
  });

  it('returns null board winner when dual challenge still in progress', () => {
    const result = resolveActiveWinner(null, null, null);
    expect(result.winnerId).toBeNull();
    expect(result.endReason).toBeNull();
  });
});
