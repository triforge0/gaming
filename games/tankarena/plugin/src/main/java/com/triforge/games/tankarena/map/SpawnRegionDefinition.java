package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;

import java.util.EnumMap;
import java.util.Map;

/**
 * Inclusive tile-coordinate rectangle that a {@link SpawnRegion} maps to on a given map. Spawns are
 * picked from valid tiles inside this rectangle.
 */
public record SpawnRegionDefinition(
        SpawnRegion region,
        int minTileX,
        int minTileY,
        int maxTileX,
        int maxTileY
) {
    public SpawnRegionDefinition {
        if (minTileX > maxTileX || minTileY > maxTileY) {
            throw new IllegalArgumentException(
                    "Spawn region " + region + " has inverted bounds: "
                            + "(" + minTileX + "," + minTileY + ")-(" + maxTileX + "," + maxTileY + ")");
        }
    }

    public boolean contains(int tileX, int tileY) {
        return tileX >= minTileX && tileX <= maxTileX && tileY >= minTileY && tileY <= maxTileY;
    }

    public int tileWidth() {
        return maxTileX - minTileX + 1;
    }

    public int tileHeight() {
        return maxTileY - minTileY + 1;
    }

    /**
     * Derives one rectangle per corner by splitting the map interior (excluding the solid border row
     * and column) into four quadrants. Used when a map JSON omits explicit spawn regions.
     */
    public static Map<SpawnRegion, SpawnRegionDefinition> defaultCorners(int width, int height) {
        int innerMinX = Math.min(1, width - 1);
        int innerMinY = Math.min(1, height - 1);
        int innerMaxX = Math.max(innerMinX, width - 2);
        int innerMaxY = Math.max(innerMinY, height - 2);
        int midX = (innerMinX + innerMaxX) / 2;
        int midY = (innerMinY + innerMaxY) / 2;
        int rightStartX = Math.min(midX + 1, innerMaxX);
        int bottomStartY = Math.min(midY + 1, innerMaxY);

        Map<SpawnRegion, SpawnRegionDefinition> regions = new EnumMap<>(SpawnRegion.class);
        regions.put(SpawnRegion.TOP_LEFT,
                new SpawnRegionDefinition(SpawnRegion.TOP_LEFT, innerMinX, innerMinY, midX, midY));
        regions.put(SpawnRegion.TOP_RIGHT,
                new SpawnRegionDefinition(SpawnRegion.TOP_RIGHT, rightStartX, innerMinY, innerMaxX, midY));
        regions.put(SpawnRegion.BOTTOM_LEFT,
                new SpawnRegionDefinition(SpawnRegion.BOTTOM_LEFT, innerMinX, bottomStartY, midX, innerMaxY));
        regions.put(SpawnRegion.BOTTOM_RIGHT,
                new SpawnRegionDefinition(SpawnRegion.BOTTOM_RIGHT, rightStartX, bottomStartY, innerMaxX, innerMaxY));
        return regions;
    }
}
