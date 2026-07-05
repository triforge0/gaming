package com.triforge.games.f1racing;

import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.f1racing.track.TrackLoader;
import com.triforge.protocol.proto.F1VehicleInput;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class RaceSessionIntegrationTest {

    @Test
    void vehicleInputMovesCarInSnapshot() {
        F1RacingGame game = new F1RacingGame();
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:city-loop:SIM");
        game.bind(host);

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true).build())
                .build());
        game.handleLobbyCommand(2L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true).build())
                .build());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        assertTrue(game.playerEntityId(1L) > 0L);

        float startX = readX(game, 1L);
        float startY = readY(game, 1L);
        for (int i = 0; i < 120; i++) {
            game.handleF1Message(1L, com.triforge.protocol.proto.F1Message.newBuilder()
                    .setVehicleInput(F1VehicleInput.newBuilder().setThrottle(1f).build())
                    .build());
            game.onTick(i + 1L);
        }

        float endX = readX(game, 1L);
        float endY = readY(game, 1L);
        float moved = (float) Math.hypot(endX - startX, endY - startY);
        assertTrue(moved > 1f);
    }

    @Test
    void raceSessionSpawnsEntitiesForAllPlayers() {
        RaceSession session = new RaceSession(TrackLoader.loadClasspath("city-loop"), 3);
        F1Lobby lobby = new F1Lobby();
        lobby.addPlayer(1L, "A", true);
        lobby.addPlayer(2L, "B", false);
        session.bindLobby(lobby);

        EcsWorld world = new EcsWorld();
        session.spawnGrid(world.entityManager(), world.componentManager(), 0L);

        assertEquals(2, session.playerEntities().size());
        assertTrue(session.playerEntityId(1L) > 0L);
        assertTrue(session.playerEntityId(2L) > 0L);
    }

    private static float readY(F1RacingGame game, long playerId) {
        int index = game.entityManager().indexOf(game.playerEntityId(playerId));
        var kinematics = game.componentManager().getAt(
                index,
                com.triforge.games.f1racing.components.CarKinematicsComponent.class);
        return kinematics == null ? 0f : kinematics.y();
    }

    private static float readX(F1RacingGame game, long playerId) {
        int index = game.entityManager().indexOf(game.playerEntityId(playerId));
        var kinematics = game.componentManager().getAt(
                index,
                com.triforge.games.f1racing.components.CarKinematicsComponent.class);
        return kinematics == null ? 0f : kinematics.x();
    }
}
