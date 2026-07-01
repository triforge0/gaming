package com.triforge.server.application;

import com.triforge.engine.game.GamePlugin;
import com.triforge.engine.game.GamePlugins;

/**
 * Host-level settings loaded from system properties or environment variables.
 * Property keys use dots; env vars use underscores and uppercase
 * (e.g. {@code triforge.game.pluginId} → {@code TRIFORGE_GAME_PLUGINID}).
 */
public final class ApplicationConfig {
    public static final String DEFAULT_GAME_PLUGIN_PROPERTY = "triforge.game.pluginId";

    private final String defaultGamePluginId;

    private ApplicationConfig(String defaultGamePluginId) {
        this.defaultGamePluginId = defaultGamePluginId;
    }

    public static ApplicationConfig load() {
        String pluginId = readProperty(DEFAULT_GAME_PLUGIN_PROPERTY);
        if (pluginId == null || pluginId.isBlank()) {
            pluginId = readProperty("tankarena.game.pluginId");
        }
        if (pluginId == null || pluginId.isBlank()) {
            pluginId = GamePlugins.DEFAULT_PLUGIN_ID;
        }
        return new ApplicationConfig(pluginId.trim());
    }

    public String defaultGamePluginId() {
        return defaultGamePluginId;
    }

    public GamePlugin defaultPlugin() {
        return GamePlugins.require(defaultGamePluginId);
    }

    private static String readProperty(String key) {
        String value = System.getProperty(key);
        if (value == null || value.isBlank()) {
            value = System.getenv(toEnvKey(key));
        }
        return value;
    }

    private static String toEnvKey(String propertyKey) {
        return propertyKey.replace('.', '_').toUpperCase();
    }
}
