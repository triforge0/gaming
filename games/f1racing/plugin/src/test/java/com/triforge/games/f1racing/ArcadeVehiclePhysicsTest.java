package com.triforge.games.f1racing;

import com.triforge.games.f1racing.physics.ArcadeVehiclePhysics;
import com.triforge.games.f1racing.physics.VehicleInput;
import com.triforge.games.f1racing.physics.VehicleState;
import com.triforge.games.f1racing.track.TrackLoader;
import com.triforge.protocol.proto.F1CollisionMode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ArcadeVehiclePhysicsTest {

    @Test
    void acceleratesWithThrottle() {
        var track = TrackLoader.loadClasspath("city-loop");
        var physics = new ArcadeVehiclePhysics(track);
        var state = new VehicleState(200f, 0f, 0f, (float) Math.PI / 2);

        for (int i = 0; i < 60; i++) {
            physics.tick(state, new VehicleInput(0f, 1f, 0f, false, false, false), F1CollisionMode.F1_COLLISION_ON);
        }

        assertTrue(state.speed() > 5f);
    }

    @Test
    void carCarCollisionAppliesControlLoss() {
        VehicleState a = new VehicleState(0f, 0f, 0f, 0f);
        VehicleState b = new VehicleState(1f, 0f, 0f, 0f);
        a.setSpeed(20f);
        b.setSpeed(20f);

        ArcadeVehiclePhysics.resolveCarCarCollision(a, b, F1CollisionMode.F1_COLLISION_ON);

        assertTrue(a.controlLossTicks() > 0);
        assertTrue(b.controlLossTicks() > 0);
        assertNotEquals(0f, a.x());
    }

    @Test
    void ghostModeSkipsCarCarCollision() {
        VehicleState a = new VehicleState(0f, 0f, 0f, 0f);
        VehicleState b = new VehicleState(1f, 0f, 0f, 0f);
        float ax = a.x();

        ArcadeVehiclePhysics.resolveCarCarCollision(a, b, F1CollisionMode.F1_COLLISION_OFF);

        assertEquals(ax, a.x(), 0.001f);
    }

    private static void assertEquals(float expected, float actual, float delta) {
        org.junit.jupiter.api.Assertions.assertEquals(expected, actual, delta);
    }
}
