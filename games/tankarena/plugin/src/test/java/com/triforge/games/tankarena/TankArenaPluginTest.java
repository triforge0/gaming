package com.triforge.games.tankarena;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugin;
import com.triforge.engine.game.GamePlugins;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

final class TankArenaPluginTest {

    @Test
    void serviceLoaderRegistersTankArenaPlugin() {
        GamePlugin plugin = GamePlugins.require(TankArenaPlugin.ID);
        assertEquals("Tank Arena", plugin.displayName());
    }

    @Test
    void createsDefaultGame() {
        GamePlugin plugin = GamePlugins.require(TankArenaPlugin.ID);
        Game game = plugin.createGame(null);
        assertNotNull(game);
    }
}
