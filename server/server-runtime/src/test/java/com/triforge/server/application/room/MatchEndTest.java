package com.triforge.server.application.room;

import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.MessageEnvelope;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.SetSpawnAction;
import com.triforge.protocol.proto.SetTeamAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class MatchEndTest {

    @Test
    void matchEndsFreezesBroadcastsResultAndReturnsToLobby() throws Exception {
        MatchConfig config = MatchConfig.defaults()
                .withCountdownSeconds(1)
                .withMatchDurationSeconds(5)
                .withScoreboardDelaySeconds(2);
        GameRoom room = GameRoom.builder("end-room").matchConfig(config).build();
        EmbeddedChannel host = new EmbeddedChannel();

        room.handleJoinRequest("Thắng", host);
        room.handleJoinRequest("An", new EmbeddedChannel());
        configure(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);
        configure(room, 2L, Team.BLUE, SpawnRegion.BOTTOM_RIGHT);
        room.handleLobbyCommand(1L, ready());
        room.handleLobbyCommand(2L, ready());
        drive(room, MatchPhase.COUNTDOWN, room::tickCountdownPhase);

        // Run the match clock to zero.
        drive(room, MatchPhase.PLAYING, room::tickMatchTimer);
        assertEquals(MatchPhase.ENDED, room.matchPhase());
        assertEquals(0, room.entityManager().count(), "tanks despawned / simulation frozen");

        MatchResult result = lastMatchResult(host);
        assertNotNull(result, "MatchResult broadcast to clients");
        assertEquals(2, result.getStatsCount(), "both players in the scoreboard");

        // Hold the scoreboard for 2s, then auto-return to lobby.
        drive(room, MatchPhase.ENDED, room::tickScoreboardPhase);
        assertEquals(MatchPhase.LOBBY, room.matchPhase());
        assertFalse(TankArenaRoomSupport.match(room).player(1L).ready(), "ready reset on return to lobby");
        assertEquals(Team.RED, TankArenaRoomSupport.match(room).player(1L).team(), "team selection preserved");

        // A second match can start straight away.
        room.handleLobbyCommand(1L, ready());
        room.handleLobbyCommand(2L, ready());
        assertEquals(MatchPhase.COUNTDOWN, room.matchPhase(), "rematch starts from lobby");
    }

    private static void drive(GameRoom room, MatchPhase whilePhase, Runnable tick) {
        int guard = 0;
        while (room.matchPhase() == whilePhase && guard < 100_000) {
            tick.run();
            guard++;
        }
        assertTrue(guard < 100_000, "phase " + whilePhase + " did not advance");
    }

    private static MatchResult lastMatchResult(EmbeddedChannel channel) throws Exception {
        MatchResult found = null;
        Object outbound;
        while ((outbound = channel.readOutbound()) != null) {
            GameMessage message = GameMessage.parseFrom(((MessageEnvelope) outbound).getPayload());
            if (message.getContentCase() == GameMessage.ContentCase.MATCHRESULT) {
                found = message.getMatchResult();
            }
        }
        return found;
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
