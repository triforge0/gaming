package com.triforge.games.bugminer;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;

public final class BugMinerFactory implements GameFactory {

    public static final BugMinerFactory INSTANCE = new BugMinerFactory();

    private BugMinerFactory() {
    }

    @Override
    public Game create() {
        return new BugMinerGame();
    }
}
