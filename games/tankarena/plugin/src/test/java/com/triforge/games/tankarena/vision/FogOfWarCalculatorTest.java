package com.triforge.games.tankarena.vision;

import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.VisionComponent;
import com.triforge.games.tankarena.map.FogVisibility;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.map.VisibilityMap;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class FogOfWarCalculatorTest {

    @Test
    void revealsOpenTilesWithinRadius() {
        GameMap map = GameMap.builder(5, 5).tileSize(32).tiles(new TileType[]{
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
        }).build();
        RoomVisionState visionState = new RoomVisionState(map);
        FogOfWarCalculator calculator = new FogOfWarCalculator(map, MapConfig.DEFAULT, visionState);

        VisionComponent vision = new VisionComponent(250f, 360f, 3);
        PositionComponent position = new PositionComponent(80f, 80f);
        calculator.recomputePlayer(1L, position, vision);

        var visibility = visionState.visibilityFor(1L);
        assertEquals(FogVisibility.VISIBLE, visibility.cellAt(2, 2));
        assertTrue(visibility.isVisible(1, 2));
    }

    @Test
    void solidWallShadowsEverythingBehindIt() {
        // 5x5 open map with a full STEEL column at x=2. Every ray to x>=3 must cross it.
        TileType[] tiles = new TileType[5 * 5];
        Arrays.fill(tiles, TileType.EMPTY);
        for (int y = 0; y < 5; y++) {
            tiles[y * 5 + 2] = TileType.STEEL;
        }
        GameMap map = GameMap.builder(5, 5).tileSize(32).tiles(tiles).build();
        RoomVisionState visionState = new RoomVisionState(map);
        FogOfWarCalculator calculator = new FogOfWarCalculator(map, MapConfig.DEFAULT, visionState);

        VisionComponent vision = new VisionComponent(250f, 360f, 5);
        PositionComponent position = new PositionComponent(16f, 80f); // centre of tile (0, 2)
        calculator.recomputePlayer(1L, position, vision);

        VisibilityMap fog = visionState.visibilityFor(1L);
        assertTrue(fog.isVisible(0, 2), "observer tile is visible");
        assertTrue(fog.isVisible(1, 2), "open tile before the wall is visible");
        assertTrue(fog.isVisible(2, 2), "the wall tile itself is visible");
        assertFalse(fog.isVisible(3, 2), "tile behind the wall is shadowed");
        assertFalse(fog.isVisible(4, 2), "far tile behind the wall is shadowed");
        assertFalse(fog.isVisible(3, 0), "whole region behind the wall column is hidden");
        assertFalse(fog.isVisible(4, 4), "whole region behind the wall column is hidden");
    }
}
