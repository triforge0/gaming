package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.OrientationComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.engine.loop.GameLoop;
import com.triforge.games.tankarena.world.TankGeometry;
import com.triforge.games.tankarena.world.WorldBounds;

import java.util.ArrayList;
import java.util.List;
import java.util.function.LongConsumer;

public final class ShootingSystem implements System {
    private static final float FIXED_DELTA_SECONDS = 1f / GameLoop.TPS;
    private final List<Long> expiredBulletIds = new ArrayList<>();
    private final LongConsumer bulletFiredHandler;
    private final WorldBounds worldBounds;

    public ShootingSystem(WorldBounds worldBounds) {
        this(worldBounds, shooterEntityId -> {
        });
    }

    /** @param bulletFiredHandler invoked with the shooter's tank entity id whenever a bullet spawns. */
    public ShootingSystem(WorldBounds worldBounds, LongConsumer bulletFiredHandler) {
        this.worldBounds = worldBounds;
        this.bulletFiredHandler = bulletFiredHandler;
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        tickTankCooldowns(entityManager, componentManager);
        spawnBullets(entityManager, componentManager);
        moveAndCullBullets(entityManager, componentManager);
    }

    private void tickTankCooldowns(EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            TankComponent tank = componentManager.getAt(index, TankComponent.class);
            if (tank != null) {
                tank.tickCooldown();
            }
        }
    }

    private void spawnBullets(EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            long tankEntityId = entityManager.idAt(index);
            trySpawnBullet(index, tankEntityId, entityManager, componentManager);
        }
    }

    private void trySpawnBullet(
            int tankIndex,
            long tankEntityId,
            EntityManager entityManager,
            ComponentManager componentManager
    ) {
        InputComponent input = componentManager.getAt(tankIndex, InputComponent.class);
        TankComponent tankComponent = componentManager.getAt(tankIndex, TankComponent.class);
        PositionComponent position = componentManager.getAt(tankIndex, PositionComponent.class);
        OrientationComponent orientation = componentManager.getAt(tankIndex, OrientationComponent.class);

        if (input == null || tankComponent == null || position == null || orientation == null) {
            return;
        }
        if (!input.shoot() || !tankComponent.canShoot()) {
            return;
        }

        float yaw = orientation.yaw();
        float pitch = orientation.pitch();
        float[] muzzle = TankGeometry.muzzlePosition3D(position.x(), position.y(), position.z(), yaw, pitch);
        float[] velocity = TankGeometry.directionVector3D(yaw, pitch);

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(muzzle[0], muzzle[1], muzzle[2]));
        componentManager.add(bullet, new BulletComponent(
                tankEntityId,
                BulletComponent.DEFAULT_SPEED,
                velocity[0], velocity[1], velocity[2],
                BulletComponent.DEFAULT_MAX_RANGE));
        tankComponent.startCooldown();
        bulletFiredHandler.accept(tankEntityId);
    }

    private void moveAndCullBullets(EntityManager entityManager, ComponentManager componentManager) {
        expiredBulletIds.clear();

        for (int index = 0; index < entityManager.count(); index++) {
            BulletComponent bullet = componentManager.getAt(index, BulletComponent.class);
            PositionComponent position = componentManager.getAt(index, PositionComponent.class);
            if (bullet == null || position == null) {
                continue;
            }

            float step = bullet.speed() * FIXED_DELTA_SECONDS;
            float nextX = position.x() + bullet.directionX() * step;
            float nextY = position.y() + bullet.directionY() * step;
            float nextZ = position.z() + bullet.directionZ() * step;
            position.set(nextX, nextY, nextZ);
            bullet.addDistance(step);

            if (!worldBounds.isInside(nextX, nextY) || bullet.exceededRange()) {
                expiredBulletIds.add(entityManager.idAt(index));
            }
        }

        for (int index = 0; index < expiredBulletIds.size(); index++) {
            entityManager.destroyId(expiredBulletIds.get(index));
        }
    }
}
