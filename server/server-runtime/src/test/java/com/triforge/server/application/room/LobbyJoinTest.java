package com.triforge.server.application.room;

import com.triforge.engine.match.MatchPhase;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LobbyJoinTest {

    @Test
    void joinAddsLobbyPlayerWithoutSpawningTank() throws InterruptedException {
        try (GameRoom room = new GameRoom("lobby-room")) {
            room.start();

            EmbeddedChannel channel = new EmbeddedChannel();
            room.enqueueCommand(() -> room.handleJoinRequest("Thắng", channel));

            assertEquals(MatchPhase.LOBBY, onRoomThread(room, room::matchPhase));
            assertEquals(1, onRoomThread(room, () -> TankArenaRoomSupport.match(room).playerCount()));
            assertEquals(0, onRoomThread(room, () -> room.entityManager().count()),
                    "no tank entity should exist in the lobby");
            assertTrue(onRoomThread(room, () -> TankArenaRoomSupport.match(room).isHost(1L)),
                    "first joiner becomes host");
            assertEquals(1L, onRoomThread(room, () -> TankArenaRoomSupport.match(room).player(1L).playerId()));
        }
    }

    @Test
    void leaveRemovesPlayerAndReassignsHost() throws InterruptedException {
        try (GameRoom room = new GameRoom("lobby-room-2")) {
            room.start();

            room.enqueueCommand(() -> room.handleJoinRequest("Thắng", new EmbeddedChannel()));
            room.enqueueCommand(() -> room.handleJoinRequest("An", new EmbeddedChannel()));
            assertEquals(2, onRoomThread(room, () -> TankArenaRoomSupport.match(room).playerCount()));
            assertTrue(onRoomThread(room, () -> TankArenaRoomSupport.match(room).isHost(1L)));

            room.enqueueCommand(() -> room.handleLeaveRequest(1L));
            assertEquals(1, onRoomThread(room, () -> TankArenaRoomSupport.match(room).playerCount()));
            assertFalse(onRoomThread(room, () -> TankArenaRoomSupport.match(room).isHost(1L)));
            assertEquals(2L, onRoomThread(room, () -> TankArenaRoomSupport.match(room).hostPlayerId()),
                    "host reassigned to remaining player");
        }
    }

    @Test
    void blankNameFallsBackToGeneratedName() throws InterruptedException {
        try (GameRoom room = new GameRoom("lobby-room-3")) {
            room.start();

            room.enqueueCommand(() -> room.handleJoinRequest("   ", new EmbeddedChannel()));

            assertEquals("Player-1", onRoomThread(room, () -> TankArenaRoomSupport.match(room).player(1L).displayName()));
        }
    }

    /** Runs the supplier on the room's game-loop thread (after all prior commands) and returns its value. */
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
