import { describe, it, expect, beforeEach } from 'vitest';
import type { GameState } from '../shared';
import { useGameStore } from './gameStore';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    roomId: 'ABC123',
    phase: 'lobby',
    hostId: 'host-1',
    players: [],
    challenges: {
      forPlayerA: {
        designerId: 'b',
        playerId: 'a',
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
      },
      forPlayerB: {
        designerId: 'a',
        playerId: 'b',
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
      },
    },
    winnerId: null,
    endReason: null,
    countdown: 0,
    fairMode: { enabled: false, battle: false, levelId: 'easy-mine', timeLimit: 90 },
    battle: null,
    ...overrides,
  };
}

describe('gameStore — Screen routing (UI Flow)', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('starts on home screen', () => {
    expect(useGameStore.getState().screen).toBe('home');
  });

  it('routes to setup on dual_setup phase', () => {
    useGameStore.setState({ screen: 'lobby' });
    useGameStore.getState().setGameState(makeState({ phase: 'dual_setup' }));
    expect(useGameStore.getState().screen).toBe('setup');
  });

  it('routes to game on playing phase', () => {
    useGameStore.setState({ screen: 'setup' });
    useGameStore.getState().setGameState(makeState({ phase: 'playing' }));
    expect(useGameStore.getState().screen).toBe('game');
  });

  it('routes to result on finished phase', () => {
    useGameStore.setState({ screen: 'game' });
    useGameStore.getState().setGameState(makeState({ phase: 'finished', winnerId: 'a' }));
    expect(useGameStore.getState().screen).toBe('result');
  });

  it('routes to lobby after join when player is in room', () => {
    useGameStore.setState({ screen: 'home', playerId: null, roomId: null });
    useGameStore.getState().setPlayer('guest-1', 'Guest', 'ABC123', null);
    useGameStore.getState().setGameState(makeState({ phase: 'lobby', roomId: 'ABC123' }));
    expect(useGameStore.getState().screen).toBe('lobby');
  });

  it('lobby phase without active room stays on home', () => {
    useGameStore.setState({ screen: 'home', playerId: null, roomId: null, gameState: null });
    useGameStore.getState().setGameState(makeState({ phase: 'lobby' }));
    expect(useGameStore.getState().screen).toBe('home');
  });

  it('reset returns to home and clears room state', () => {
    useGameStore.setState({ roomId: 'X', screen: 'lobby' });
    useGameStore.getState().reset();
    const s = useGameStore.getState();
    expect(s.screen).toBe('home');
    expect(s.roomId).toBeNull();
    expect(s.gameState).toBeNull();
  });
});

describe('gameStore — Screen routing (mode flows)', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('free mode routes dual_setup to setup screen', () => {
    useGameStore.setState({ screen: 'lobby', playerId: 'a', roomId: 'ABC123' });
    useGameStore.getState().setGameState(makeState({ phase: 'dual_setup' }));
    expect(useGameStore.getState().screen).toBe('setup');
  });

  it('fair mode routes countdown to game (skips setup)', () => {
    useGameStore.setState({ screen: 'lobby', playerId: 'a', roomId: 'ABC123' });
    useGameStore.getState().setGameState(makeState({
      phase: 'countdown',
      countdown: 3,
      fairMode: { enabled: true, battle: false, levelId: 'easy-mine', timeLimit: 90 },
    }));
    expect(useGameStore.getState().screen).toBe('game');
  });

  it('battle mode routes countdown to game (skips setup)', () => {
    useGameStore.setState({ screen: 'lobby', playerId: 'a', roomId: 'ABC123' });
    useGameStore.getState().setGameState(makeState({
      phase: 'countdown',
      countdown: 3,
      fairMode: { enabled: true, battle: true, levelId: 'easy-mine', timeLimit: 90 },
      battle: {
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
      },
    }));
    expect(useGameStore.getState().screen).toBe('game');
  });

  it('finished routes to result for all modes', () => {
    useGameStore.setState({ screen: 'game' });
    useGameStore.getState().setGameState(makeState({
      phase: 'finished',
      winnerId: 'a',
      fairMode: { enabled: true, battle: true, levelId: 'easy-mine', timeLimit: 90 },
    }));
    expect(useGameStore.getState().screen).toBe('result');
  });
});

describe('gameStore — Collection popups', () => {
  beforeEach(() => useGameStore.getState().reset());

  it('tracks collection events for score popups', () => {
    useGameStore.getState().addCollection(150, 'bigGold');
    expect(useGameStore.getState().collections).toHaveLength(1);
    expect(useGameStore.getState().collections[0].value).toBe(150);
  });
});
