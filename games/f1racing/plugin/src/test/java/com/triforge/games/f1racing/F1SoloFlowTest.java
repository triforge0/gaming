package com.triforge.games.f1racing;

import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.F1SessionPhase;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class F1SoloFlowTest {

    @Test
    void practiceRoomAutoStartsRaceForSingleHuman() {
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:sp:practice:city-loop:SOLO-1");
        F1RacingGame game = new F1RacingGame();
        game.bind(host);

        game.handleJoinRequest("Solo", new EmbeddedChannel());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        assertEquals(F1SessionPhase.F1_SESSION_RACE, game.sessionPhase());
        assertEquals(1, game.lobbyPlayerCount());
        assertTrue(game.playerEntityId(1L) > 0L);
    }

    @Test
    void timeTrialRoomStartsQualifyingSession() {
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:sp:trial:city-loop:SOLO-2");
        F1RacingGame game = new F1RacingGame();
        game.bind(host);
        game.handleJoinRequest("Solo", new EmbeddedChannel());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(F1SessionPhase.F1_SESSION_QUALIFYING, game.sessionPhase());
    }

    @Test
    void raceBotsRoomSpawnsBots() {
        F1RacingRoomHost host = new F1RacingRoomHost("f1racing:sp:bots:city-loop:SOLO-3");
        F1RacingGame game = new F1RacingGame();
        game.bind(host);
        game.handleJoinRequest("Solo", new EmbeddedChannel());

        assertEquals(4, game.lobbyPlayerCount());
    }

    @Test
    void parsesSoloRoomMetadata() {
        var room = F1SoloRoom.parse("f1racing:sp:bots:city-loop:ABC").orElseThrow();
        assertEquals(F1SoloMode.RACE_BOTS, room.mode());
        assertEquals("city-loop", room.trackId());
    }
}
