package com.triforge.games.tankarena;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GameFactory;
import com.triforge.engine.game.GamePlugin;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapLoader;

/** ServiceLoader entry point for the Tank Arena game plugin. */
public final class TankArenaPlugin implements GamePlugin {

    public static final String ID = "tankarena";

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String displayName() {
        return "Tank Arena";
    }

    @Override
    public GameFactory gameFactory() {
        return TankArenaFactory.INSTANCE;
    }

    @Override
    public Game createGame(Object config) {
        if (config instanceof GameMap map) {
            return TankArenaFactory.INSTANCE.create(map);
        }
        return TankArenaFactory.INSTANCE.create();
    }

    /** Convenience when no custom map is needed. */
    public Game createGame() {
        return createGame(MapLoader.loadDefault());
    }
}
