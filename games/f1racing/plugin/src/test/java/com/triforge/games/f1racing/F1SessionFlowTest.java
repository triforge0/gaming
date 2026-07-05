package com.triforge.games.f1racing;

import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.F1AbortReason;
import com.triforge.protocol.proto.F1Message;
import com.triforge.protocol.proto.F1SessionPhase;
import com.triforge.protocol.proto.F1SetRoomConfig;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class F1SessionFlowTest {

    @Test
    void skipQualifyingBroadcastsGridThenStartsRace() {
        F1RacingRoomHost host = newHost();
        F1RacingGame game = bind(host);
        joinTwoReadyPlayers(game);

        advanceCountdown(game);
        assertEquals(F1SessionPhase.F1_SESSION_QUALIFYING, game.sessionPhase());

        game.handleF1Message(1L, F1Message.newBuilder().setSkipQualifying(
                com.triforge.protocol.proto.F1SkipQualifying.getDefaultInstance()).build());

        assertTrue(host.broadcasts().stream()
                .anyMatch(msg -> msg.hasF1() && msg.getF1().hasQualifyingResult()));
        assertEquals(MatchPhase.COUNTDOWN, game.matchPhase());

        advanceCountdown(game);
        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        assertEquals(F1SessionPhase.F1_SESSION_RACE, game.sessionPhase());
    }

    @Test
    void qualifyingDisabledStartsRaceDirectly() {
        F1RacingRoomHost host = newHost();
        F1RacingGame game = bind(host);
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleF1Message(1L, F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setTrackId("city-loop")
                        .setEnableQualifying(false)
                        .build())
                .build());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        readyBoth(game);

        advanceCountdown(game);
        assertEquals(F1SessionPhase.F1_SESSION_RACE, game.sessionPhase());
        assertFalse(host.broadcasts().stream()
                .anyMatch(msg -> msg.hasF1() && msg.getF1().hasQualifyingResult()));
    }

    @Test
    void gridSpawnsDuringCountdownSoCarsRenderBeforeGo() {
        F1RacingGame game = bind(newHost());
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        game.handleF1Message(1L, F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setTrackId("city-loop")
                        .setEnableQualifying(false)
                        .build())
                .build());
        readyBoth(game);

        assertEquals(MatchPhase.COUNTDOWN, game.matchPhase());
        assertTrue(game.playerEntityId(1L) != 0L,
                "cars should be spawned on the grid during the countdown, before GO");

        advanceCountdown(game);
        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        assertTrue(game.playerEntityId(1L) != 0L);
    }

    @Test
    void hostDisconnectDuringRaceAbortsWithReason() {
        F1RacingRoomHost host = newHost();
        F1RacingGame game = bind(host);
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        game.handleF1Message(1L, F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setTrackId("city-loop")
                        .setEnableQualifying(false)
                        .build())
                .build());
        readyBoth(game);
        advanceCountdown(game);
        assertEquals(F1SessionPhase.F1_SESSION_RACE, game.sessionPhase());

        game.handleLeaveRequest(1L);

        assertEquals(MatchPhase.ENDED, game.matchPhase());
        assertTrue(host.broadcasts().stream().anyMatch(F1SessionFlowTest::isHostAbortResult));
    }

    @Test
    void hostCanKickGuestFromLobby() {
        F1RacingGame game = bind(newHost());
        game.handleJoinRequest("Host", new EmbeddedChannel());
        game.handleJoinRequest("Guest", new EmbeddedChannel());
        assertEquals(2, game.lobbyPlayerCount());

        game.handleF1Message(1L, F1Message.newBuilder()
                .setKickPlayer(com.triforge.protocol.proto.F1KickPlayer.newBuilder().setPlayerId(2L))
                .build());

        assertEquals(1, game.lobbyPlayerCount());
    }

    @Test
    void hostCanAddBotInLobby() {
        F1RacingGame game = bind(newHost());
        game.handleJoinRequest("Host", new EmbeddedChannel());

        game.handleF1Message(1L, F1Message.newBuilder()
                .setAddBot(com.triforge.protocol.proto.F1AddBot.getDefaultInstance())
                .build());

        assertEquals(2, game.lobbyPlayerCount());
    }

    private static F1RacingRoomHost newHost() {
        return new F1RacingRoomHost("f1racing:city-loop:FLOW");
    }

    private static F1RacingGame bind(F1RacingRoomHost host) {
        F1RacingGame game = new F1RacingGame();
        game.bind(host);
        return game;
    }

    private static void joinTwoReadyPlayers(F1RacingGame game) {
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        readyBoth(game);
    }

    private static void readyBoth(F1RacingGame game) {
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
        game.handleLobbyCommand(2L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
    }

    private static void advanceCountdown(F1RacingGame game) {
        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
    }

    private static boolean isHostAbortResult(GameMessage message) {
        return message.hasF1()
                && message.getF1().hasRaceResult()
                && message.getF1().getRaceResult().getAbortReason() == F1AbortReason.F1_ABORT_HOST_DISCONNECTED;
    }
}
