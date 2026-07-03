package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.SystemScheduler;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MatchHeadquarters;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class CollisionSystemTest {

    @Test
    void tankCannotMoveIntoBrick() {
        GameMap map = createMap(5, 5, 32, new TileType[]{
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.BRICK, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
        });

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, new AtomicReference<>());

        // Start in the empty cell left of the brick (tile 1,2 → centre x=48) and drive right
        // into it. The tank should approach the wall and stop, never penetrating the brick
        // (whose left edge sits at world x=64).
        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(48f, 80f)
                .direction(Direction.RIGHT)
                .withInput()
                .build();

        InputComponent input = componentManager.get(tank, InputComponent.class);
        input.apply(InputCommand.newBuilder().setMoveRight(true).build());

        for (int tick = 0; tick < 20; tick++) {
            scheduler.update(tick, entityManager, componentManager);
        }

        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        assertTrue(position.x() > 48f, "tank should advance toward the wall");
        assertTrue(position.x() + 12f <= 64.001f,
                "tank must not penetrate the brick, x=" + position.x());
    }

    @Test
    void bulletDestroysBrick() {
        GameMap map = createMap(5, 5, 32, new TileType[]{
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.BRICK, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
        });

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, new AtomicReference<>());

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(70f, 80f));
        componentManager.add(bullet, new BulletComponent(99L, 1f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertEquals(TileType.EMPTY, map.tileAt(2, 2));
        assertFalse(entityManager.exists(bullet));
    }

    @Test
    void bulletBlockedBySteel() {
        GameMap map = createMap(5, 5, 32, new TileType[]{
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.STEEL, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.STEEL,
                TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL, TileType.STEEL,
        });

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, new AtomicReference<>());

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(70f, 80f));
        componentManager.add(bullet, new BulletComponent(99L, 1f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertEquals(TileType.STEEL, map.tileAt(2, 2));
        assertFalse(entityManager.exists(bullet));
    }

    @Test
    void bulletHitDamagesTank() {
        GameMap map = createOpenMap();
        AtomicReference<CollisionSystem.TankHit> hitRef = new AtomicReference<>();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, hitRef);

        Entity shooter = TankEntityFactory.tank(entityManager, componentManager).at(100f, 100f).build();
        Entity target = TankEntityFactory.tank(entityManager, componentManager)
                .at(108f, 100f)
                .player(2L, "Target")
                .build();

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(108f, 100f));
        componentManager.add(bullet, new BulletComponent(shooter.id(), 0f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertTrue(hitRef.get() != null);
        assertEquals(2L, hitRef.get().playerId());
        assertEquals(PlayerComponent.DEFAULT_LIVES - 1, hitRef.get().livesRemaining());
        assertFalse(entityManager.exists(bullet));
    }

    @Test
    void friendlyBulletDoesNotDamageTeammate() {
        GameMap map = createOpenMap();
        AtomicReference<CollisionSystem.TankHit> hitRef = new AtomicReference<>();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, hitRef);

        Entity shooter = TankEntityFactory.tank(entityManager, componentManager)
                .at(100f, 100f)
                .player(1L, "Shooter", 3, Team.RED)
                .build();
        Entity teammate = TankEntityFactory.tank(entityManager, componentManager)
                .at(108f, 100f)
                .player(2L, "Ally", 3, Team.RED)
                .build();

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(108f, 100f));
        componentManager.add(bullet, new BulletComponent(shooter.id(), 0f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertTrue(hitRef.get() == null);
        assertEquals(3, componentManager.get(teammate, PlayerComponent.class).lives());
        assertTrue(entityManager.exists(bullet));
    }

    @Test
    void enemyBulletStillDamagesOpponent() {
        GameMap map = createOpenMap();
        AtomicReference<CollisionSystem.TankHit> hitRef = new AtomicReference<>();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, hitRef);

        Entity shooter = TankEntityFactory.tank(entityManager, componentManager)
                .at(100f, 100f)
                .player(1L, "Blue", 3, Team.BLUE)
                .build();
        Entity target = TankEntityFactory.tank(entityManager, componentManager)
                .at(108f, 100f)
                .player(2L, "Red", 3, Team.RED)
                .build();

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(108f, 100f));
        componentManager.add(bullet, new BulletComponent(shooter.id(), 0f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertTrue(hitRef.get() != null);
        assertEquals(2L, hitRef.get().playerId());
        assertFalse(entityManager.exists(bullet));
    }

    @Test
    void bulletPassesThroughTeammateToHitEnemy() {
        GameMap map = createOpenMap();
        AtomicReference<CollisionSystem.TankHit> hitRef = new AtomicReference<>();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        SystemScheduler scheduler = createScheduler(map, hitRef);

        Entity shooter = TankEntityFactory.tank(entityManager, componentManager)
                .at(40f, 40f)
                .player(1L, "Red", 3, Team.RED)
                .build();
        Entity teammate = TankEntityFactory.tank(entityManager, componentManager)
                .at(60f, 40f)
                .player(2L, "Ally", 3, Team.RED)
                .build();
        Entity enemy = TankEntityFactory.tank(entityManager, componentManager)
                .at(80f, 40f)
                .player(3L, "Blue", 3, Team.BLUE)
                .build();

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(80f, 40f));
        componentManager.add(bullet, new BulletComponent(shooter.id(), 0f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertTrue(hitRef.get() != null);
        assertEquals(3L, hitRef.get().playerId());
        assertEquals(2, hitRef.get().livesRemaining());
    }

    @Test
    void twoBulletsKillTwoTanksInSameTickWithoutSkipping() {
        GameMap map = createOpenMap();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();

        // Handler mirrors GameRoom.killPlayerTank: it destroys the tank entity while the
        // CollisionSystem loop has just finished. With immediate (mid-loop) destruction this
        // swap-removed slots and skipped the second bullet/tank; deferral must avoid that.
        List<CollisionSystem.TankHit> hits = new ArrayList<>();
        MatchHeadquarters hq = new MatchHeadquarters(map);
        CollisionSystem collisionSystem = new CollisionSystem(map, hq, hit -> {
            hits.add(hit);
            entityManager.destroyId(hit.tank().id());
        }, ignored -> {
        });
        SystemScheduler scheduler = new SystemScheduler()
                .add(new MovementSystem())
                .add(new MapCollisionSystem(map, com.triforge.games.tankarena.map.MapConfig.DEFAULT))
                .add(collisionSystem);

        // Positions kept well inside the 5x5 (160px) open map so bullets hit tanks, not borders.
        Entity tankA = TankEntityFactory.tank(entityManager, componentManager)
                .at(40f, 40f)
                .player(1L, "A")
                .build();
        Entity tankB = TankEntityFactory.tank(entityManager, componentManager)
                .at(120f, 40f)
                .player(2L, "B")
                .build();

        Entity bulletA = entityManager.create();
        componentManager.add(bulletA, new PositionComponent(40f, 40f));
        componentManager.add(bulletA, new BulletComponent(999L, 0f, 0f));

        Entity bulletB = entityManager.create();
        componentManager.add(bulletB, new PositionComponent(120f, 40f));
        componentManager.add(bulletB, new BulletComponent(999L, 0f, 0f));

        scheduler.update(1, entityManager, componentManager);

        assertEquals(2, hits.size());
        assertTrue(hits.stream().anyMatch(hit -> hit.playerId() == 1L));
        assertTrue(hits.stream().anyMatch(hit -> hit.playerId() == 2L));
        assertFalse(entityManager.exists(tankA));
        assertFalse(entityManager.exists(tankB));
        assertFalse(entityManager.exists(bulletA));
        assertFalse(entityManager.exists(bulletB));
    }

    private SystemScheduler createScheduler(GameMap map, AtomicReference<CollisionSystem.TankHit> hitRef) {
        MatchHeadquarters hq = new MatchHeadquarters(map);
        CollisionSystem collisionSystem = new CollisionSystem(map, hq, hitRef::set, ignored -> {
        });
        return new SystemScheduler()
                .add(new MovementSystem())
                .add(new MapCollisionSystem(map, com.triforge.games.tankarena.map.MapConfig.DEFAULT))
                .add(collisionSystem);
    }

    private GameMap createOpenMap() {
        List<TileType> tiles = new ArrayList<>();
        for (int i = 0; i < 25; i++) {
            tiles.add(TileType.EMPTY);
        }
        return createMap(5, 5, 32, tiles.toArray(TileType[]::new));
    }

    private GameMap createMap(int width, int height, int tileSize, TileType[] tiles) {
        return GameMap.builder(width, height).tileSize(tileSize).tiles(tiles).build();
    }
}
