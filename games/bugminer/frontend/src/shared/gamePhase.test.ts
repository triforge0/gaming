import { describe, it, expect } from 'vitest';
import { DEFAULT_FAIR_MODE } from './fairMode';
import { resolveGamePhase } from './gamePhase';

describe('resolveGamePhase', () => {
  const locked = { setupLocked: true, finished: false };
  const unlocked = { setupLocked: false, finished: false };
  const finished = { setupLocked: true, finished: true };

  it('free mode uses dual_setup until both lock', () => {
    expect(resolveGamePhase(DEFAULT_FAIR_MODE, null, unlocked, locked)).toBe('dual_setup');
    expect(resolveGamePhase(DEFAULT_FAIR_MODE, null, locked, locked)).toBe('playing');
  });

  it('fair mode skips dual_setup when both maps are pre-locked', () => {
    const fair = { ...DEFAULT_FAIR_MODE, enabled: true };
    expect(resolveGamePhase(fair, null, locked, locked)).toBe('playing');
    expect(resolveGamePhase(fair, null, unlocked, locked)).toBe('dual_setup');
  });

  it('fair mode finishes when both challenges end', () => {
    const fair = { ...DEFAULT_FAIR_MODE, enabled: true };
    expect(resolveGamePhase(fair, null, finished, finished)).toBe('finished');
  });

  it('battle mode uses shared arena state', () => {
    const battleMode = { ...DEFAULT_FAIR_MODE, enabled: true, battle: true };
    const battle = {
      levelId: 'easy-mine',
      timeLimit: 90,
      timeRemaining: 90,
      targetScore: 800,
      items: [],
      playerAId: '1',
      playerBId: '2',
      hookA: { angle: 0, length: 0, state: 'swinging' as const, attachedItemId: null, swingDirection: 1 as const },
      hookB: { angle: 0, length: 0, state: 'swinging' as const, attachedItemId: null, swingDirection: 1 as const },
      scoreA: 0,
      scoreB: 0,
      finished: false,
      winnerId: null,
      endReason: null,
      strengthBuffA: 0,
      strengthBuffB: 0,
    };
    expect(resolveGamePhase(battleMode, battle, null, null)).toBe('playing');
    expect(resolveGamePhase(battleMode, { ...battle, finished: true }, null, null)).toBe('finished');
  });
});
