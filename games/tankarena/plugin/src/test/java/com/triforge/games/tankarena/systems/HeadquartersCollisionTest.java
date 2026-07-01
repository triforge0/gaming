package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.HeadquartersDefinition;
import com.triforge.games.tankarena.map.MatchHeadquarters;
import com.triforge.games.tankarena.map.SpawnRegionDefinition;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.match.Team;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class HeadquartersCollisionTest {

    @Test
    void enemyBulletDamagesHeadquartersUntilDestroyed() {
        GameMap map = createMapWithRedHq();
        MatchHeadquarters matchHq = new MatchHeadquarters(map);
        List<CollisionSystem.HqHit> hits = new ArrayList<>();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        CollisionSystem collisionSystem = new CollisionSystem(
                map,
                matchHq,
                ignored -> {
                },
                hits::add
        );

        Entity shooter = TankEntityFactory.tank(entityManager, componentManager)
                .at(0f, 0f)
                .player(1L, "Blue", 3, Team.BLUE)
                .build();

        for (int shot = 1; shot <= HeadquartersDefinition.DEFAULT_MAX_HP; shot++) {
            hits.clear();
            Entity bullet = entityManager.create();
            componentManager.add(bullet, new PositionComponent(80f, 80f));
            componentManager.add(bullet, new BulletComponent(shooter.id(), 0f, 0f));

            collisionSystem.update(shot, entityManager, componentManager);

            assertEquals(1, hits.size());
            assertEquals(Team.RED, hits.getFirst().victimTeam());
            assertEquals(Team.BLUE, hits.getFirst().shooterTeam());
            assertEquals(HeadquartersDefinition.DEFAULT_MAX_HP - shot, hits.getFirst().hpRemaining());
            assertEquals(shot == HeadquartersDefinition.DEFAULT_MAX_HP, hits.getFirst().destroyed());
            assertFalse(entityManager.exists(bullet));
        }

        assertTrue(matchHq.isDestroyed(Team.RED));
    }

    @Test
    void friendlyBulletDoesNotDamageHeadquarters() {
        GameMap map = createMapWithRedHq();
        MatchHeadquarters matchHq = new MatchHeadquarters(map);
        List<CollisionSystem.HqHit> hits = new ArrayList<>();

        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();
        CollisionSystem collisionSystem = new CollisionSystem(
                map,
                matchHq,
                ignored -> {
                },
                hits::add
        );

        Entity shooter = TankEntityFactory.tank(entityManager, componentManager)
                .at(0f, 0f)
                .player(1L, "Red", 3, Team.RED)
                .build();

        Entity bullet = entityManager.create();
        componentManager.add(bullet, new PositionComponent(80f, 80f));
        componentManager.add(bullet, new BulletComponent(shooter.id(), 0f, 0f));

        collisionSystem.update(1, entityManager, componentManager);

        assertTrue(hits.isEmpty());
        assertEquals(HeadquartersDefinition.DEFAULT_MAX_HP, matchHq.hp(Team.RED));
        assertFalse(entityManager.exists(bullet));
    }

    private GameMap createMapWithRedHq() {
        TileType[] tiles = new TileType[25];
        for (int i = 0; i < tiles.length; i++) {
            tiles[i] = TileType.EMPTY;
        }
        tiles[2 * 5 + 2] = TileType.HQ;
        List<HeadquartersDefinition> headquarters = List.of(HeadquartersDefinition.rect(Team.RED, 2, 2, 1, 1));
        return GameMap.builder(5, 5)
                .tileSize(32)
                .tiles(tiles)
                .spawnRegions(SpawnRegionDefinition.defaultCorners(5, 5))
                .headquarters(headquarters)
                .build();
    }
}
