/** Deterministic 0..1 RNG from a string seed (same seed → same sequence). */
export function createSeededRng(seed: string): () => number {
  let state = seed.split('').reduce((acc, ch) => (Math.imul(acc, 31) + ch.charCodeAt(0)) >>> 0, 0x811c9dc5);
  return () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}
