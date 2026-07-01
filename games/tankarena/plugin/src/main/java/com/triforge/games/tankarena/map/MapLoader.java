package com.triforge.games.tankarena.map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public final class MapLoader {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private MapLoader() {
    }

    public static GameMap loadDefault() {
        return loadFromClasspath("maps/arena.json");
    }

    public static GameMap loadFromClasspath(String resourcePath) {
        Objects.requireNonNull(resourcePath, "resourcePath");
        try (InputStream inputStream = MapLoader.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                throw new IllegalStateException("Map resource not found: " + resourcePath);
            }
            MapDefinition definition = MAPPER.readValue(inputStream, MapDefinition.class);
            return fromDefinition(definition);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load map: " + resourcePath, e);
        }
    }

    static GameMap fromDefinition(MapDefinition definition) {
        Objects.requireNonNull(definition, "definition");
        if (definition.rows().size() != definition.height()) {
            throw new IllegalArgumentException("Row count must match map height");
        }

        TileType[] tiles = new TileType[definition.width() * definition.height()];
        for (int y = 0; y < definition.height(); y++) {
            String row = definition.rows().get(y);
            if (row.length() != definition.width()) {
                throw new IllegalArgumentException("Row " + y + " width mismatch");
            }
            for (int x = 0; x < definition.width(); x++) {
                tiles[y * definition.width() + x] = parseSymbol(row.charAt(x));
            }
        }

        return GameMap.builder(definition.width(), definition.height())
                .tileSize(definition.tileSize())
                .tiles(tiles)
                .spawnRegions(resolveSpawnRegions(definition))
                .headquarters(resolveHeadquarters(definition, tiles, definition.width()))
                .build();
    }

    private static List<HeadquartersDefinition> resolveHeadquarters(
            MapDefinition definition,
            TileType[] tiles,
            int width
    ) {
        if (definition.headquarters() == null || definition.headquarters().isEmpty()) {
            return List.of();
        }
        List<HeadquartersDefinition> result = new ArrayList<>();
        definition.headquarters().forEach((name, rect) -> {
            Team team = Team.valueOf(name.trim().toUpperCase());
            HeadquartersDefinition hq = HeadquartersDefinition.rect(
                    team,
                    rect.x(),
                    rect.y(),
                    rect.width(),
                    rect.height(),
                    rect.maxHp() > 0 ? rect.maxHp() : HeadquartersDefinition.DEFAULT_MAX_HP
            );
            result.add(hq);
            paintHeadquartersTiles(tiles, width, hq);
        });
        return List.copyOf(result);
    }

    private static void paintHeadquartersTiles(TileType[] tiles, int width, HeadquartersDefinition hq) {
        for (int y = hq.minTileY(); y <= hq.maxTileY(); y++) {
            for (int x = hq.minTileX(); x <= hq.maxTileX(); x++) {
                tiles[y * width + x] = TileType.HQ;
            }
        }
    }

    /**
     * Builds the corner → rectangle map. Any corner the JSON omits (or the whole block, if absent) is
     * filled from the derived default quadrants, so every map always has all four corners.
     */
    private static Map<SpawnRegion, SpawnRegionDefinition> resolveSpawnRegions(MapDefinition definition) {
        Map<SpawnRegion, SpawnRegionDefinition> regions =
                SpawnRegionDefinition.defaultCorners(definition.width(), definition.height());
        if (definition.spawnRegions() == null) {
            return regions;
        }
        Map<SpawnRegion, SpawnRegionDefinition> resolved = new EnumMap<>(regions);
        definition.spawnRegions().forEach((name, rect) -> {
            SpawnRegion region = SpawnRegion.valueOf(name.trim().toUpperCase());
            resolved.put(region, new SpawnRegionDefinition(
                    region,
                    rect.x(),
                    rect.y(),
                    rect.x() + rect.width() - 1,
                    rect.y() + rect.height() - 1));
        });
        return resolved;
    }

    private static TileType parseSymbol(char symbol) {
        return switch (symbol) {
            case '.', ' ' -> TileType.EMPTY;
            case 'B' -> TileType.BRICK;
            case 'S' -> TileType.STEEL;
            case '~' -> TileType.WATER;
            case 'T', 'C' -> TileType.TREE;
            case '#', 'W' -> TileType.STEEL;
            case 'E', 'H' -> TileType.HQ;
            default -> throw new IllegalArgumentException("Unknown tile symbol: " + symbol);
        };
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record MapDefinition(int width, int height, int tileSize, List<String> rows,
                         Map<String, RegionRect> spawnRegions,
                         Map<String, RegionRect> headquarters) {
    }

    /** Tile-coordinate rectangle as written in map JSON (top-left origin, size in tiles). */
    @JsonIgnoreProperties(ignoreUnknown = true)
    record RegionRect(int x, int y, int width, int height, int maxHp) {
        RegionRect(int x, int y, int width, int height) {
            this(x, y, width, height, 0);
        }
    }
}
