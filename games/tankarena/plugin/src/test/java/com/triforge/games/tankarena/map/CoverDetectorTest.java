package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.vision.RoomVisionState;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class CoverDetectorTest {

    private static final MapConfig CONFIG = MapConfig.DEFAULT;

    @Test
    void openTileInVisibleFogIsNotHidden() {
        GameMap map = flatMap(5, 5, tileGrid(
                ".....",
                ".....",
                "..T..",
                ".....",
                "....."
        ));
        VisibilityMap fog = fogFor(map);
        fog.setVisible(0, 2);
        fog.setVisible(4, 2);

        assertFalse(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG,
                cx(map, 0, 2), cy(map, 0, 2),
                cx(map, 4, 2), cy(map, 4, 2)
        ));
    }

    @Test
    void tankInBushHiddenFromFarAwayEvenWithClearLineOfSight() {
        GameMap map = flatMap(7, 3, tileGrid(
                ".......",
                "...T...",
                "......."
        ));
        VisibilityMap fog = fogFor(map);
        fog.setVisible(3, 1);

        float viewerX = cx(map, 0, 1);
        float viewerY = cy(map, 0, 1);
        float targetX = cx(map, 3, 1);
        float targetY = cy(map, 3, 1);

        assertTrue(LineOfSight.hasWorldLineOfSight(map, viewerX, viewerY, targetX, targetY));
        assertTrue(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG, viewerX, viewerY, targetX, targetY
        ));
    }

    @Test
    void tankInBushRevealedWithinCoverRadius() {
        GameMap map = flatMap(3, 3, tileGrid(
                "...",
                ".T.",
                "..."
        ));
        VisibilityMap fog = fogFor(map);
        fog.setVisible(1, 1);

        assertFalse(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG,
                cx(map, 1, 0), cy(map, 1, 0),
                cx(map, 1, 1), cy(map, 1, 1)
        ));
    }

    @Test
    void targetOnOpenTileInUnexploredFogIsHidden() {
        GameMap map = flatMap(5, 1, tileGrid("..T.."));
        VisibilityMap fog = fogFor(map);
        fog.setVisible(0, 0);

        assertTrue(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG,
                cx(map, 0, 0), cy(map, 0, 0),
                cx(map, 4, 0), cy(map, 4, 0)
        ));
    }

    @Test
    void targetOutsideFogHiddenUnlessWithinRevealRangeWithLineOfSight() {
        GameMap map = flatMap(5, 1, tileGrid("....."));
        VisibilityMap fog = fogFor(map);
        fog.setVisible(0, 0);

        assertTrue(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG,
                cx(map, 0, 0), cy(map, 0, 0),
                cx(map, 4, 0), cy(map, 4, 0)
        ));
    }

    @Test
    void interestFilterScenarioHidesBushTarget() {
        GameMap map = GameMap.builder(7, 3).tileSize(32).tiles(new TileType[]{
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.TREE, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
        }).build();
        VisibilityMap fog = fogFor(map);
        fog.setVisible(0, 1);
        fog.setVisible(3, 1);
        fog.setVisible(5, 1);

        assertFalse(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG,
                map.tileCenterX(0), map.tileCenterY(1),
                map.tileCenterX(5), map.tileCenterY(1)
        ));
        assertTrue(CoverDetector.isEntityHiddenByCover(
                fog, map, CONFIG,
                map.tileCenterX(0), map.tileCenterY(1),
                map.tileCenterX(3), map.tileCenterY(1)
        ));
    }

    private static VisibilityMap fogFor(GameMap map) {
        return new RoomVisionState(map).visibilityFor(1L);
    }

    private static float cx(GameMap map, int tx, int ty) {
        return map.tileCenterX(tx);
    }

    private static float cy(GameMap map, int tx, int ty) {
        return map.tileCenterY(ty);
    }

    private static GameMap flatMap(int width, int height, TileType[] tiles) {
        return GameMap.builder(width, height).tileSize(32).tiles(tiles).build();
    }

    private static TileType[] tileGrid(String... rows) {
        int height = rows.length;
        int width = rows[0].length();
        TileType[] tiles = new TileType[width * height];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                tiles[y * width + x] = switch (rows[y].charAt(x)) {
                    case 'T' -> TileType.TREE;
                    case 'S' -> TileType.STEEL;
                    default -> TileType.EMPTY;
                };
            }
        }
        return tiles;
    }
}
