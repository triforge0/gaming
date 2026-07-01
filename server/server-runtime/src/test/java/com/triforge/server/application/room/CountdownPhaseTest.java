package com.triforge.server.application.room;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MessageEnvelope;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.SetSpawnAction;
import com.triforge.protocol.proto.SetTeamAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Drives the countdown synchronously on the test thread (room loop not started) so timing is exact.
 */
final class CountdownPhaseTest {

    @Test
    void countdownLastsThreeSecondsAndEmitsThreePhaseUpdates() throws Exception {
        GameRoom room = new GameRoom("countdown-room"); // not started: we step ticks manually
        EmbeddedChannel host = new EmbeddedChannel();

        // Two players reach the start condition; the second ready auto-starts the countdown.
        room.handleJoinRequest("Thắng", host);
        room.handleJoinRequest("An", new EmbeddedChannel());
        configure(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);
        configure(room, 2L, Team.BLUE, SpawnRegion.TOP_RIGHT);
        room.handleLobbyCommand(1L, ready());
        room.handleLobbyCommand(2L, ready());

        assertEquals(MatchPhase.COUNTDOWN, room.matchPhase());
        assertEquals(0, room.entityManager().count(), "no tanks spawn during countdown");

        int ticks = 0;
        while (room.matchPhase() == MatchPhase.COUNTDOWN && ticks < 1000) {
            room.tickCountdownPhase();
            ticks++;
        }

        assertEquals(180, ticks, "3 seconds at 60 TPS");
        assertEquals(MatchPhase.PLAYING, room.matchPhase());

        List<Integer> countdownSeconds = countdownSecondsBroadcast(host);
        assertEquals(List.of(3, 2, 1), countdownSeconds, "clients see 3, 2, 1");
    }

    private static List<Integer> countdownSecondsBroadcast(EmbeddedChannel channel) throws Exception {
        List<Integer> seconds = new ArrayList<>();
        Object outbound;
        while ((outbound = channel.readOutbound()) != null) {
            MessageEnvelope envelope = (MessageEnvelope) outbound;
            GameMessage message = GameMessage.parseFrom(envelope.getPayload());
            if (message.getContentCase() == GameMessage.ContentCase.MATCHPHASEUPDATE
                    && message.getMatchPhaseUpdate().getPhase()
                    == com.triforge.protocol.proto.MatchPhase.COUNTDOWN) {
                seconds.add(message.getMatchPhaseUpdate().getCountdownSeconds());
            }
        }
        return seconds;
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
