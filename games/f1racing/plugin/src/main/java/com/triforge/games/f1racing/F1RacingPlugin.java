package com.triforge.games.f1racing;

import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugin;

/** ServiceLoader entry for the F1 LAN racing game plugin. */
public final class F1RacingPlugin implements GamePlugin {

    public static final String ID = "f1racing";

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String displayName() {
        return "F1 Racing LAN";
    }

    @Override
    public GameFactory gameFactory() {
        return F1RacingFactory.INSTANCE;
    }
}
