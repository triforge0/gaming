/** Lightweight procedural chat cues via Web Audio (no asset files). */

let audioContext: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
}

/** Call on first user gesture so later cues are not blocked by autoplay policy. */
export function primeChatSounds(): void {
  context();
}

function playTone(
  frequency: number,
  durationSec: number,
  volume: number,
  type: OscillatorType = 'sine',
  when = 0,
): void {
  const ac = context();
  if (!ac) {
    return;
  }
  const start = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + durationSec);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(start);
  osc.stop(start + durationSec + 0.02);
}

export function playChatSendSound(): void {
  playTone(520, 0.05, 0.045, 'triangle');
  playTone(780, 0.06, 0.03, 'sine', 0.04);
}

export function playChatReceiveSound(): void {
  playTone(660, 0.07, 0.05, 'sine');
  playTone(880, 0.08, 0.035, 'sine', 0.06);
}

export function playChatSystemSound(): void {
  playTone(440, 0.1, 0.04, 'sine');
  playTone(330, 0.14, 0.03, 'sine', 0.08);
}
