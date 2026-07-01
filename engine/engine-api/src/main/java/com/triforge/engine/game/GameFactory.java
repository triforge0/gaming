package com.triforge.engine.game;

/** Creates a {@link Game} instance for a room. Each game plugin supplies its own factory. */
public interface GameFactory {

    Game create();
}
