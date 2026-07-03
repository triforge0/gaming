package com.triforge.games.tankarena.sync;

import com.triforge.engine.sync.ViewerContext;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapLoader;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.map.VisibilityMap;
import com.triforge.games.tankarena.vision.RoomVisionState;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.FullSnapshot;
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

    @Test
    void emitsRemovalWhenEntityMovesIntoBushCover() {
        GameMap map = bushRowMap();
        RoomVisionState visionState = new RoomVisionState(map);
        VisibilityMap fog = visionState.visibilityFor(10L);
        fog.setVisible(0, 1);
        fog.setVisible(3, 1);
        fog.setVisible(5, 1);

        TankArenaInterestFilter filter = new TankArenaInterestFilter(visionState, map, MapConfig.DEFAULT);
        float viewerX = map.tileCenterX(0);
        float viewerY = map.tileCenterY(1);
        float farOpenX = map.tileCenterX(5);
        float bushX = map.tileCenterX(3);
        float bushY = map.tileCenterY(1);

        filter.filterFull(
                FullSnapshot.newBuilder()
                        .addEntities(entityAt(1L, viewerX, viewerY))
                        .addEntities(entityAt(2L, farOpenX, viewerY))
                        .build(),
                new ViewerContext(10L, 1L, viewerX, viewerY));

        DeltaSnapshot filtered = filter.filterDelta(
                DeltaSnapshot.newBuilder().addUpdatedEntities(entityAt(2L, bushX, bushY)).build(),
                new ViewerContext(10L, 1L, viewerX, viewerY));

        assertEquals(0, filtered.getUpdatedEntitiesCount());
        assertTrue(filtered.getRemovedEntityIdsList().contains(2L));
    }

    private static GameMap bushRowMap() {
        return GameMap.builder(7, 3).tileSize(32).tiles(new TileType[]{
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.TREE, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
                TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY,
        }).build();
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
