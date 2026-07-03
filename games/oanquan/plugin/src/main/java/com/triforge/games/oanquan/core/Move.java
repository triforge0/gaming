package com.triforge.games.oanquan.core;

import java.util.Objects;

/** One player decision: which own pit to lift and which way to sow. */
public record Move(int pitIndex, Direction direction) {

    public Move {
        if (pitIndex < 0 || pitIndex >= Board.PIT_COUNT) {
            throw new IllegalArgumentException("pitIndex out of range: " + pitIndex);
        }
        Objects.requireNonNull(direction, "direction");
    }
}
