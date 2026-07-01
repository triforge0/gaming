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
    void builderRejectsMismatchedTileArrayLength() {
        assertThrows(IllegalArgumentException.class, () ->
                GameMap.builder(2, 2).tileSize(16).tiles(new TileType[3]).build());
    }
}
