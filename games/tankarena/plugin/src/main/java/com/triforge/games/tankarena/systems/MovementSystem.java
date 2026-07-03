package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.CanControlComponent;
import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.OrientationComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.engine.loop.GameLoop;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.world.Heading;
import com.triforge.protocol.proto.Direction;

/**
 * 3D hull movement. The server is authoritative: it accumulates hull yaw and turret
 * pitch from keyboard rotation intent, drives the hull forward/back along its yaw on the
 * XY ground plane, and clamps elevation ({@code z}) to the terrain heightfield.
 *
 * <p>During the 2D→3D parity window it also accepts the legacy 4-way input (Phaser
 * client): a cardinal key snaps the hull yaw to that direction and drives forward, and
 * the legacy {@link DirectionComponent} is kept in sync from the yaw.
 */
public final class MovementSystem implements System {
    private static final float FIXED_DELTA_SECONDS = 1f / GameLoop.TPS;
    /** Hull yaw — ~90°/s (was 180°/s; full turn in ~4 s). */
    private static final float TURN_RATE = (float) Math.toRadians(90.0);
    /** Turret pitch — ~45°/s (was 90°/s). */
    private static final float PITCH_RATE = (float) Math.toRadians(45.0);

    private final GameMap map;

    /** Flat-terrain movement (no elevation follow) — used by unit tests. */
    public MovementSystem() {
        this(null);
    }

    public MovementSystem(GameMap map) {
        this.map = map;
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            moveEntity(index, componentManager);
        }
    }

    private void moveEntity(int entityIndex, ComponentManager componentManager) {
        InputComponent input = componentManager.getAt(entityIndex, InputComponent.class);
        PositionComponent position = componentManager.getAt(entityIndex, PositionComponent.class);
        OrientationComponent orientation = componentManager.getAt(entityIndex, OrientationComponent.class);
        TankComponent tank = componentManager.getAt(entityIndex, TankComponent.class);

        if (input == null || position == null || orientation == null || tank == null) {
            return;
        }

        if (!mayMove(entityIndex, componentManager)) {
            return;
        }

        applyRotation(input, orientation);

        boolean forward = input.moveForward();
        boolean backward = input.moveBackward();
        if (input.hasLegacyMove()) {
            Direction cardinal = resolveLegacyDirection(input);
            if (cardinal != null) {
                orientation.setYaw(Heading.yawForDirection(cardinal));
                forward = true;
            }
        }

        DirectionComponent direction = componentManager.getAt(entityIndex, DirectionComponent.class);
        if (direction != null) {
            direction.set(Heading.nearestCardinal(orientation.yaw()));
        }

        float move = 0f;
        float distance = tank.speed() * FIXED_DELTA_SECONDS;
        if (forward) {
            move += distance;
        }
        if (backward) {
            move -= distance;
        }

        position.savePrevious();
        if (move != 0f) {
            float yaw = orientation.yaw();
            float dx = (float) Math.cos(yaw) * move;
            float dy = (float) Math.sin(yaw) * move;
            float newX = position.x() + dx;
            float newY = position.y() + dy;
            if (canTraverse(position, newX, newY, Math.abs(move))) {
                position.set(newX, newY);
            }
        }
        if (map != null) {
            position.setZ(map.heightAt(position.x(), position.y()));
        }
    }

    /**
     * Blocks horizontal moves onto terrain steeper than 45° (height gain exceeds the
     * horizontal distance travelled), so tanks can't climb cliffs. Flat/no-map = always
     * traversable.
     */
    private boolean canTraverse(PositionComponent from, float toX, float toY, float horizontal) {
        if (map == null || horizontal <= 0f) {
            return true;
        }
        float climb = map.heightAt(toX, toY) - from.z();
        return climb <= horizontal;
    }

    private void applyRotation(InputComponent input, OrientationComponent orientation) {
        float turnStep = TURN_RATE * FIXED_DELTA_SECONDS;
        if (input.turnLeft()) {
            orientation.rotateYaw(-turnStep);
        }
        if (input.turnRight()) {
            orientation.rotateYaw(turnStep);
        }
        float pitchStep = PITCH_RATE * FIXED_DELTA_SECONDS;
        if (input.aimUp()) {
            orientation.adjustPitch(pitchStep);
        }
        if (input.aimDown()) {
            orientation.adjustPitch(-pitchStep);
        }
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

    /** Legacy 4-way resolution: same priority order the 2D game used (UP > DOWN > LEFT > RIGHT). */
    private Direction resolveLegacyDirection(InputComponent input) {
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
