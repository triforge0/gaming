package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Guards the default arena layout: symmetry, spawn safety, and central contested features. */
final class ArenaMapLayoutTest {

    private static final MapConfig CONFIG = MapConfig.DEFAULT;

    @Test
    void defaultArenaIsHorizontallyAndVerticallySymmetric() {
        GameMap map = MapLoader.loadDefault();

        for (int y = 1; y < map.height() - 1; y++) {
            for (int x = 1; x < map.width() - 1; x++) {
                if (map.tileAt(x, y) == TileType.HQ) {
                    continue;
                }
                assertEquals(
                        map.tileAt(x, y),
                        map.tileAt(map.width() - 1 - x, y),
                        "horizontal asymmetry at (" + x + "," + y + ")"
                );
            }
        }

        for (int y = 3; y < map.height() / 2; y++) {
            int mirrorY = map.height() - 1 - y;
            for (int x = 1; x < map.width() - 1; x++) {
                if (map.tileAt(x, y) == TileType.HQ || map.tileAt(x, mirrorY) == TileType.HQ) {
                    continue;
                }
                assertEquals(
                        map.tileAt(x, y),
                        map.tileAt(x, mirrorY),
                        "vertical asymmetry at (" + x + "," + y + ")"
                );
            }
        }
    }

    @Test
    void eachSpawnCornerHasMultipleOpenTiles() {
        GameMap map = MapLoader.loadDefault();

        for (SpawnRegion region : SpawnRegion.values()) {
            if (region == SpawnRegion.UNSPECIFIED) {
                continue;
            }
            SpawnRegionDefinition bounds = map.spawnRegion(region);
            int spawnable = 0;
            for (int tileY = bounds.minTileY(); tileY <= bounds.maxTileY(); tileY++) {
                for (int tileX = bounds.minTileX(); tileX <= bounds.maxTileX(); tileX++) {
                    if (!map.tileAt(tileX, tileY).blocksTank(CONFIG)) {
                        spawnable++;
                    }
                }
            }
            assertTrue(spawnable >= 20,
                    region + " should offer at least 20 spawnable tiles for 5v5, got " + spawnable);
        }
    }

    @Test
    void centerHasWaterTreesAndDestructibleBrick() {
        GameMap map = MapLoader.loadDefault();
        int centerX = map.width() / 2;
        int centerY = map.height() / 2;

        assertEquals(TileType.WATER, map.tileAt(centerX, centerY));
        assertTrue(countTilesNear(map, centerX, centerY, 8, TileType.TREE) >= 4);
        assertTrue(countTilesNear(map, centerX, centerY, 6, TileType.BRICK) >= 8);
        assertTrue(countTilesNear(map, centerX, centerY, 10, TileType.STEEL) >= 4);
    }

    private static int countTilesNear(GameMap map, int centerX, int centerY, int radius, TileType type) {
        int count = 0;
        for (int y = centerY - radius; y <= centerY + radius; y++) {
            for (int x = centerX - radius; x <= centerX + radius; x++) {
                if (map.inBounds(x, y) && map.tileAt(x, y) == type) {
                    count++;
                }
            }
        }
        return count;
    }
}
