import { beforeEach, describe, expect, it } from 'vitest';
import { GARAGE_STORAGE_KEY } from '../shared';
import { normalizeGarageLoadout } from './catalog';
import { readGarageLoadout, writeGarageLoadout } from './storage';

describe('garage storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns normalized defaults when storage is empty', () => {
    const loadout = readGarageLoadout();
    expect(loadout.carId).toBe('formula-modern');
    expect(loadout.primaryColor).toBe('#e10600');
    expect(loadout.liveryId).toBe('solid');
  });

  it('persists and reloads a custom loadout', () => {
    writeGarageLoadout({
      carId: 'formula-ev',
      primaryColor: '#112233',
      liveryId: 'carbon',
      wheelId: 'gold',
      nitroFxId: 'purple',
    });

    const stored = JSON.parse(localStorage.getItem(GARAGE_STORAGE_KEY) ?? '{}');
    expect(stored.carId).toBe('formula-ev');

    const loadout = readGarageLoadout();
    expect(loadout).toEqual({
      carId: 'formula-ev',
      primaryColor: '#112233',
      liveryId: 'carbon',
      wheelId: 'gold',
      nitroFxId: 'purple',
    });
  });

  it('falls back to a valid preset for unknown car ids', () => {
    localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify({
      carId: 'not-a-car',
      primaryColor: '#abcdef',
    }));

    const loadout = readGarageLoadout();
    expect(loadout.carId).toBe('formula-modern');
    expect(loadout.primaryColor).toBe('#abcdef');
  });
});

describe('normalizeGarageLoadout', () => {
  it('fills missing cosmetic fields', () => {
    expect(normalizeGarageLoadout({ carId: 'formula-classic', primaryColor: '#004225' })).toEqual({
      carId: 'formula-classic',
      primaryColor: '#004225',
      liveryId: 'solid',
      wheelId: 'standard',
      nitroFxId: 'blue',
    });
  });
});
