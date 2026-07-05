export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface KeyBindings {
  throttle: string[];
  brake: string[];
  steerLeft: string;
  steerRight: string;
  handbrake: string;
  nitro: string[];
  toggleCamera: string;
}

export interface GameSettings {
  graphicsQuality: GraphicsQuality;
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  keyBindings: KeyBindings;
}
