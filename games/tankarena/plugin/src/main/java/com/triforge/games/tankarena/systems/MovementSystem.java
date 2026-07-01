package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.CanControlComponent;
import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.engine.loop.GameLoop;
import com.triforge.protocol.proto.Direction;

public final class MovementSystem implements System {
    private static final float FIXED_DELTA_SECONDS = 1f / GameLoop.TPS;

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            moveEntity(index, componentManager);
        }
    }

    private void moveEntity(int entityIndex, ComponentManager componentManager) {
        InputComponent input = componentManager.getAt(entityIndex, InputComponent.class);
        PositionComponent position = componentManager.getAt(entityIndex, PositionComponent.class);
        DirectionComponent direction = componentManager.getAt(entityIndex, DirectionComponent.class);
        TankComponent tank = componentManager.getAt(entityIndex, TankComponent.class);

        if (input == null || position == null || direction == null || tank == null) {
            return;
        }

        if (!mayMove(entityIndex, componentManager)) {
            return;
        }

        Direction moveDirection = resolveMoveDirection(input);
        if (moveDirection == null) {
            return;
        }

        direction.set(moveDirection);
        float distance = tank.speed() * FIXED_DELTA_SECONDS;
        float deltaX = 0f;
        float deltaY = 0f;

        switch (moveDirection) {
            case UP -> deltaY = -distance;
            case DOWN -> deltaY = distance;
            case LEFT -> deltaX = -distance;
            case RIGHT -> deltaX = distance;
            default -> {
                return;
            }
        }

        position.savePrevious();
        position.set(position.x() + deltaX, position.y() + deltaY);
    }

    private boolean mayMove(int entityIndex, ComponentManager componentManager) {
        PlayerComponent player = componentManager.getAt(entityIndex, PlayerComponent.class);
        if (player != null && !player.isAlive()) {
            return false;
        }

        CanControlComponent control = componentManager.getAt(entityIndex, CanControlComponent.class);
        if (control != null && !control.canControl()) {
            return false;
        }

        return true;
    }

    private Direction resolveMoveDirection(InputComponent input) {
        if (input.moveUp()) {
            return Direction.UP;
        }
        if (input.moveDown()) {
            return Direction.DOWN;
        }
        if (input.moveLeft()) {
            return Direction.LEFT;
        }
        if (input.moveRight()) {
            return Direction.RIGHT;
        }
        return null;
    }
}
