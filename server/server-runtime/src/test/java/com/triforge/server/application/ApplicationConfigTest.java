package com.triforge.server.application;

import com.triforge.engine.game.GamePlugins;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class ApplicationConfigTest {

    @Test
    void fallsBackToTankArenaWhenUnset() {
        assertEquals(GamePlugins.DEFAULT_PLUGIN_ID, ApplicationConfig.load().defaultGamePluginId());
    }
}
