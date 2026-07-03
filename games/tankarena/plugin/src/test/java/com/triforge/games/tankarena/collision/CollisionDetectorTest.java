package com.triforge.games.tankarena.collision;

import com.triforge.games.tankarena.components.PositionComponent;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class CollisionDetectorTest {

    @Test
    void tanksAtSamePositionAndElevationOverlap() {
        PositionComponent a = new PositionComponent(100f, 100f, 0f);
        PositionComponent b = new PositionComponent(100f, 100f, 0f);

        assertTrue(CollisionDetector.tanksOverlap(a, b));
    }

    @Test
    void tanksOverlappingOnGroundButFarApartInElevationDoNotCollide() {
        PositionComponent low = new PositionComponent(100f, 100f, 0f);
        PositionComponent high = new PositionComponent(100f, 100f, 100f); // on a tall ledge

        assertFalse(CollisionDetector.tanksOverlap(low, high));
    }

    @Test
    void tanksAtSlightlyDifferentElevationsStillCollide() {
        PositionComponent a = new PositionComponent(100f, 100f, 0f);
        PositionComponent b = new PositionComponent(100f, 100f, CollisionDetector.TANK_HALF_HEIGHT);

        assertTrue(CollisionDetector.tanksOverlap(a, b));
    }

    @Test
    void bulletAtTurretHeightHitsGroundTank() {
        PositionComponent tank = new PositionComponent(100f, 100f, 0f);
        PositionComponent bullet = new PositionComponent(100f, 100f, CollisionDetector.TANK_HALF_HEIGHT);

        assertTrue(CollisionDetector.bulletHitsTank(tank, bullet));
    }

    @Test
    void bulletFlyingHighOverTankMisses() {
        PositionComponent tank = new PositionComponent(100f, 100f, 0f);
        PositionComponent bullet = new PositionComponent(100f, 100f, 200f); // sailed overhead

        assertFalse(CollisionDetector.bulletHitsTank(tank, bullet));
    }
}
