package com.triforge.games.treasurequest.systems;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.games.treasurequest.components.PositionComponent;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.QuestMap;
import com.triforge.games.treasurequest.world.AvatarCollision;

import java.util.Objects;

public final class MapCollisionSystem implements System {
    private final QuestMap questMap;

    public MapCollisionSystem(QuestMap questMap) {
        this.questMap = Objects.requireNonNull(questMap, "questMap");
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            QuestAvatarComponent avatar = componentManager.getAt(index, QuestAvatarComponent.class);
            PositionComponent position = componentManager.getAt(index, PositionComponent.class);
            if (avatar == null || position == null) {
                continue;
            }
            if (AvatarCollision.avatarOverlapsSolidTile(questMap, position.x(), position.y())) {
                position.revertToPrevious();
            }
        }
    }
}
