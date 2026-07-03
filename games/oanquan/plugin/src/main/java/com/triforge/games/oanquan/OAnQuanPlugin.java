package com.triforge.games.oanquan;

import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugin;

/** ServiceLoader entry for the Ô ăn quan (Vietnamese mancala) plugin. */
public final class OAnQuanPlugin implements GamePlugin {

    public static final String ID = "oanquan";

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String displayName() {
        return "Ô ăn quan";
    }

    @Override
    public GameFactory gameFactory() {
        return OAnQuanFactory.INSTANCE;
    }
}
