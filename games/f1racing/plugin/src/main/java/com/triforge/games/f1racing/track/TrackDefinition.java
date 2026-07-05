package com.triforge.games.f1racing.track;

import java.util.List;
import java.util.Objects;

/** Immutable circuit loaded from JSON. */
public final class TrackDefinition {

    private final String id;
    private final String displayName;
    private final String biome;
    private final int defaultLaps;
    private final float lengthMeters;
    private final float trackWidth;
    private final List<TrackPoint> centerline;
    private final List<CheckpointDefinition> checkpoints;
    private final List<StartGridSlot> startGrid;

    public TrackDefinition(
            String id,
            String displayName,
            String biome,
            int defaultLaps,
            float lengthMeters,
            float trackWidth,
            List<TrackPoint> centerline,
            List<CheckpointDefinition> checkpoints,
            List<StartGridSlot> startGrid
    ) {
        this.id = requireText(id, "id");
        this.displayName = requireText(displayName, "displayName");
        this.biome = biome == null || biome.isBlank() ? "city" : biome;
        this.defaultLaps = defaultLaps > 0 ? defaultLaps : 3;
        this.lengthMeters = lengthMeters > 0 ? lengthMeters : 1f;
        this.trackWidth = trackWidth > 0 ? trackWidth : 14f;
        this.centerline = List.copyOf(Objects.requireNonNull(centerline, "centerline"));
        this.checkpoints = List.copyOf(Objects.requireNonNull(checkpoints, "checkpoints"));
        this.startGrid = List.copyOf(Objects.requireNonNull(startGrid, "startGrid"));
        validate();
    }

    private void validate() {
        if (centerline.size() < 4) {
            throw new IllegalArgumentException("Track '" + id + "' needs at least 4 centerline points");
        }
        if (checkpoints.size() < 4) {
            throw new IllegalArgumentException("Track '" + id + "' needs at least 4 checkpoints");
        }
        if (startGrid.isEmpty()) {
            throw new IllegalArgumentException("Track '" + id + "' needs at least one start grid slot");
        }
        for (int i = 0; i < checkpoints.size(); i++) {
            if (checkpoints.get(i).index() != i) {
                throw new IllegalArgumentException(
                        "Track '" + id + "' checkpoints must be ordered 0..n (bad index at position " + i + ")");
            }
        }
    }

    private static String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Track " + field + " is required");
        }
        return value.trim();
    }

    public String id() {
        return id;
    }

    public String displayName() {
        return displayName;
    }

    public String biome() {
        return biome;
    }

    public int defaultLaps() {
        return defaultLaps;
    }

    public float lengthMeters() {
        return lengthMeters;
    }

    public float trackWidth() {
        return trackWidth;
    }

    public List<TrackPoint> centerline() {
        return centerline;
    }

    public List<CheckpointDefinition> checkpoints() {
        return checkpoints;
    }

    public List<StartGridSlot> startGrid() {
        return startGrid;
    }
}
