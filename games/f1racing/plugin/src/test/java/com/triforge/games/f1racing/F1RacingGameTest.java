package com.triforge.games.f1racing;

import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.F1CollisionMode;
import com.triforge.protocol.proto.F1GarageLoadout;
import com.triforge.protocol.proto.F1Message;
import com.triforge.protocol.proto.F1RoomConfig;
import com.triforge.protocol.proto.F1SessionPhase;
import com.triforge.protocol.proto.F1SetRoomConfig;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.VehicleComponentProto;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class F1ProtoContractTest {

    @Test
    void buildsRepresentativeF1Messages() {
        F1Message garage = F1Message.newBuilder()
                .setGarageLoadout(F1GarageLoadout.newBuilder()
                        .setCarId("formula-modern")
                        .setPrimaryColor("#e10600")
                        .build())
                .build();

        F1Message config = F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setTrackId("city-loop")
                        .setLapCount(3)
                        .setMaxPlayers(F1Constants.DEFAULT_MAX_PLAYERS)
                        .setCollision(F1CollisionMode.F1_COLLISION_ON)
                        .setEnableQualifying(true)
                        .setQualifyingDurationSec(180)
                        .build())
                .build();

        GameMessage envelope = GameMessage.newBuilder().setF1(config).build();

        VehicleComponentProto vehicle = VehicleComponentProto.newBuilder()
                .setSpeed(42.5f)
                .setGear(4)
                .setCarId("formula-modern")
                .build();

        assertEquals(F1Constants.DEFAULT_MAX_PLAYERS, config.getSetRoomConfig().getMaxPlayers());
        assertEquals("formula-modern", garage.getGarageLoadout().getCarId());
        assertTrue(envelope.hasF1());
        assertEquals(42.5f, vehicle.getSpeed(), 0.001f);
    }
}

final class F1RacingGameTest {

    @Test
    void serviceLoaderRegistersPlugin() {
        assertNotNull(GamePlugins.require(F1RacingPlugin.ID).createGame(null));
    }

    @Test
    void joinReceivesDefaultRoomConfigWithMaxPlayers10() {
        F1RacingGame game = new F1RacingGame();
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:city-loop:ROOM1");
        game.bind(host);

        game.handleJoinRequest("Host", new EmbeddedChannel());

        F1RoomConfig config = host.broadcasts().stream()
                .filter(GameMessage::hasF1)
                .map(GameMessage::getF1)
                .filter(F1Message::hasRoomConfig)
                .map(F1Message::getRoomConfig)
                .findFirst()
                .orElseThrow();

        assertEquals(F1Constants.DEFAULT_MAX_PLAYERS, config.getMaxPlayers());
        assertEquals("city-loop", config.getTrackId());
        assertTrue(config.getEnableQualifying());
    }

    @Test
    void rejectsJoinWhenRoomFull() {
        F1RacingGame game = new F1RacingGame();
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:city-loop:FULL");
        game.bind(host);

        game.handleJoinRequest("A", new EmbeddedChannel());
        assertTrue(game.isHostPlayer(1L));
        game.handleF1Message(1L, F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setMaxPlayers(1)
                        .setEnableQualifying(true)
                        .build())
                .build());
        assertEquals(1, game.configuredMaxPlayers());

        game.handleJoinRequest("B", new EmbeddedChannel());

        assertEquals(1, game.lobbyPlayerCount());
    }

    @Test
    void twoPlayersReadyStartEntersQualifyingSession() {
        F1RacingGame game = new F1RacingGame();
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:city-loop:RACE");
        game.bind(host);

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
        game.handleLobbyCommand(2L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        assertEquals(F1SessionPhase.F1_SESSION_QUALIFYING, game.sessionPhase());
    }
}
