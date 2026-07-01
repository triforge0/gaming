package com.triforge.games.demo;

import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugin;

/** ServiceLoader entry for the demo / scaffold game plugin. */
public final class DemoPlugin implements GamePlugin {

    public static final String ID = "demo";

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String displayName() {
        return "Demo Game";
    }

    @Override
    public GameFactory gameFactory() {
        return DemoFactory.INSTANCE;
    }
}
