package com.triforge.engine.game;

/**
 * Discoverable game plugin. Each plugin JAR registers an implementation via
 * {@code META-INF/services/com.triforge.engine.game.GamePlugin}.
 */
public interface GamePlugin {

    /** Stable id, e.g. {@code "tankarena"}. */
    String id();

    /** Human-readable label for lobby UI or logs. */
    String displayName();

    GameFactory gameFactory();

    /**
     * Creates a room game instance. {@code config} is plugin-specific (may be {@code null}).
     * Default delegates to {@link #gameFactory()}{@code .create()}.
     */
    default Game createGame(Object config) {
        return gameFactory().create();
    }
}
