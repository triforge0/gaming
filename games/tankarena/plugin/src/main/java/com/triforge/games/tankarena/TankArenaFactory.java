package com.triforge.games.tankarena;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugins;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapLoader;

/** Default factory for Tank Arena rooms. */
public final class TankArenaFactory implements GameFactory {

    public static final TankArenaFactory INSTANCE = new TankArenaFactory();

    private TankArenaFactory() {
    }

    public static GameFactory get() {
        return GamePlugins.require(TankArenaPlugin.ID).gameFactory();
    }

    @Override
    public Game create() {
        return create(MapLoader.loadDefault());
    }

    public Game create(GameMap gameMap) {
        return new TankArenaGame(gameMap);
    }
}
