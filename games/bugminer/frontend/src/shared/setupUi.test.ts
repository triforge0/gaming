import { describe, it, expect } from 'vitest';
import type { ChallengeState } from './types';
import { getSetupUiState } from './setupUi';

function makeChallenge(overrides: Partial<ChallengeState> = {}): ChallengeState {
  return {
    designerId: 'designer',
    playerId: 'player',
    levelId: 'easy-mine',
    timeLimit: 90,
    timeRemaining: 90,
    targetScore: 800,
    score: 0,
    items: [
      { id: 'i1', type: 'gold', position: { x: 10, y: 20 }, collected: false },
      { id: 'i2', type: 'rock', position: { x: 0, y: 0 }, collected: false },
    ],
    hook: { angle: 0, length: 40, state: 'swinging', attachedItemId: null, swingDirection: 1 },
    setupLocked: false,
    endReason: null,
    finished: false,
    strengthBuffRemaining: 0,
    ...overrides,
  };
}

describe('getSetupUiState', () => {
  it('allows edit and lock when items remain unplaced', () => {
    const ui = getSetupUiState(makeChallenge(), makeChallenge({ setupLocked: false }));
    expect(ui.canEdit).toBe(true);
    expect(ui.canLock).toBe(false);
    expect(ui.unplacedCount).toBe(1);
    expect(ui.waitingForOpponent).toBe(false);
  });

  it('shows waiting banner when locked but opponent has not', () => {
    const mine = makeChallenge({ setupLocked: true, items: [] });
    const opp = makeChallenge({ setupLocked: false });
    const ui = getSetupUiState(mine, opp);
    expect(ui.canEdit).toBe(false);
    expect(ui.waitingForOpponent).toBe(true);
    expect(ui.myLocked).toBe(true);
    expect(ui.oppLocked).toBe(false);
  });

  it('allows lock when all items placed', () => {
    const mine = makeChallenge({
      items: [{ id: 'i1', type: 'gold', position: { x: 1, y: 2 }, collected: false }],
    });
    const ui = getSetupUiState(mine, makeChallenge());
    expect(ui.canLock).toBe(true);
    expect(ui.allPlaced).toBe(true);
  });
});
