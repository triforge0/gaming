package com.triforge.engine.game;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

final class GamePluginsTest {

    @Test
    void defaultPluginIdIsTankArena() {
        assertEquals("tankarena", GamePlugins.DEFAULT_PLUGIN_ID);
    }

    @Test
    void requireThrowsForUnknownPlugin() {
        assertThrows(IllegalStateException.class, () -> GamePlugins.require("nonexistent-plugin"));
    }
}
