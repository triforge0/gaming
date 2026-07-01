package com.triforge.games.demo;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;

public final class DemoFactory implements GameFactory {

    public static final DemoFactory INSTANCE = new DemoFactory();

    private DemoFactory() {
    }

    @Override
    public Game create() {
        return new DemoGame();
    }
}
