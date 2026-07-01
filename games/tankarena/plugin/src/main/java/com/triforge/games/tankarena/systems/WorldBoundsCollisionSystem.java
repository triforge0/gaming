package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.games.tankarena.world.WorldBounds;

/**
 * Reverts tank movement that would leave the playable world bounds (no edge clamping).
 */
public final class WorldBoundsCollisionSystem implements System {
    private final WorldBounds worldBounds;

    public WorldBoundsCollisionSystem(WorldBounds worldBounds) {
        this.worldBounds = worldBounds;
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            TankComponent tank = componentManager.getAt(index, TankComponent.class);
            PositionComponent position = componentManager.getAt(index, PositionComponent.class);
            if (tank == null || position == null) {
                continue;
            }
            if (!worldBounds.isTankInside(position.x(), position.y())) {
                position.revertToPrevious();
            }
        }
    }
}
