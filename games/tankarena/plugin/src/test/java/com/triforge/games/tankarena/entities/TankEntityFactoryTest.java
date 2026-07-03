package com.triforge.games.tankarena.entities;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.tankarena.components.CanControlComponent;
import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.components.VisionComponent;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.Direction;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

final class TankEntityFactoryTest {

    @Test
    void buildsMinimalTankForSystemTests() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(10f, 20f)
                .direction(Direction.UP)
                .withInput()
                .build();

        assertNotNull(componentManager.get(tank, PositionComponent.class));
        assertNotNull(componentManager.get(tank, DirectionComponent.class));
        assertNotNull(componentManager.get(tank, TankComponent.class));
        assertNotNull(componentManager.get(tank, InputComponent.class));
        assertNull(componentManager.get(tank, PlayerComponent.class));
        assertNull(componentManager.get(tank, CanControlComponent.class));
        assertNull(componentManager.get(tank, VisionComponent.class));
    }

    @Test
    void buildsFullPlayerTankRecipe() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(100f, 200f)
                .direction(Direction.UP)
                .player(7L, "Pilot", 2, Team.BLUE)
                .withInput()
                .controllable()
                .vision(MapConfig.DEFAULT, 32)
                .build();

        PlayerComponent player = componentManager.get(tank, PlayerComponent.class);
        assertNotNull(player);
        assertNotNull(componentManager.get(tank, CanControlComponent.class));
        assertNotNull(componentManager.get(tank, VisionComponent.class));
    }

    @Test
    void groundsInitialElevationOnTerrain() {
        EcsWorld world = new EcsWorld();
        EntityManager entityManager = world.entityManager();
        ComponentManager componentManager = world.componentManager();

        // 2x1 map, tileSize 10; right cell elevated to 40. Spawn at the right tile center.
        GameMap map = GameMap.builder(2, 1).tileSize(10)
                .tiles(new TileType[]{TileType.EMPTY, TileType.EMPTY})
                .heights(new float[]{0f, 40f})
                .build();

        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(15f, 5f) // right tile center
                .direction(Direction.UP)
                .onTerrain(map)
                .build();

        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        assertEquals(40f, position.z(), 1e-4f);
    }

    @Test
    void requiresPosition() {
        EcsWorld world = new EcsWorld();
        assertThrows(IllegalStateException.class, () ->
                TankEntityFactory.tank(world.entityManager(), world.componentManager()).build());
    }
}
