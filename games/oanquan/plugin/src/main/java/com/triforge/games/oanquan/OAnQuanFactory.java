package com.triforge.games.oanquan;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;

public final class OAnQuanFactory implements GameFactory {

    public static final OAnQuanFactory INSTANCE = new OAnQuanFactory();

    private OAnQuanFactory() {
    }

    @Override
    public Game create() {
        return new OAnQuanGame();
    }
}
