package com.triforge.games.treasurequest;

import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugin;

/** ServiceLoader entry for the TreasureQuest game plugin. */
public final class TreasureQuestPlugin implements GamePlugin {

    public static final String ID = "treasurequest";

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String displayName() {
        return "TreasureQuest";
    }

    @Override
    public GameFactory gameFactory() {
        return TreasureQuestFactory.INSTANCE;
    }
}
