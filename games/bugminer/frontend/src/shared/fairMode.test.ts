import { describe, it, expect } from 'vitest';
import { DEFAULT_FAIR_MODE, getRoomSetupMode } from './fairMode';

describe('getRoomSetupMode', () => {
  it('returns free when fair mode disabled', () => {
    expect(getRoomSetupMode(DEFAULT_FAIR_MODE)).toBe('free');
  });

  it('returns fair when enabled without battle', () => {
    expect(getRoomSetupMode({ ...DEFAULT_FAIR_MODE, enabled: true, battle: false })).toBe('fair');
  });

  it('returns battle when battle flag set', () => {
    expect(getRoomSetupMode({ ...DEFAULT_FAIR_MODE, enabled: true, battle: true })).toBe('battle');
  });
});
