package com.triforge.server.application.room;

import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.SetSpawnAction;
import com.triforge.protocol.proto.SetTeamAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class MatchTimerTest {

    @Test
    void defaultMatchStartsAtFiveMinutes() {
        GameRoom room = startedMatch(MatchConfig.defaults());
        assertEquals(300, room.matchController().matchSecondsRemaining());
        assertEquals(300 * 60, room.matchController().matchTicksRemaining());
    }

    @Test
    void timerDecrementsAndStopsAtZero() {
        // 5-second match via override; drive the clock manually.
        GameRoom room = startedMatch(MatchConfig.defaults()
                .withCountdownSeconds(1)
                .withMatchDurationSeconds(5)
                .withScoreboardDelaySeconds(2));
        assertEquals(5, room.matchController().matchSecondsRemaining());

        int ticks = 0;
        while (room.matchPhase() == MatchPhase.PLAYING && ticks < 10_000) {
            room.tickMatchTimer();
            ticks++;
        }

        assertEquals(5 * 60, ticks, "5 seconds at 60 TPS");
        assertEquals(0, room.matchController().matchTicksRemaining());
        assertEquals(MatchPhase.ENDED, room.matchPhase(), "match ends when the clock hits zero");
    }

    /** Builds a room, drives lobby→countdown→PLAYING synchronously, and returns it in PLAYING. */
    private static GameRoom startedMatch(MatchConfig config) {
        GameRoom room = GameRoom.builder("timer-room").matchConfig(config).build();
        room.handleJoinRequest("Thắng", new EmbeddedChannel());
        room.handleJoinRequest("An", new EmbeddedChannel());
        configure(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);
        configure(room, 2L, Team.BLUE, SpawnRegion.TOP_RIGHT);
        room.handleLobbyCommand(1L, ready());
        room.handleLobbyCommand(2L, ready());
        while (room.matchPhase() == MatchPhase.COUNTDOWN) {
            room.tickCountdownPhase();
        }
        assertTrue(room.matchPhase() == MatchPhase.PLAYING, "should be PLAYING after countdown");
        return room;
    }

    private static void configure(GameRoom room, long playerId, Team team, SpawnRegion region) {
        LobbyTestSupport.configureTeam(room, playerId, team, region);
    }

    private static LobbyCommand ready() {
        return LobbyCommand.newBuilder().setSetReady(SetReadyAction.newBuilder().setReady(true)).build();
    }

    private static com.triforge.protocol.proto.Team toProto(Team team) {
        return switch (team) {
            case RED -> com.triforge.protocol.proto.Team.TEAM_RED;
            case BLUE -> com.triforge.protocol.proto.Team.TEAM_BLUE;
            case NONE -> com.triforge.protocol.proto.Team.TEAM_NONE;
        };
    }

    private static com.triforge.protocol.proto.SpawnRegion toProto(SpawnRegion region) {
        return switch (region) {
            case TOP_LEFT -> com.triforge.protocol.proto.SpawnRegion.TOP_LEFT;
            case TOP_RIGHT -> com.triforge.protocol.proto.SpawnRegion.TOP_RIGHT;
            case BOTTOM_LEFT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_LEFT;
            case BOTTOM_RIGHT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_RIGHT;
            case UNSPECIFIED -> com.triforge.protocol.proto.SpawnRegion.REGION_UNSPECIFIED;
        };
    }
}
