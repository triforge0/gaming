package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.collision.CollisionDetector;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;

import java.util.Objects;

public final class MapCollisionSystem implements System {
    private final GameMap gameMap;
    private final MapConfig mapConfig;

    public MapCollisionSystem(GameMap gameMap, MapConfig mapConfig) {
        this.gameMap = Objects.requireNonNull(gameMap, "gameMap");
        this.mapConfig = Objects.requireNonNull(mapConfig, "mapConfig");
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            TankComponent tank = componentManager.getAt(index, TankComponent.class);
            PositionComponent position = componentManager.getAt(index, PositionComponent.class);
            if (tank == null || position == null) {
                continue;
            }
            if (CollisionDetector.tankOverlapsSolidTile(gameMap, mapConfig, position.x(), position.y())) {
                position.revertToPrevious();
            }
        }
    }
}
