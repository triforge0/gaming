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

    private static GameMap createMap(TileType[] tiles, int width, int height) {
        return GameMap.builder(width, height).tileSize(32).tiles(tiles).build();
    }
}
