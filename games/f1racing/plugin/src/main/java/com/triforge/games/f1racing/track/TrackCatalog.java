package com.triforge.games.f1racing.track;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/** Classpath index of bundled circuits. */
public final class TrackCatalog {

    private static final String[] BUNDLED = {"city-loop", "forest-lake"};

    private final Map<String, TrackDefinition> tracks = new LinkedHashMap<>();

    public TrackCatalog() {
        for (String id : BUNDLED) {
            TrackDefinition track = TrackLoader.loadClasspath(id);
            tracks.put(track.id(), track);
        }
    }

    public Optional<TrackDefinition> find(String id) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }
        return Optional.ofNullable(tracks.get(id.trim()));
    }

    public TrackDefinition require(String id) {
        return find(id).orElseThrow(() -> new IllegalArgumentException("Unknown track id: " + id));
    }

    public Map<String, TrackDefinition> all() {
        return Map.copyOf(tracks);
    }
}
