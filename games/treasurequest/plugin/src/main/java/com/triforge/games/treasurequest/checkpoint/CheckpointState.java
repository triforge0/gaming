package com.triforge.games.treasurequest.checkpoint;

/** Per-player checkpoint interaction state for the current target node. */
public enum CheckpointState {
    /** Avatar is outside the current checkpoint zone, or the zone is not interactable. */
    UNAVAILABLE,
    /** Avatar is inside the current checkpoint zone; interact may open the quiz. */
    AVAILABLE,
    /** Quiz prompt was sent; awaiting submission (Task 7). */
    OPENED
}
