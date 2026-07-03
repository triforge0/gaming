package com.triforge.games.oanquan.core;

/**
 * Tunable Ô ăn quan rules. Regional dialects differ; every disputed rule lives here so a
 * dispute is a config change, not a rewrite.
 *
 * @param stonesPerPit      dân stones seeded in each of the 10 dân pits
 * @param quanPerPit        quan pieces seeded in each of the 2 quan pits
 * @param quanValue         points per captured quan piece (dân = 1)
 * @param quanNonThreshold  "quan non" protection: a quan pit still holding quan pieces cannot
 *                          be captured while its dân count is below this threshold; 0 = off
 * @param turnTimeoutTicks  ticks before the server plays a random legal move for the slow player
 */
public record RuleConfig(
        int stonesPerPit,
        int quanPerPit,
        int quanValue,
        int quanNonThreshold,
        int turnTimeoutTicks) {

    public static final int TICKS_PER_SECOND = 60;

    public static RuleConfig defaults() {
        return new RuleConfig(5, 1, 10, 0, 30 * TICKS_PER_SECOND);
    }

    public RuleConfig {
        if (stonesPerPit < 1) {
            throw new IllegalArgumentException("stonesPerPit must be >= 1");
        }
        if (quanPerPit < 1) {
            throw new IllegalArgumentException("quanPerPit must be >= 1");
        }
        if (quanValue < 1) {
            throw new IllegalArgumentException("quanValue must be >= 1");
        }
        if (quanNonThreshold < 0) {
            throw new IllegalArgumentException("quanNonThreshold must be >= 0");
        }
        if (turnTimeoutTicks < 1) {
            throw new IllegalArgumentException("turnTimeoutTicks must be >= 1");
        }
    }
}
