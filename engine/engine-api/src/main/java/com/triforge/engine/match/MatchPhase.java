package com.triforge.engine.match;

/**
 * Lifecycle of a single match within a room.
 *
 * <pre>
 * LOBBY ──(all ready OR host start)──► COUNTDOWN ──► PLAYING ──► ENDED ──► LOBBY
 * </pre>
 */
public enum MatchPhase {
    LOBBY,
    COUNTDOWN,
    PLAYING,
    ENDED;

    public boolean acceptsGameplayInput() {
        return this == PLAYING;
    }

    public boolean acceptsLobbyEdits() {
        return this == LOBBY;
    }
}
