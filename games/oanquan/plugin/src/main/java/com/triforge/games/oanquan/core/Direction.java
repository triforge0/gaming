package com.triforge.games.oanquan.core;

/** Sowing direction around the circular board. */
public enum Direction {

    /** Increasing pit index (mod 12). */
    CLOCKWISE(1),
    /** Decreasing pit index (mod 12). */
    COUNTER_CLOCKWISE(-1);

    private final int step;

    Direction(int step) {
        this.step = step;
    }

    public int step() {
        return step;
    }
}
