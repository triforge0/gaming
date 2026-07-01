package com.triforge.games.tankarena.sync;

import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapLoader;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.vision.RoomVisionState;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.PositionComponentProto;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class TankArenaInterestFilterTest {

    @Test
    void filtersEntitiesOutsideViewRadius() {
        GameMap map = MapLoader.loadDefault();
        TankArenaInterestFilter filter = newFilter(map);

        DeltaSnapshot delta = DeltaSnapshot.newBuilder()
                .addUpdatedEntities(entityAt(1L, 100f, 100f))
                .addUpdatedEntities(entityAt(2L, 900f, 500f))
                .build();

        DeltaSnapshot filtered = filter.filterDeltaByRadius(delta, 100f, 100f, 1L);

        assertEquals(1, filtered.getUpdatedEntitiesCount());
        assertEquals(1L, filtered.getUpdatedEntities(0).getEntityId());
    }

    @Test
    void alwaysIncludesViewerEntity() {
        GameMap map = MapLoader.loadDefault();
        TankArenaInterestFilter filter = newFilter(map);

        DeltaSnapshot delta = DeltaSnapshot.newBuilder()
                .addUpdatedEntities(entityAt(99L, 900f, 500f))
                .build();

        DeltaSnapshot filtered = filter.filterDeltaByRadius(delta, 100f, 100f, 99L);

        assertEquals(1, filtered.getUpdatedEntitiesCount());
        assertEquals(99L, filtered.getUpdatedEntities(0).getEntityId());
    }

    @Test
    void loadsArenaMapFromJson() {
        GameMap map = MapLoader.loadDefault();

        assertEquals(37, map.width());
        assertEquals(27, map.height());
        assertEquals(32, map.tileSize());
        assertEquals(TileType.STEEL, map.tileAt(0, 0));
        assertEquals(TileType.BRICK, map.tileAt(1, 1));
        assertEquals(TileType.TREE, map.tileAt(4, 4));
        assertEquals(TileType.WATER, map.tileAt(map.width() / 2, map.height() / 2));
    }

    private static TankArenaInterestFilter newFilter(GameMap map) {
        return new TankArenaInterestFilter(new RoomVisionState(map), map, MapConfig.DEFAULT);
    }

    private EntityProto entityAt(long id, float x, float y) {
        return EntityProto.newBuilder()
                .setEntityId(id)
                .setPosition(PositionComponentProto.newBuilder().setX(x).setY(y).build())
                .build();
    }
}
