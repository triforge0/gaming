package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.CanControlComponent;
import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.OrientationComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.components.VisionComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.engine.loop.GameLoop;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.LineOfSight;
import com.triforge.games.tankarena.match.Team;
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
    /** Lock-on reach when the tank has no vision component (world units). */
    private static final float DEFAULT_LOCK_RANGE = 600f;

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
            moveEntity(index, entityManager, componentManager);
        }
    }

    private void moveEntity(int entityIndex, EntityManager entityManager, ComponentManager componentManager) {
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

        // Aim assist: while the lock key is held, auto-steer yaw + pitch toward the nearest
        // visible enemy. Falls back to manual rotation when nothing lockable is in sight.
        PositionComponent lockTarget = input.lockTarget()
                ? findNearestVisibleEnemy(entityIndex, position, entityManager, componentManager)
                : null;
        if (lockTarget != null) {
            steerToward(orientation, position, lockTarget);
        } else {
            applyRotation(input, orientation);
        }

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

    /**
     * Nearest live enemy tank the shooter can currently see (within lock range and with a
     * clear line of sight), or {@code null} if none. Only players on an opposing playable
     * team are eligible, so the assist never reveals or targets hidden/friendly tanks.
     */
    private PositionComponent findNearestVisibleEnemy(
            int shooterIndex,
            PositionComponent shooterPos,
            EntityManager entityManager,
            ComponentManager componentManager
    ) {
        PlayerComponent shooter = componentManager.getAt(shooterIndex, PlayerComponent.class);
        if (shooter == null || !shooter.team().isPlayable()) {
            return null;
        }
        VisionComponent vision = componentManager.getAt(shooterIndex, VisionComponent.class);
        float range = vision != null ? vision.radiusWorld() : DEFAULT_LOCK_RANGE;
        float rangeSq = range * range;

        PositionComponent nearest = null;
        float nearestSq = Float.MAX_VALUE;
        for (int index = 0; index < entityManager.count(); index++) {
            if (index == shooterIndex) {
                continue;
            }
            PlayerComponent target = componentManager.getAt(index, PlayerComponent.class);
            if (target == null || !target.isAlive() || target.team() == shooter.team()) {
                continue;
            }
            PositionComponent pos = componentManager.getAt(index, PositionComponent.class);
            if (pos == null) {
                continue;
            }
            float dx = pos.x() - shooterPos.x();
            float dy = pos.y() - shooterPos.y();
            float distSq = dx * dx + dy * dy;
            if (distSq > rangeSq || distSq >= nearestSq) {
                continue;
            }
            if (map != null
                    && !LineOfSight.hasWorldLineOfSight(map, shooterPos.x(), shooterPos.y(), pos.x(), pos.y())) {
                continue;
            }
            nearest = pos;
            nearestSq = distSq;
        }
        return nearest;
    }

    /** Rotates the hull yaw and turret pitch toward {@code target}, capped by the turn rates. */
    private void steerToward(OrientationComponent orientation, PositionComponent from, PositionComponent target) {
        float desiredYaw = (float) Math.atan2(target.y() - from.y(), target.x() - from.x());
        orientation.setYaw(approach(orientation.yaw(), desiredYaw, TURN_RATE * FIXED_DELTA_SECONDS, true));

        // Target and muzzle both sit ~TANK_HALF_HEIGHT above their base z, so that offset
        // cancels and the base-z delta gives the pitch to the target's centre.
        float horizontal = (float) Math.hypot(target.x() - from.x(), target.y() - from.y());
        float desiredPitch = (float) Math.atan2(target.z() - from.z(), Math.max(1f, horizontal));
        desiredPitch = Math.clamp(desiredPitch, OrientationComponent.MIN_PITCH, OrientationComponent.MAX_PITCH);
        orientation.setPitch(approach(orientation.pitch(), desiredPitch, PITCH_RATE * FIXED_DELTA_SECONDS, false));
    }

    /** Moves {@code from} toward {@code to} by at most {@code step}; wraps as an angle when asked. */
    private static float approach(float from, float to, float step, boolean wrapAngle) {
        float delta = to - from;
        if (wrapAngle) {
            while (delta > (float) Math.PI) delta -= (float) (Math.PI * 2);
            while (delta < -(float) Math.PI) delta += (float) (Math.PI * 2);
        }
        if (Math.abs(delta) <= step) {
            return to;
        }
        return from + Math.signum(delta) * step;
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
