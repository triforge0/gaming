package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.SystemScheduler;
import com.triforge.games.tankarena.world.TankGeometry;
import com.triforge.games.tankarena.world.WorldBounds;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class ShootingSystemTest {

    private static final float BULLET_STEP = BulletComponent.DEFAULT_SPEED / 60f;
    private static final WorldBounds TEST_BOUNDS = new WorldBounds(800f, 600f);

    @Test
    void spawnsBulletAtMuzzleFacingUp() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new ShootingSystem(TEST_BOUNDS));

        Entity tank = createTank(entityManager, componentManager, 400f, 300f, Direction.UP);
        shoot(scheduler, entityManager, componentManager, tank);

        assertEquals(1, bulletCount(entityManager, componentManager));

        Entity bullet = findBullet(entityManager, componentManager);
        PositionComponent position = componentManager.get(bullet, PositionComponent.class);
        BulletComponent bulletComponent = componentManager.get(bullet, BulletComponent.class);

        assertEquals(400f, position.x(), 0.001f);
        assertEquals(300f - TankGeometry.MUZZLE_OFFSET - BULLET_STEP, position.y(), 0.001f);
        assertEquals(tank.id(), bulletComponent.ownerEntityId());
        assertEquals(0f, bulletComponent.directionX(), 0.001f);
        assertEquals(-1f, bulletComponent.directionY(), 0.001f);
    }

    @Test
    void movesBulletDeterministically() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new ShootingSystem(TEST_BOUNDS));

        Entity tank = createTank(entityManager, componentManager, 400f, 300f, Direction.UP);
        shoot(scheduler, entityManager, componentManager, tank);

        Entity bullet = findBullet(entityManager, componentManager);
        float startY = componentManager.get(bullet, PositionComponent.class).y();

        scheduler.update(2, entityManager, componentManager);

        PositionComponent position = componentManager.get(bullet, PositionComponent.class);
        assertEquals(startY - BULLET_STEP, position.y(), 0.001f);
    }

    @Test
    void enforcesShootCooldown() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new ShootingSystem(TEST_BOUNDS));

        Entity tank = createTank(entityManager, componentManager, 400f, 300f, Direction.UP);
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setShoot(true).build());

        scheduler.update(1, entityManager, componentManager);
        assertEquals(1, bulletCount(entityManager, componentManager));

        scheduler.update(2, entityManager, componentManager);
        assertEquals(1, bulletCount(entityManager, componentManager));

        for (long tick = 3; tick <= TankComponent.DEFAULT_SHOOT_COOLDOWN_TICKS; tick++) {
            scheduler.update(tick, entityManager, componentManager);
        }

        scheduler.update(TankComponent.DEFAULT_SHOOT_COOLDOWN_TICKS + 1, entityManager, componentManager);
        assertEquals(2, bulletCount(entityManager, componentManager));
    }

    @Test
    void destroysBulletAtWorldBoundary() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new ShootingSystem(TEST_BOUNDS));

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(TEST_BOUNDS.width() / 2f, 1f));
        componentManager.add(bullet, new BulletComponent(1L, 0f, -1f));

        scheduler.update(1, entityManager, componentManager);

        assertFalse(entityManager.exists(bullet));
    }

    @Test
    void destroysBulletWhenMaxRangeExceeded() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = new SystemScheduler().add(new ShootingSystem(TEST_BOUNDS));

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(400f, 300f));
        componentManager.add(bullet, new BulletComponent(
                1L,
                BulletComponent.DEFAULT_SPEED,
                0f,
                -1f,
                BULLET_STEP
        ));

        scheduler.update(1, entityManager, componentManager);

        assertFalse(entityManager.exists(bullet));
    }

    private Entity createTank(
            EntityManager entityManager,
            ComponentManager componentManager,
            float x,
            float y,
            Direction direction
    ) {
        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(x, y)
                .direction(direction)
                .withInput()
                .build();
        return tank;
    }

    private void shoot(
            SystemScheduler scheduler,
            EntityManager entityManager,
            ComponentManager componentManager,
            Entity tank
    ) {
        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setShoot(true).build());
        scheduler.update(1, entityManager, componentManager);
    }

    private int bulletCount(EntityManager entityManager, ComponentManager componentManager) {
        int count = 0;
        for (int index = 0; index < entityManager.count(); index++) {
            if (componentManager.get(entityManager.idAt(index), BulletComponent.class) != null) {
                count++;
            }
        }
        return count;
    }

    private Entity findBullet(EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            long entityId = entityManager.idAt(index);
            if (componentManager.get(entityId, BulletComponent.class) != null) {
                return new Entity(entityId);
            }
        }
        throw new AssertionError("Expected bullet entity");
    }
}
