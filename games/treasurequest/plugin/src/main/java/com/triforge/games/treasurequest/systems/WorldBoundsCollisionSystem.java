package com.triforge.games.treasurequest.systems;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.games.treasurequest.components.PositionComponent;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.world.WorldBounds;

/** Reverts movement that would leave the playable world bounds (no edge clamping). */
public final class WorldBoundsCollisionSystem implements System {
    private final WorldBounds worldBounds;

    public WorldBoundsCollisionSystem(WorldBounds worldBounds) {
        this.worldBounds = worldBounds;
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            QuestAvatarComponent avatar = componentManager.getAt(index, QuestAvatarComponent.class);
            PositionComponent position = componentManager.getAt(index, PositionComponent.class);
            if (avatar == null || position == null) {
                continue;
            }
            if (!worldBounds.isAvatarInside(position.x(), position.y())) {
                position.revertToPrevious();
            }
        }
    }
}
