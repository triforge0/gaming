import { readSettings } from '../settings/storage';

// Lightweight synthesized start-light blips. Kept asset-free (Web Audio oscillators) so the bundle
// stays self-contained and there is nothing to preload.

let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, durationMs: number, peakGain: number): void {
  const audio = audioContext();
  if (!audio) return;
  const settings = readSettings();
  const gainScale = settings.masterVolume * settings.sfxVolume;
  if (gainScale <= 0) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  const peak = peakGain * gainScale;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

/** A red start-light coming on (3 · 2 · 1). */
export function playCountdownBeep(): void {
  tone(420, 170, 0.16);
}

/** Lights out — GO! */
export function playGoBeep(): void {
  tone(880, 320, 0.22);
}
