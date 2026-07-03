package com.triforge.games.tankarena.systems;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.tankarena.components.OrientationComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Regression tests for the "tank gets stuck" bug: full-move rejection dead-stopped tanks
 * against walls and permanently trapped them when wedged in the map's one-tile-wide gaps.
 */
final class MapCollisionSystemTest {

    private static final int TILE = 32;

    private EcsWorld world;
    private EntityManager entities;
    private ComponentManager components;

    private void setUp() {
        world = new EcsWorld();
        entities = world.entityManager();
        components = world.componentManager();
    }

    /** Flat map of the given tile grid; {@code brick} coordinates become BRICK, rest EMPTY. */
    private GameMap map(int w, int h, int[]... bricks) {
        TileType[] tiles = new TileType[w * h];
        Arrays.fill(tiles, TileType.EMPTY);
        for (int[] b : bricks) {
            tiles[b[1] * w + b[0]] = TileType.BRICK;
        }
        return GameMap.builder(w, h).tileSize(TILE).tiles(tiles).build();
    }

    private Entity tankAt(float px, float py, float x, float y) {
        Entity tank = entities.create();
        PositionComponent pos = new PositionComponent(px, py, 0f);
        pos.savePrevious();
        pos.set(x, y);
        components.add(tank, pos);
        components.add(tank, new TankComponent());
        return tank;
    }

    @Test
    void slidesAlongWallWhenOnlyOneAxisIsBlocked() {
        setUp();
        // BRICK block occupies tile (2,2) → world x,y in [64,96].
        GameMap gameMap = map(4, 4, new int[] {2, 2});
        MapCollisionSystem system = new MapCollisionSystem(gameMap, MapConfig.DEFAULT);

        // Move diagonally from an open cell into the block: the +X part is clear, the +Y
        // part drives into the brick. Expect the tank to keep sliding along X.
        Entity tank = tankAt(48f, 48f, 70f, 80f);
        system.update(0L, entities, components);

        PositionComponent pos = components.get(tank, PositionComponent.class);
        assertEquals(70f, pos.x(), 0.001f, "should keep the clear X movement");
        assertEquals(48f, pos.y(), 0.001f, "should cancel the blocked Y movement");
    }

    @Test
    void embeddedTankIsNotTrappedAndCanMoveOut() {
        setUp();
        GameMap gameMap = map(4, 4, new int[] {2, 2});
        MapCollisionSystem system = new MapCollisionSystem(gameMap, MapConfig.DEFAULT);

        // Both previous and new positions sit inside the brick (wedged): the tank must be
        // allowed to move rather than reverted to an equally-blocked cell.
        Entity tank = tankAt(80f, 80f, 85f, 80f);
        system.update(0L, entities, components);

        PositionComponent pos = components.get(tank, PositionComponent.class);
        assertEquals(85f, pos.x(), 0.001f, "embedded tank should not be trapped");
    }

    @Test
    void headOnMoveIntoWallIsStillBlocked() {
        setUp();
        GameMap gameMap = map(4, 4, new int[] {2, 2});
        MapCollisionSystem system = new MapCollisionSystem(gameMap, MapConfig.DEFAULT);

        // Straight +Y into the brick from an open cell, no lateral component → fully reverted.
        Entity tank = tankAt(80f, 40f, 80f, 60f);
        system.update(0L, entities, components);

        PositionComponent pos = components.get(tank, PositionComponent.class);
        assertEquals(80f, pos.x(), 0.001f);
        assertEquals(40f, pos.y(), 0.001f, "head-on move into a wall reverts");
    }

    @Test
    void drivesThroughAOneTileGapWithoutGettingStuck() {
        setUp();
        // Vertical corridor: columns 0 and 2 are solid BRICK, column 1 is the open slot.
        int w = 3;
        int h = 8;
        int[][] bricks = new int[(w - 1) * h][];
        int i = 0;
        for (int ty = 0; ty < h; ty++) {
            bricks[i++] = new int[] {0, ty};
            bricks[i++] = new int[] {2, ty};
        }
        GameMap gameMap = map(w, h, bricks);

        MovementSystem movement = new MovementSystem(gameMap);
        MapCollisionSystem collision = new MapCollisionSystem(gameMap, MapConfig.DEFAULT);

        // Slightly off-centre (x=50, slot centre is 48) — enough to jam the old 28px hull.
        Entity tank = TankEntityFactory.tank(entities, components)
                .at(50f, 40f)
                .direction(Direction.UP)
                .withInput(InputCommand.newBuilder().setMoveForward(true).build())
                .onTerrain(gameMap)
                .build();
        // Head straight down the corridor (+Y).
        components.get(tank, OrientationComponent.class).setYaw((float) (Math.PI / 2));

        for (int tick = 0; tick < 80; tick++) {
            movement.update(tick, entities, components);
            collision.update(tick, entities, components);
        }

        PositionComponent pos = components.get(tank, PositionComponent.class);
        assertTrue(pos.y() > 150f, "tank should traverse the slot, got y=" + pos.y());
        assertTrue(pos.x() > 32f && pos.x() < 64f, "tank should stay inside the slot, got x=" + pos.x());
    }
}
