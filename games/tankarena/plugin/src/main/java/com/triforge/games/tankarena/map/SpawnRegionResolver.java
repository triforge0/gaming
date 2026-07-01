package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;

import java.util.Objects;
import java.util.Random;

/**
 * Picks a concrete world spawn position inside a {@link SpawnRegion}. Players choose a region, not a
 * tile; this resolver lands them on a random non-blocking tile within the region's rectangle.
 *
 * <p>Resolution order: random retries inside the region → deterministic scan of the region →
 * deterministic scan of the whole map → map center as a last resort. This guarantees a position even
 * if a region is fully blocked.
 */
public final class SpawnRegionResolver {
    private static final int DEFAULT_RANDOM_ATTEMPTS = 32;

    private final Random random;
    private final int randomAttempts;

    public SpawnRegionResolver() {
        this(new Random(), DEFAULT_RANDOM_ATTEMPTS);
    }

    public SpawnRegionResolver(Random random) {
        this(random, DEFAULT_RANDOM_ATTEMPTS);
    }

    public SpawnRegionResolver(Random random, int randomAttempts) {
        this.random = Objects.requireNonNull(random, "random");
        this.randomAttempts = Math.max(1, randomAttempts);
    }

    public SpawnPoint resolve(GameMap map, SpawnRegion region, MapConfig config) {
        Objects.requireNonNull(map, "map");
        Objects.requireNonNull(config, "config");

        Bounds bounds = boundsFor(map, region);

        for (int attempt = 0; attempt < randomAttempts; attempt++) {
            int tileX = bounds.minX + random.nextInt(bounds.width());
            int tileY = bounds.minY + random.nextInt(bounds.height());
            if (isSpawnable(map, config, tileX, tileY)) {
                return worldCenter(map, tileX, tileY);
            }
        }

        SpawnPoint inRegion = scan(map, config, bounds);
        if (inRegion != null) {
            return inRegion;
        }

        SpawnPoint anywhere = scan(map, config, interior(map));
        if (anywhere != null) {
            return anywhere;
        }

        return worldCenter(map, map.width() / 2, map.height() / 2);
    }

    private SpawnPoint scan(GameMap map, MapConfig config, Bounds bounds) {
        for (int tileY = bounds.minY; tileY <= bounds.maxY; tileY++) {
            for (int tileX = bounds.minX; tileX <= bounds.maxX; tileX++) {
                if (isSpawnable(map, config, tileX, tileY)) {
                    return worldCenter(map, tileX, tileY);
                }
            }
        }
        return null;
    }

    private static boolean isSpawnable(GameMap map, MapConfig config, int tileX, int tileY) {
        return map.inBounds(tileX, tileY) && !map.tileAt(tileX, tileY).blocksTank(config);
    }

    private static SpawnPoint worldCenter(GameMap map, int tileX, int tileY) {
        return new SpawnPoint(map.tileCenterX(tileX), map.tileCenterY(tileY));
    }

    private static Bounds boundsFor(GameMap map, SpawnRegion region) {
        if (region == null || region == SpawnRegion.UNSPECIFIED) {
            return interior(map);
        }
        SpawnRegionDefinition definition = map.spawnRegion(region);
        if (definition == null) {
            return interior(map);
        }
        Bounds interior = interior(map);
        return new Bounds(
                Math.max(interior.minX, definition.minTileX()),
                Math.max(interior.minY, definition.minTileY()),
                Math.min(interior.maxX, definition.maxTileX()),
                Math.min(interior.maxY, definition.maxTileY()));
    }

    /** Map area excluding the solid border row/column. */
    private static Bounds interior(GameMap map) {
        int minX = Math.min(1, map.width() - 1);
        int minY = Math.min(1, map.height() - 1);
        int maxX = Math.max(minX, map.width() - 2);
        int maxY = Math.max(minY, map.height() - 2);
        return new Bounds(minX, minY, maxX, maxY);
    }

    public record SpawnPoint(float x, float y) {
    }

    private record Bounds(int minX, int minY, int maxX, int maxY) {
        int width() {
            return maxX - minX + 1;
        }

        int height() {
            return maxY - minY + 1;
        }
    }
}
