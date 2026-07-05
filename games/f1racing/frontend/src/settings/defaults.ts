import type { GameSettings, KeyBindings } from './types';

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  throttle: ['KeyW', 'ArrowUp'],
  brake: ['KeyS', 'ArrowDown'],
  steerLeft: 'KeyA',
  steerRight: 'KeyD',
  handbrake: '',
  nitro: ['Space'],
  toggleCamera: 'KeyC',
};

export const DEFAULT_SETTINGS: GameSettings = {
  graphicsQuality: 'medium',
  masterVolume: 0.8,
  sfxVolume: 0.85,
  musicVolume: 0.6,
  keyBindings: DEFAULT_KEY_BINDINGS,
};
