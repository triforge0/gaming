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
            resolve(position);
        }
    }

    /**
     * Resolves a tank whose attempted move lands on a solid tile. Instead of cancelling the
     * whole move (which dead-stops tanks against walls and jams them in tight gaps), we keep
     * whichever single axis is clear so the hull slides along the obstacle. If the tank was
     * already embedded before the move — e.g. wedged in a one-tile slot with no clear axis —
     * we let it move freely so the player can drive back out rather than being trapped
     * reverting to an equally-blocked cell.
     */
    private void resolve(PositionComponent position) {
        float x = position.x();
        float y = position.y();
        if (!blocked(x, y)) {
            return;
        }

        float px = position.previousX();
        float py = position.previousY();

        if (!blocked(x, py)) {
            position.set(x, py);
        } else if (!blocked(px, y)) {
            position.set(px, y);
        } else if (!blocked(px, py)) {
            position.revertToPrevious();
        }
        // else: already embedded before this move — leave the new position so it can escape.
    }

    private boolean blocked(float x, float y) {
        return CollisionDetector.tankOverlapsSolidTile(gameMap, mapConfig, x, y);
    }
}
