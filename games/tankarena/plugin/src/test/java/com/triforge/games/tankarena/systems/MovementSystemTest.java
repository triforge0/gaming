package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.SystemScheduler;
import com.triforge.games.tankarena.world.WorldBounds;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
