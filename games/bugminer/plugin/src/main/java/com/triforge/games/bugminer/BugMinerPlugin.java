package com.triforge.games.bugminer;

import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugin;

/** ServiceLoader entry for the bugminer / scaffold game plugin. */
public final class BugMinerPlugin implements GamePlugin {

    public static final String ID = "bugminer";

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String displayName() {
        return "BugMiner Game";
    }

    @Override
    public GameFactory gameFactory() {
        return BugMinerFactory.INSTANCE;
    }
}
