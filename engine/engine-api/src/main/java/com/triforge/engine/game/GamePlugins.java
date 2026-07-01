package com.triforge.engine.game;

import java.util.List;
import java.util.Objects;
import java.util.ServiceLoader;
import java.util.stream.Collectors;

/** Loads {@link GamePlugin} implementations from the classpath via {@link ServiceLoader}. */
public final class GamePlugins {
    public static final String DEFAULT_PLUGIN_ID = "tankarena";

    private GamePlugins() {
    }

    public static List<GamePlugin> loadAll() {
        return ServiceLoader.load(GamePlugin.class).stream()
                .map(ServiceLoader.Provider::get)
                .collect(Collectors.toList());
    }

    public static GamePlugin require(String id) {
        Objects.requireNonNull(id, "id");
        return loadAll().stream()
                .filter(plugin -> id.equals(plugin.id()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "No GamePlugin registered for id '" + id + "'. "
                                + "Registered: " + loadAll().stream().map(GamePlugin::id).toList()));
    }

    public static GamePlugin defaultPlugin() {
        return require(DEFAULT_PLUGIN_ID);
    }
}
