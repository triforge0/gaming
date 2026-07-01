package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.collision.CollisionDetector;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;

import java.util.ArrayList;
import java.util.List;

/**
 * Prevents tanks from overlapping by reverting any entity that intersects another tank's AABB.
 */
public final class TankTankCollisionSystem implements System {

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        int count = entityManager.count();
        List<Integer> tankIndexes = new ArrayList<>();
        for (int index = 0; index < count; index++) {
            if (componentManager.getAt(index, TankComponent.class) != null
                    && componentManager.getAt(index, PositionComponent.class) != null) {
                tankIndexes.add(index);
            }
        }

        boolean[] reverted = new boolean[count];
        for (int i = 0; i < tankIndexes.size(); i++) {
            int indexA = tankIndexes.get(i);
            if (reverted[indexA]) {
                continue;
            }
            PositionComponent posA = componentManager.getAt(indexA, PositionComponent.class);
            for (int j = i + 1; j < tankIndexes.size(); j++) {
                int indexB = tankIndexes.get(j);
                PositionComponent posB = componentManager.getAt(indexB, PositionComponent.class);
                if (CollisionDetector.tanksOverlap(posA, posB)) {
                    if (!reverted[indexA]) {
                        posA.revertToPrevious();
                        reverted[indexA] = true;
                    }
                    if (!reverted[indexB]) {
                        posB.revertToPrevious();
                        reverted[indexB] = true;
                    }
                }
            }
        }
    }
}
