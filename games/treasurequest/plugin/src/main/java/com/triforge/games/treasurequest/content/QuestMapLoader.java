package com.triforge.games.treasurequest.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Parses a quest map (tiles + checkpoint graph + treasure) from JSON. */
public final class QuestMapLoader {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private QuestMapLoader() {
    }

    public static QuestMap load(ContentSource source, String relPath) throws IOException {
        Objects.requireNonNull(source, "source");
        try (InputStream in = source.open(relPath)) {
            return parseBytes(in.readAllBytes());
        }
    }

    public static QuestMap parseBytes(byte[] json) throws IOException {
        return fromDefinition(MAPPER.readValue(json, MapDefinition.class));
    }

    public static byte[] readCheckpointOverlay(ContentSource source, String relPath) throws IOException {
        Objects.requireNonNull(source, "source");
        try (InputStream in = source.open(relPath)) {
            MapDefinition def = MAPPER.readValue(in, MapDefinition.class);
            CheckpointOverlay overlay = new CheckpointOverlay(
                    def.width(),
                    def.height(),
                    def.tileSize(),
                    def.start(),
                    def.checkpoints(),
                    def.treasure());
            return MAPPER.writerWithDefaultPrettyPrinter().writeValueAsBytes(overlay);
        }
    }

    public static byte[] mergeCheckpointOverlay(byte[] mapBytes, byte[] overlayBytes) throws IOException {
        MapDefinition existing = MAPPER.readValue(mapBytes, MapDefinition.class);
        CheckpointOverlay overlay = MAPPER.readValue(overlayBytes, CheckpointOverlay.class);
        MapDefinition merged = new MapDefinition(
                existing.width(),
                existing.height(),
                existing.tileSize(),
                overlay.start(),
                existing.rows(),
                overlay.checkpoints(),
                overlay.treasure());
        return MAPPER.writerWithDefaultPrettyPrinter().writeValueAsBytes(merged);
    }

    static QuestMap fromDefinition(MapDefinition def) {
        Objects.requireNonNull(def, "def");
        if (def.rows() == null || def.rows().size() != def.height()) {
            throw new IllegalArgumentException("Row count must match map height");
        }
        QuestTileType[] tiles = new QuestTileType[def.width() * def.height()];
        for (int y = 0; y < def.height(); y++) {
            String row = def.rows().get(y);
            if (row.length() != def.width()) {
                throw new IllegalArgumentException("Row " + y + " width mismatch (expected " + def.width() + ")");
            }
            for (int x = 0; x < def.width(); x++) {
                tiles[y * def.width() + x] = QuestTileType.fromSymbol(row.charAt(x));
            }
        }

        List<Checkpoint> checkpoints = new ArrayList<>();
        if (def.checkpoints() != null) {
            for (CheckpointDefinition cp : def.checkpoints()) {
                checkpoints.add(new Checkpoint(
                        cp.id(),
                        new Rect(cp.x(), cp.y(), cp.w(), cp.h()),
                        cp.quizId(),
                        cp.next(),
                        cp.isBoss(),
                        CheckpointRisk.fromString(cp.risk()),
                        cp.hint(),
                        toReward(cp.reward())
                ));
            }
        }
        CheckpointGraph graph = new CheckpointGraph(checkpoints, def.start());

        if (def.treasure() == null) {
            throw new IllegalArgumentException("Map must define a treasure zone");
        }
        TreasureZone treasure = new TreasureZone(
                new Rect(def.treasure().x(), def.treasure().y(), def.treasure().w(), def.treasure().h()));

        return new QuestMap(def.width(), def.height(), def.tileSize(), tiles, graph, treasure);
    }

    private static Reward toReward(RewardDefinition def) {
        if (def == null) {
            return Reward.NONE;
        }
        return new Reward(def.points(), def.item());
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record CheckpointOverlay(
            int width,
            int height,
            int tileSize,
            String start,
            List<CheckpointDefinition> checkpoints,
            RectDefinition treasure
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record MapDefinition(
            int width,
            int height,
            int tileSize,
            String start,
            List<String> rows,
            List<CheckpointDefinition> checkpoints,
            RectDefinition treasure
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record CheckpointDefinition(
            String id,
            int x,
            int y,
            int w,
            int h,
            String quizId,
            List<String> next,
            boolean isBoss,
            String risk,
            String hint,
            RewardDefinition reward
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RectDefinition(int x, int y, int w, int h) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RewardDefinition(int points, String item) {
    }
}
