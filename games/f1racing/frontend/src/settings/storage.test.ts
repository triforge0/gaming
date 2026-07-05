import { beforeEach, describe, expect, it } from 'vitest';
import { SETTINGS_STORAGE_KEY } from '../shared';
import { DEFAULT_KEY_BINDINGS } from './defaults';
import { resolveControlAction } from './keyBindings';
import { normalizeSettings, readSettings, writeSettings } from './storage';

describe('settings storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns defaults when storage is empty', () => {
    const settings = readSettings();
    expect(settings.graphicsQuality).toBe('medium');
    expect(settings.masterVolume).toBeCloseTo(0.8);
    expect(settings.keyBindings.throttle).toEqual(DEFAULT_KEY_BINDINGS.throttle);
  });

  it('persists custom settings', () => {
    writeSettings({
      graphicsQuality: 'high',
      masterVolume: 0.5,
      sfxVolume: 0.4,
      musicVolume: 0.3,
      keyBindings: {
        ...DEFAULT_KEY_BINDINGS,
        handbrake: 'KeyH',
      },
    });

    expect(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}').graphicsQuality).toBe('high');
    expect(readSettings().keyBindings.handbrake).toBe('KeyH');
  });

  it('clamps invalid volume values', () => {
    expect(normalizeSettings({ masterVolume: 2, sfxVolume: -1 }).masterVolume).toBe(1);
    expect(normalizeSettings({ masterVolume: 2, sfxVolume: -1 }).sfxVolume).toBe(0);
  });
});

describe('resolveControlAction', () => {
  it('maps arrow keys regardless of custom bindings', () => {
    const bindings = {
      ...DEFAULT_KEY_BINDINGS,
      throttle: ['KeyQ'],
      brake: ['KeyE'],
    };
    expect(resolveControlAction('ArrowUp', bindings)).toBe('throttle');
    expect(resolveControlAction('KeyQ', bindings)).toBe('throttle');
  });
});
