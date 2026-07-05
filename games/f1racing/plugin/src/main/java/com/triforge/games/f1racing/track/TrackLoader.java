package com.triforge.games.f1racing.track;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;

public final class TrackLoader {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private TrackLoader() {
    }

    public static TrackDefinition loadClasspath(String resourcePath) {
        Objects.requireNonNull(resourcePath, "resourcePath");
        String path = resourcePath.startsWith("/") ? resourcePath : "/tracks/" + resourcePath;
        if (!path.endsWith(".json")) {
            path = path + ".json";
        }
        try (InputStream in = TrackLoader.class.getResourceAsStream(path)) {
            if (in == null) {
                throw new IllegalArgumentException("Track resource not found: " + path);
            }
            return fromJson(in);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load track " + path, e);
        }
    }

    public static TrackDefinition fromJson(InputStream in) throws IOException {
        TrackJson json = MAPPER.readValue(in, TrackJson.class);
        return toDefinition(json);
    }

    static TrackDefinition toDefinition(TrackJson json) {
        List<TrackPoint> centerline = json.centerline.stream()
                .map(p -> new TrackPoint(p.x, p.y, p.z))
                .toList();
        List<CheckpointDefinition> checkpoints = json.checkpoints.stream()
                .map(c -> new CheckpointDefinition(c.index, c.x, c.y, c.z, c.radius))
                .toList();
        List<StartGridSlot> grid = json.startGrid.stream()
                .map(g -> new StartGridSlot(g.slot, g.x, g.y, g.z, g.yaw))
                .toList();
        return new TrackDefinition(
                json.id,
                json.displayName,
                json.biome,
                json.defaultLaps,
                json.lengthMeters,
                json.trackWidth,
                centerline,
                checkpoints,
                grid);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static final class TrackJson {
        public String id;
        public String displayName;
        public String biome;
        public int defaultLaps;
        public float lengthMeters;
        public float trackWidth;
        public List<PointJson> centerline;
        public List<CheckpointJson> checkpoints;
        public List<GridJson> startGrid;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static final class PointJson {
        public float x;
        public float y;
        public float z;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static final class CheckpointJson {
        public int index;
        public float x;
        public float y;
        public float z;
        public float radius;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static final class GridJson {
        public int slot;
        public float x;
        public float y;
        public float z;
        public float yaw;
    }
}
