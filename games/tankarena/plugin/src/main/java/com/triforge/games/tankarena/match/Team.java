package com.triforge.games.tankarena.match;

/**
 * Team affiliation. {@link #NONE} is the unassigned state a player holds until they pick a side in
 * the lobby; only {@link #RED} and {@link #BLUE} are playable.
 */
public enum Team {
    NONE,
    RED,
    BLUE;

    public boolean isPlayable() {
        return this == RED || this == BLUE;
    }

    public Team opponent() {
        return switch (this) {
            case RED -> BLUE;
            case BLUE -> RED;
            case NONE -> NONE;
        };
    }
}
