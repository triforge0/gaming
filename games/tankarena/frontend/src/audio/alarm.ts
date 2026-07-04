/**
 * A procedural "base under attack" klaxon built with the Web Audio API — no audio assets.
 * A square-wave tone whose pitch warbles up and down (the classic eee-ooo siren), faded in
 * and out to avoid clicks. {@link start}/{@link stop} are idempotent so it can be driven
 * straight from a boolean UI state.
 */
class AlarmSiren {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private playing = false;
  private muted = false;

  /** When muted, {@link start} is a no-op and any active siren is silenced immediately. */
  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stop();
  }

  private context(): AudioContext | null {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null; // audio unsupported — degrade silently
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  start(): void {
    if (this.playing || this.muted) return;
    const ctx = this.context();
    if (!ctx) return;
    // The player has already interacted (connect + controls), so resume is permitted.
    if (ctx.state === 'suspended') void ctx.resume();
    this.playing = true;

    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.12); // gentle fade-in, modest volume
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 620;

    // An LFO sweeps the pitch to give the wailing siren character.
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 2.6; // warble rate (Hz)
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 190; // pitch swing: 620 ± 190 Hz
    lfo.connect(lfoDepth).connect(osc.frequency);

    osc.connect(gain);
    osc.start(now);
    lfo.start(now);

    this.osc = osc;
    this.lfo = lfo;
    this.gain = gain;
  }

  stop(): void {
    if (!this.playing || !this.ctx) return;
    this.playing = false;
    const now = this.ctx.currentTime;
    if (this.gain) {
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setValueAtTime(this.gain.gain.value, now);
      this.gain.gain.linearRampToValueAtTime(0, now + 0.18); // fade out to avoid a click
    }
    this.osc?.stop(now + 0.22);
    this.lfo?.stop(now + 0.22);
    this.osc = null;
    this.lfo = null;
    this.gain = null;
  }
}

export const alarmSiren = new AlarmSiren();
