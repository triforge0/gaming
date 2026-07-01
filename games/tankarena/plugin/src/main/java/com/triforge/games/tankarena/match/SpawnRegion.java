package com.triforge.games.tankarena.match;

/**
 * Predefined spawn zones. Players choose a region (not an exact tile); the server picks a valid
 * tile inside the chosen zone at spawn time. {@link #UNSPECIFIED} means "let the server decide".
 */
public enum SpawnRegion {
    UNSPECIFIED,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT;

    public boolean isChosen() {
        return this != UNSPECIFIED;
    }

    /** RED uses the left half; BLUE uses the right half of the arena. */
    public boolean isValidForTeam(Team team) {
        return switch (team) {
            case RED -> this == TOP_LEFT || this == BOTTOM_LEFT;
            case BLUE -> this == TOP_RIGHT || this == BOTTOM_RIGHT;
            case NONE -> false;
        };
    }
}
