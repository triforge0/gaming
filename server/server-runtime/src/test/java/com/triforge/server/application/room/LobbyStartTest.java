package com.triforge.server.application.room;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.StartMatchAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LobbyStartTest {

    @Test
    void fourReadyPlayersAutoStartCountdown() throws InterruptedException {
        try (GameRoom room = new GameRoom("start-room")) {
            room.start();
            joinAndReady(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);
            joinAndReady(room, 2L, Team.BLUE, SpawnRegion.TOP_RIGHT);
            joinAndReady(room, 3L, Team.RED, SpawnRegion.BOTTOM_LEFT);
            joinAndReady(room, 4L, Team.BLUE, SpawnRegion.BOTTOM_RIGHT);

            assertEquals(MatchPhase.COUNTDOWN, onRoomThread(room, room::matchPhase),
                    "all four ready → auto-start countdown");
        }
    }

    @Test
    void singleReadyPlayerDoesNotStart() throws InterruptedException {
        try (GameRoom room = new GameRoom("start-room-1")) {
            room.start();
            joinAndReady(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);

            assertEquals(MatchPhase.LOBBY, onRoomThread(room, room::matchPhase),
                    "one player is below minPlayers → stays in lobby");
        }
    }

    @Test
    void nonHostStartIsIgnored() throws InterruptedException {
        try (GameRoom room = new GameRoom("start-room-2")) {
            room.start();
            // Two ready players, but suppress auto-start by making the second not ready,
            // then have the non-host issue StartMatch.
            joinAndReady(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);  // host
            join(room, 2L);
            configure(room, 2L, Team.BLUE, SpawnRegion.TOP_RIGHT);   // player 2 not ready

            room.enqueueCommand(() -> room.handleLobbyCommand(2L, LobbyCommand.newBuilder()
                    .setStartMatch(StartMatchAction.getDefaultInstance()).build()));

            assertEquals(MatchPhase.LOBBY, onRoomThread(room, room::matchPhase),
                    "non-host start with an unready player must not start");
        }
    }

    private void joinAndReady(GameRoom room, long playerId, Team team, SpawnRegion region) {
        join(room, playerId);
        room.enqueueCommand(() -> {
            room.handleLobbyCommand(playerId, LobbyCommand.newBuilder()
                    .setSetTeam(com.triforge.protocol.proto.SetTeamAction.newBuilder()
                            .setTeam(toProto(team))).build());
            if (TankArenaRoomSupport.match(room).player(playerId).isTeamCaptain()) {
                LobbyTestSupport.configureTeam(room, playerId, team, region);
            }
            room.handleLobbyCommand(playerId, ready(true));
        });
    }

    private void join(GameRoom room, long playerId) {
        room.enqueueCommand(() -> room.handleJoinRequest("P" + playerId, new EmbeddedChannel()));
    }

    private void configure(GameRoom room, long playerId, Team team, SpawnRegion region) {
        LobbyTestSupport.configureTeam(room, playerId, team, region);
    }

    private static LobbyCommand ready(boolean ready) {
        return LobbyCommand.newBuilder()
                .setSetReady(com.triforge.protocol.proto.SetReadyAction.newBuilder().setReady(ready))
                .build();
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

    private static <T> T onRoomThread(GameRoom room, Supplier<T> supplier) throws InterruptedException {
        AtomicReference<T> result = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        room.enqueueCommand(() -> {
            result.set(supplier.get());
            latch.countDown();
        });
        assertTrue(latch.await(2, TimeUnit.SECONDS), "room command did not run in time");
        return result.get();
    }
}
