package com.triforge.games.f1racing;

import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.F1Message;
import com.triforge.protocol.proto.F1SetRoomConfig;
import com.triforge.protocol.proto.F1StandingUpdate;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class BotAutoFillTest {

    @Test
    void configuredBotCountFillsLobbyForSoloHost() {
        F1RacingGame game = bind(newHost());
        game.handleJoinRequest("Solo", new EmbeddedChannel());
        game.handleF1Message(1L, F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setTrackId("city-loop")
                        .setBotCount(3)
                        .setEnableQualifying(false)
                        .build())
                .build());

        game.toLobbySnapshot(newHost());

        assertEquals(4, game.lobbyPlayerCount());
    }

    @Test
    void soloHostCanStartRaceAgainstBots() {
        F1RacingRoomHost host = newHost();
        F1RacingGame game = bind(host);
        game.handleJoinRequest("Solo", new EmbeddedChannel());
        game.handleF1Message(1L, F1Message.newBuilder()
                .setSetRoomConfig(F1SetRoomConfig.newBuilder()
                        .setTrackId("city-loop")
                        .setBotCount(3)
                        .setEnableQualifying(false)
                        .build())
                .build());
        game.toLobbySnapshot(host);
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        for (long tick = 1; tick <= 120; tick++) {
            game.onTick(tick);
        }

        F1StandingUpdate standings = findStandings(host);
        assertTrue(standings.getEntriesCount() >= 4, "expected full grid standings");
        assertTrue(
                standings.getEntriesList().stream().filter(entry -> entry.getIsBot()).count() >= 3,
                "expected bot drivers in standings");
    }

    private static F1StandingUpdate findStandings(F1RacingRoomHost host) {
        return host.broadcasts().stream()
                .filter(msg -> msg.hasF1() && msg.getF1().hasStandings())
                .map(msg -> msg.getF1().getStandings())
                .reduce((first, second) -> second)
                .orElse(F1StandingUpdate.getDefaultInstance());
    }

    private static F1RacingRoomHost newHost() {
        return new F1RacingRoomHost("f1racing:city-loop:BOTS");
    }

    private static F1RacingGame bind(F1RacingRoomHost host) {
        F1RacingGame game = new F1RacingGame();
        game.bind(host);
        return game;
    }
}
