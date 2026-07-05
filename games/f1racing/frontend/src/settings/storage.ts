import { SETTINGS_STORAGE_KEY } from '../shared';
import { DEFAULT_KEY_BINDINGS, DEFAULT_SETTINGS } from './defaults';
import type { GameSettings, GraphicsQuality, KeyBindings } from './types';

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function normalizeKeyBindings(raw: Partial<KeyBindings> | undefined): KeyBindings {
  const pickCodes = (codes: string[] | undefined, fallback: string[]) => {
    const next = (codes ?? []).filter(Boolean);
    return next.length > 0 ? next : fallback;
  };
  const pickCode = (code: string | undefined, fallback: string) => (
    code && code.length > 0 ? code : fallback
  );

  return {
    throttle: pickCodes(raw?.throttle, DEFAULT_KEY_BINDINGS.throttle),
    brake: pickCodes(raw?.brake, DEFAULT_KEY_BINDINGS.brake),
    steerLeft: pickCode(raw?.steerLeft, DEFAULT_KEY_BINDINGS.steerLeft),
    steerRight: pickCode(raw?.steerRight, DEFAULT_KEY_BINDINGS.steerRight),
    handbrake: pickCode(raw?.handbrake, DEFAULT_KEY_BINDINGS.handbrake),
    nitro: pickCodes(raw?.nitro, DEFAULT_KEY_BINDINGS.nitro),
    toggleCamera: pickCode(raw?.toggleCamera, DEFAULT_KEY_BINDINGS.toggleCamera),
  };
}

function normalizeGraphicsQuality(value: unknown): GraphicsQuality {
  if (value === 'low' || value === 'high') return value;
  return 'medium';
}

export function normalizeSettings(raw: Partial<GameSettings> | null | undefined): GameSettings {
  return {
    graphicsQuality: normalizeGraphicsQuality(raw?.graphicsQuality),
    masterVolume: clamp01(raw?.masterVolume ?? DEFAULT_SETTINGS.masterVolume),
    sfxVolume: clamp01(raw?.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume),
    musicVolume: clamp01(raw?.musicVolume ?? DEFAULT_SETTINGS.musicVolume),
    keyBindings: normalizeKeyBindings(raw?.keyBindings),
  };
}

export function readSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS, keyBindings: { ...DEFAULT_KEY_BINDINGS } };
    return normalizeSettings(JSON.parse(raw) as Partial<GameSettings>);
  } catch {
    return { ...DEFAULT_SETTINGS, keyBindings: { ...DEFAULT_KEY_BINDINGS } };
  }
}

export function writeSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalizeSettings(settings)));
}

export function formatKeyCode(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Arrow')) return code.slice(5);
  if (code === 'Space') return 'Space';
  if (code.startsWith('Shift')) return 'Shift';
  return code;
}
