package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.OrientationComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.SystemScheduler;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.world.WorldBounds;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class MovementSystemTest {

    private static final float FIXED_DELTA = TankComponent.DEFAULT_SPEED / 60f;
    private static final WorldBounds TEST_BOUNDS = new WorldBounds(800f, 600f);

    @Test
    void movesUpDeterministically() {
        PositionComponent position = runSingleTick(Direction.UP, 400f, 300f);

        assertEquals(300f - FIXED_DELTA, position.y(), 0.001f);
        assertEquals(400f, position.x(), 0.001f);
    }

    @Test
    void movesRightDeterministically() {
        PositionComponent position = runSingleTick(Direction.RIGHT, 400f, 300f);

        assertEquals(400f + FIXED_DELTA, position.x(), 0.001f);
        assertEquals(300f, position.y(), 0.001f);
    }

    @Test
    void revertsMovementAtWorldBoundary() {
        PositionComponent position = runSingleTickWithCollision(
                Direction.UP,
                TEST_BOUNDS.width() / 2f,
                WorldBounds.TANK_HALF_SIZE
        );

        assertEquals(WorldBounds.TANK_HALF_SIZE, position.y(), 0.001f);
    }

    @Test
    void ignoresConflictingDirectionsUsingPriorityOrder() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new MovementSystem());

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(400f, 300f)
                .direction(Direction.UP)
                .withInput()
                .build();
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder()
                .setMoveUp(true)
                .setMoveRight(true)
                .build());

        scheduler.update(1, entityManager, componentManager);

        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        DirectionComponent direction = componentManager.get(tank, DirectionComponent.class);

        assertEquals(Direction.UP, direction.direction());
        assertEquals(300f - FIXED_DELTA, position.y(), 0.001f);
        assertEquals(400f, position.x(), 0.001f);
    }

    @Test
    void turnRightAccumulatesYawAndMovesForwardAlongIt() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new MovementSystem());

        // Face RIGHT (yaw 0). Turn right one tick, then it should move along the new yaw.
        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(400f, 300f)
                .direction(Direction.RIGHT)
                .withInput()
                .build();
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setTurnRight(true).setMoveForward(true).build());

        scheduler.update(1, entityManager, componentManager);

        OrientationComponent orientation = componentManager.get(tank, OrientationComponent.class);
        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        // 180°/s * (1/60)s = 3° turned right → yaw slightly positive (toward +Y/DOWN).
        assertEquals(Math.toRadians(3.0), orientation.yaw(), 1e-4);
        // Moved forward along the new yaw: mostly +X, a touch +Y.
        assertTrue(position.x() > 400f);
        assertTrue(position.y() > 300f);
    }

    @Test
    void aimUpRaisesPitchClampedToMax() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new MovementSystem());

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(400f, 300f).direction(Direction.UP).withInput().build();
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setAimUp(true).build());

        // Hold aim-up for many ticks; pitch must saturate at MAX_PITCH, not exceed it.
        for (int i = 0; i < 300; i++) {
            scheduler.update(i, entityManager, componentManager);
        }
        OrientationComponent orientation = componentManager.get(tank, OrientationComponent.class);
        assertEquals(OrientationComponent.MAX_PITCH, orientation.pitch(), 1e-5);
    }

    @Test
    void followsTerrainElevationWhenMapProvided() {
        // Sloped 3x1 map: heights rise left→right. tileSize 10, centers x=5,15,25.
        float[] heights = {0f, 10f, 20f};
        GameMap map = GameMap.builder(3, 1).tileSize(10)
                .tiles(new TileType[]{TileType.EMPTY, TileType.EMPTY, TileType.EMPTY})
                .heights(heights).build();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new MovementSystem(map));

        // Start at the left tile center (x=5, height 0), face RIGHT, drive forward.
        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(5f, 5f).direction(Direction.RIGHT).withInput().build();
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setMoveForward(true).build());

        scheduler.update(1, entityManager, componentManager);

        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        // Moved a bit toward higher ground → elevation z should have risen above 0.
        assertTrue(position.x() > 5f);
        assertTrue(position.z() > 0f, "elevation should follow the rising terrain");
        assertEquals(map.heightAt(position.x(), position.y()), position.z(), 1e-4f);
    }

    @Test
    void cannotClimbTerrainSteeperThan45Degrees() {
        // Cliff: neighbouring cell is 1000 higher — far steeper than the tank can climb.
        float[] heights = {0f, 1000f};
        GameMap map = GameMap.builder(2, 1).tileSize(10)
                .tiles(new TileType[]{TileType.EMPTY, TileType.EMPTY})
                .heights(heights).build();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new MovementSystem(map));

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(5f, 5f).direction(Direction.RIGHT).withInput().build();
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setMoveForward(true).build());

        scheduler.update(1, entityManager, componentManager);

        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        // Horizontal move blocked by the cliff; tank stays put.
        assertEquals(5f, position.x(), 0.001f);
    }

    private PositionComponent runSingleTick(Direction moveDirection, float startX, float startY) {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new MovementSystem());

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(startX, startY)
                .direction(Direction.UP)
                .withInput()
                .build();

        InputCommand.Builder inputBuilder = InputCommand.newBuilder();
        switch (moveDirection) {
            case UP -> inputBuilder.setMoveUp(true);
            case DOWN -> inputBuilder.setMoveDown(true);
            case LEFT -> inputBuilder.setMoveLeft(true);
            case RIGHT -> inputBuilder.setMoveRight(true);
        }

        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(inputBuilder.build());

        scheduler.update(1, entityManager, componentManager);
        return componentManager.get(tank, PositionComponent.class);
    }

    private PositionComponent runSingleTickWithCollision(Direction moveDirection, float startX, float startY) {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler()
                .add(new MovementSystem())
                .add(new WorldBoundsCollisionSystem(TEST_BOUNDS));

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(startX, startY)
                .direction(Direction.UP)
                .withInput()
                .build();

        InputCommand.Builder inputBuilder = InputCommand.newBuilder();
        switch (moveDirection) {
            case UP -> inputBuilder.setMoveUp(true);
            case DOWN -> inputBuilder.setMoveDown(true);
            case LEFT -> inputBuilder.setMoveLeft(true);
            case RIGHT -> inputBuilder.setMoveRight(true);
        }

        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(inputBuilder.build());

        scheduler.update(1, entityManager, componentManager);
        return componentManager.get(tank, PositionComponent.class);
    }
}
