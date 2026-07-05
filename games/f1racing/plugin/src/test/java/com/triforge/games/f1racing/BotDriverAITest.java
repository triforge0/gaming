package com.triforge.games.f1racing;

import com.triforge.engine.ecs.EcsWorld;
import com.triforge.games.f1racing.ai.BotDriverAI;
import com.triforge.games.f1racing.physics.ArcadeVehiclePhysics;
import com.triforge.games.f1racing.physics.VehicleState;
import com.triforge.games.f1racing.track.StartGridSlot;
import com.triforge.games.f1racing.track.TrackLoader;
import com.triforge.protocol.proto.F1CollisionMode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

final class BotDriverAITest {

    @Test
    void botFollowsTrackAndAccumulatesDistance() {
        var track = TrackLoader.loadClasspath("city-loop");
        ArcadeVehiclePhysics physics = new ArcadeVehiclePhysics(track);
        BotDriverAI ai = new BotDriverAI(physics.spline(), track.trackWidth());

        StartGridSlot grid = track.startGrid().getFirst();
        VehicleState state = new VehicleState(grid.x(), grid.y(), grid.z(), grid.yaw());

        float startX = state.x();
        float startY = state.y();
        for (int tick = 0; tick < 900; tick++) {
            var input = ai.compute(-1L, state);
            physics.tick(state, input, F1CollisionMode.F1_COLLISION_ON);
        }

        float moved = (float) Math.hypot(state.x() - startX, state.y() - startY);
        var projection = physics.spline().project(state.x(), state.y());
        float lateral = Math.abs(projection.lateralDistance());
        float halfWidth = track.trackWidth() * 0.5f;

        assertTrue(moved > 80f, "bot should cover meaningful distance, moved=" + moved);
        assertTrue(lateral <= halfWidth + 0.5f, "bot should stay within track limits, lateral=" + lateral);
        assertTrue(state.speed() > 5f, "bot should still be moving");
    }

    @Test
    void raceSessionStandingsMarkBots() {
        RaceSession session = new RaceSession(TrackLoader.loadClasspath("city-loop"), 3);
        F1Lobby lobby = new F1Lobby();
        lobby.addPlayer(1L, "Human", true);
        lobby.addBot();
        session.bindLobby(lobby);

        EcsWorld world = new EcsWorld();
        session.spawnGrid(world.entityManager(), world.componentManager(), 0L);

        for (long tick = 1; tick <= 180; tick++) {
            session.tick(tick, world.entityManager(), world.componentManager());
        }

        var standings = session.tick(181L, world.entityManager(), world.componentManager());
        assertTrue(standings.getEntriesList().stream().anyMatch(entry -> entry.getIsBot()));
    }
}
