package com.triforge.games.tankarena.map;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class LineOfSightTest {

    @Test
    void wallBlocksVisionBetweenTiles() {
        GameMap map = createMap(new TileType[]{
                TileType.EMPTY, TileType.EMPTY, TileType.STEEL, TileType.EMPTY, TileType.EMPTY,
        }, 5, 1);

        assertFalse(LineOfSight.hasTileLineOfSight(map, 0, 0, 4, 0));
        assertTrue(LineOfSight.hasTileLineOfSight(map, 0, 0, 1, 0));
    }

    @Test
    void coverAttenuatesVisionAlongRay() {
        GameMap map = createMap(new TileType[]{
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                TileType.EMPTY, TileType.TREE, TileType.EMPTY,
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
        }, 3, 3);

        assertFalse(LineOfSight.hasTileLineOfSight(map, 0, 1, 2, 1));
    }

    @Test
    void tallTerrainBetweenTilesBlocks3dLineOfSight() {
        // Flat tiles, but the middle cell is a tall hill (height 100).
        GameMap map = GameMap.builder(5, 1).tileSize(32)
                .tiles(new TileType[]{
                        TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                })
                .heights(new float[]{0f, 0f, 100f, 0f, 0f})
                .build();

        // Two ground observers (eye height 14) can't see over the 100-tall ridge.
        assertFalse(LineOfSight.hasTileLineOfSight3D(map, 0, 0, 14f, 4, 0, 14f));
        // Same geometry ignoring elevation would report clear sight.
        assertTrue(LineOfSight.hasTileLineOfSight(map, 0, 0, 4, 0));
    }

    @Test
    void lowMoundDoesNotBlock3dLineOfSight() {
        GameMap map = GameMap.builder(5, 1).tileSize(32)
                .tiles(new TileType[]{
                        TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                })
                .heights(new float[]{0f, 0f, 5f, 0f, 0f}) // small bump below eye height
                .build();

        assertTrue(LineOfSight.hasTileLineOfSight3D(map, 0, 0, 14f, 4, 0, 14f));
    }

    private static GameMap createMap(TileType[] tiles, int width, int height) {
        return GameMap.builder(width, height).tileSize(32).tiles(tiles).build();
    }
}
