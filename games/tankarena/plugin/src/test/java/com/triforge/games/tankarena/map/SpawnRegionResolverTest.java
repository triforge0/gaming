package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class SpawnRegionResolverTest {

    private static final MapConfig CONFIG = MapConfig.DEFAULT;
    private static final int TILE = 10;

    @Test
    void allFourCornersResolveToNonBlockingTilesInsideTheirRegion() {
        GameMap map = MapLoader.loadDefault();
        SpawnRegionResolver resolver = new SpawnRegionResolver(new Random(1));

        for (SpawnRegion region : new SpawnRegion[]{
                SpawnRegion.TOP_LEFT, SpawnRegion.TOP_RIGHT,
                SpawnRegion.BOTTOM_LEFT, SpawnRegion.BOTTOM_RIGHT}) {
            SpawnRegionResolver.SpawnPoint point = resolver.resolve(map, region, CONFIG);
            int tileX = map.worldToTileX(point.x());
            int tileY = map.worldToTileY(point.y());

            assertFalse(map.tileAt(tileX, tileY).blocksTank(CONFIG),
                    region + " spawned on a blocking tile");
            assertTrue(map.spawnRegion(region).contains(tileX, tileY),
                    region + " spawned outside its rectangle at (" + tileX + "," + tileY + ")");
        }
    }

    @Test
    void blockedTilesAreNeverChosen() {
        // 5x5: only tile (1,1) is open inside the TOP_LEFT region; everything else is brick.
        GameMap map = mapWithOpenTiles(point(1, 1));
        SpawnRegionResolver resolver = new SpawnRegionResolver(new Random(42));

        for (int i = 0; i < 50; i++) {
            SpawnRegionResolver.SpawnPoint p = resolver.resolve(map, SpawnRegion.TOP_LEFT, CONFIG);
            assertTrue(p.x() == map.tileCenterX(1) && p.y() == map.tileCenterY(1),
                    "expected the only open tile (1,1), got (" + p.x() + "," + p.y() + ")");
        }
    }

    @Test
    void fallsBackOutsideRegionWhenRegionIsFull() {
        // The TOP_LEFT region (tiles 1..2) is fully brick; (3,3) is the only open tile on the map.
        GameMap map = mapWithOpenTiles(point(3, 3));
        SpawnRegionResolver resolver = new SpawnRegionResolver(new Random(7));

        SpawnRegionResolver.SpawnPoint p = resolver.resolve(map, SpawnRegion.TOP_LEFT, CONFIG);

        assertNotNull(p);
        int tileX = map.worldToTileX(p.x());
        int tileY = map.worldToTileY(p.y());
        assertFalse(map.tileAt(tileX, tileY).blocksTank(CONFIG), "fallback landed on a blocking tile");
    }

    @Test
    void unspecifiedRegionResolvesToNonBlockingInteriorTile() {
        GameMap map = MapLoader.loadDefault();
        SpawnRegionResolver resolver = new SpawnRegionResolver(new Random(3));

        SpawnRegionResolver.SpawnPoint p = resolver.resolve(map, SpawnRegion.UNSPECIFIED, CONFIG);

        int tileX = map.worldToTileX(p.x());
        int tileY = map.worldToTileY(p.y());
        assertTrue(map.inBounds(tileX, tileY));
        assertFalse(map.tileAt(tileX, tileY).blocksTank(CONFIG));
    }

    /** 5x5 map, STEEL border, interior all BRICK except the given tiles set to EMPTY. */
    private static GameMap mapWithOpenTiles(int[]... openTiles) {
        int size = 5;
        TileType[] tiles = new TileType[size * size];
        Arrays.fill(tiles, TileType.BRICK);
        for (int y = 0; y < size; y++) {
            for (int x = 0; x < size; x++) {
                if (x == 0 || y == 0 || x == size - 1 || y == size - 1) {
                    tiles[y * size + x] = TileType.STEEL;
                }
            }
        }
        for (int[] open : openTiles) {
            tiles[open[1] * size + open[0]] = TileType.EMPTY;
        }

        Map<SpawnRegion, SpawnRegionDefinition> regions = new EnumMap<>(SpawnRegion.class);
        regions.put(SpawnRegion.TOP_LEFT, new SpawnRegionDefinition(SpawnRegion.TOP_LEFT, 1, 1, 2, 2));
        return GameMap.builder(size, size).tileSize(TILE).tiles(tiles).spawnRegions(regions).build();
    }

    private static int[] point(int x, int y) {
        return new int[]{x, y};
    }
}
