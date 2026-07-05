package com.triforge.games.f1racing;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;

public final class F1RacingFactory implements GameFactory {

    public static final F1RacingFactory INSTANCE = new F1RacingFactory();

    private F1RacingFactory() {
    }

    @Override
    public Game create() {
        return new F1RacingGame();
    }
}
