package com.triforge.games.treasurequest;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;

public final class TreasureQuestFactory implements GameFactory {

    public static final TreasureQuestFactory INSTANCE = new TreasureQuestFactory();

    private TreasureQuestFactory() {
    }

    @Override
    public Game create() {
        return new TreasureQuestGame();
    }
}
