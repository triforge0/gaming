import { describe, it, expect } from 'vitest';
import { COUNTDOWN_SECONDS, HOOK_MAX_LENGTH, HOOK_MIN_LENGTH, SETUP_ZONE } from './constants';

describe('Game Constants', () => {
  it('countdown is 3 seconds per spec', () => {
    expect(COUNTDOWN_SECONDS).toBe(3);
  });

  it('hook length has valid min/max range', () => {
    expect(HOOK_MIN_LENGTH).toBeLessThan(HOOK_MAX_LENGTH);
    expect(HOOK_MIN_LENGTH).toBeGreaterThan(0);
  });

  it('setup zone is inside valid placement area', () => {
    expect(SETUP_ZONE.minX).toBeLessThan(SETUP_ZONE.maxX);
    expect(SETUP_ZONE.minY).toBeLessThan(SETUP_ZONE.maxY);
    expect(SETUP_ZONE.minY).toBeGreaterThan(0);
  });
});
