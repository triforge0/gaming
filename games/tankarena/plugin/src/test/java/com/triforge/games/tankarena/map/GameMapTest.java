package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import org.junit.jupiter.api.Test;

import java.util.EnumMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class GameMapTest {

    @Test
    void builderUsesDefaultSpawnRegionsWhenOmitted() {
        TileType[] tiles = new TileType[4];
        tiles[0] = TileType.EMPTY;

        GameMap map = GameMap.builder(2, 2).tileSize(16).tiles(tiles).build();

        assertEquals(2, map.width());
        assertEquals(2, map.height());
        assertNotNull(map.spawnRegion(SpawnRegion.TOP_LEFT));
        assertTrue(map.headquarters().isEmpty());
    }

    @Test
    void builderAcceptsCustomSpawnRegionsAndHeadquarters() {
        TileType[] tiles = new TileType[9];
        Map<SpawnRegion, SpawnRegionDefinition> regions = new EnumMap<>(SpawnRegion.class);
        regions.put(SpawnRegion.TOP_LEFT, new SpawnRegionDefinition(SpawnRegion.TOP_LEFT, 0, 0, 0, 0));
        HeadquartersDefinition hq = HeadquartersDefinition.rect(Team.RED, 1, 1, 1, 1);

        GameMap map = GameMap.builder(3, 3)
                .tileSize(32)
                .tiles(tiles)
                .spawnRegions(regions)
                .headquarters(java.util.List.of(hq))
                .build();

        assertEquals(regions.get(SpawnRegion.TOP_LEFT), map.spawnRegion(SpawnRegion.TOP_LEFT));
        assertEquals(1, map.headquarters().size());
    }

    @Test
    void placingHeadquartersPaintsBrickWallRingAroundIt() {
        GameMap map = emptyMap(6, 6);
        // A pre-existing wall inside the ring must be preserved, not overwritten.
        map.setTile(1, 1, TileType.STEEL);

        map.replaceTeamHeadquarters(HeadquartersDefinition.rect(Team.RED, 2, 2, 1, 1));

        assertEquals(TileType.HQ, map.tileAt(2, 2));
        assertEquals(TileType.STEEL, map.tileAt(1, 1)); // untouched
        assertEquals(TileType.BRICK, map.tileAt(3, 2)); // ring cell
        assertEquals(TileType.BRICK, map.tileAt(2, 3)); // ring cell
        assertEquals(TileType.BRICK, map.tileAt(1, 2)); // ring cell
    }

    @Test
    void clearingHeadquartersRevertsPaintedWallsButKeepsExistingTerrain() {
        GameMap map = emptyMap(6, 6);
        map.setTile(1, 1, TileType.STEEL);
        map.replaceTeamHeadquarters(HeadquartersDefinition.rect(Team.RED, 2, 2, 1, 1));

        map.clearTeamHeadquarters(Team.RED);

        assertEquals(TileType.EMPTY, map.tileAt(2, 2)); // HQ tile cleared
        assertEquals(TileType.EMPTY, map.tileAt(3, 2)); // painted wall reverted
        assertEquals(TileType.STEEL, map.tileAt(1, 1)); // pre-existing terrain kept
        assertTrue(map.headquarters().isEmpty());
    }

    private static GameMap emptyMap(int width, int height) {
        TileType[] tiles = new TileType[width * height];
        for (int i = 0; i < tiles.length; i++) {
            tiles[i] = TileType.EMPTY;
        }
        return GameMap.builder(width, height).tileSize(32).tiles(tiles).build();
    }

    @Test
    void builderRejectsMismatchedTileArrayLength() {
        assertThrows(IllegalArgumentException.class, () ->
                GameMap.builder(2, 2).tileSize(16).tiles(new TileType[3]).build());
    }

    @Test
    void mapIsFlatByDefaultAndHeightAtIsZero() {
        GameMap map = GameMap.builder(2, 2).tileSize(10).tiles(new TileType[4]).build();

        assertTrue(map.isFlat());
        assertEquals(0f, map.heightAt(5f, 5f));
        assertEquals(0f, map.cellHeight(0, 0));
    }

    @Test
    void heightAtBilinearlyInterpolatesBetweenTileCenters() {
        // 2x2, tileSize 10. Tile centers at (5,5),(15,5),(5,15),(15,15).
        float[] heights = {0f, 10f, 20f, 30f}; // row-major: y0=[0,10], y1=[20,30]
        GameMap map = GameMap.builder(2, 2).tileSize(10).tiles(new TileType[4])
                .heights(heights).build();

        assertTrue(!map.isFlat());
        // Exact tile centers return the cell height.
        assertEquals(0f, map.heightAt(5f, 5f), 1e-4f);
        assertEquals(10f, map.heightAt(15f, 5f), 1e-4f);
        assertEquals(20f, map.heightAt(5f, 15f), 1e-4f);
        assertEquals(30f, map.heightAt(15f, 15f), 1e-4f);
        // Midpoint between (5,5)=0 and (15,5)=10 → 5.
        assertEquals(5f, map.heightAt(10f, 5f), 1e-4f);
        // Center of the map interpolates all four → mean 15.
        assertEquals(15f, map.heightAt(10f, 10f), 1e-4f);
        // Sampling past the edge clamps to the border cell.
        assertEquals(0f, map.heightAt(0f, 0f), 1e-4f);
    }

    @Test
    void builderRejectsMismatchedHeightArrayLength() {
        assertThrows(IllegalArgumentException.class, () ->
                GameMap.builder(2, 2).tileSize(10).tiles(new TileType[4])
                        .heights(new float[3]).build());
    }
}
