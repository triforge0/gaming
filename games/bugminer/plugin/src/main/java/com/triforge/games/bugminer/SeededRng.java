package com.triforge.games.bugminer;

/** Deterministic 0..1 RNG from a string seed (mirrors shared/random.ts). */
final class SeededRng {
    private int state;

    SeededRng(String seed) {
        int acc = 0x811c9dc5;
        for (int i = 0; i < seed.length(); i++) {
            acc = acc * 31 + seed.charAt(i);
        }
        this.state = acc;
    }

    float next() {
        long s = Integer.toUnsignedLong(state);
        s = (s ^ (s >>> 15)) * (s | 1);
        s ^= s + (s ^ (s >>> 7)) * (s | 61);
        state = (int) (s ^ (s >>> 14));
        return (Integer.toUnsignedLong(state)) / 4294967296f;
    }
}
