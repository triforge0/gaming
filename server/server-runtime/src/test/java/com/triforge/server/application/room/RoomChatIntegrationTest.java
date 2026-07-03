package com.triforge.server.application.room;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.ChatMessage;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MessageEnvelope;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class RoomChatIntegrationTest {

    @Test
    void chatBroadcastsToAllConnectedPlayers() throws Exception {
        try (GameRoom room = new GameRoom("chat-room")) {
            room.start();

            EmbeddedChannel alice = new EmbeddedChannel();
            EmbeddedChannel bob = new EmbeddedChannel();
            room.enqueueCommand(() -> room.handleJoinRequest("Alice", alice));
            room.enqueueCommand(() -> room.handleJoinRequest("Bob", bob));
            awaitRoom(room, () -> null);
            drainOutbound(alice);
            drainOutbound(bob);

            room.enqueueCommand(() -> room.handleChatCommand(1L, "hello everyone"));
            awaitRoom(room, () -> null);

            ChatMessage aliceChat = readLastChatMessage(alice);
            ChatMessage bobChat = readLastChatMessage(bob);

            assertEquals(1L, aliceChat.getSenderPlayerId());
            assertEquals("Alice", aliceChat.getSenderName());
            assertEquals("hello everyone", aliceChat.getText());
            assertEquals(aliceChat.getText(), bobChat.getText());
            assertEquals(aliceChat.getSenderName(), bobChat.getSenderName());
        }
    }

    @Test
    void joinLeaveAndMatchStartEmitSystemChat() throws Exception {
        try (GameRoom joinRoom = new GameRoom("chat-room-events")) {
            joinRoom.start();

            EmbeddedChannel scout = new EmbeddedChannel();
            joinRoom.enqueueCommand(() -> joinRoom.handleJoinRequest("Scout", scout));
            awaitRoom(joinRoom, () -> null);
            ChatMessage joined = readLastChatMessage(scout);
            assertEquals(0L, joined.getSenderPlayerId());
            assertTrue(joined.getText().contains("Scout"));
            assertTrue(joined.getText().contains("joined"));

            EmbeddedChannel buddy = new EmbeddedChannel();
            joinRoom.enqueueCommand(() -> joinRoom.handleJoinRequest("Buddy", buddy));
            awaitRoom(joinRoom, () -> null);
            drainOutbound(scout);
            drainOutbound(buddy);

            joinRoom.enqueueCommand(() -> joinRoom.handleLeaveRequest(1L));
            awaitRoom(joinRoom, () -> null);
            ChatMessage left = readLastChatMessage(buddy);
            assertEquals(0L, left.getSenderPlayerId());
            assertTrue(left.getText().contains("Scout"));
            assertTrue(left.getText().contains("left"));
        }

        try (GameRoom room = new GameRoom("chat-room-match-start")) {
            room.start();

            EmbeddedChannel host = new EmbeddedChannel();
            EmbeddedChannel guest = new EmbeddedChannel();
            room.enqueueCommand(() -> room.handleJoinRequest("Host", host));
            awaitRoom(room, () -> null);
            drainOutbound(host);
            room.enqueueCommand(() -> room.handleJoinRequest("Guest", guest));
            awaitRoom(room, () -> null);
            drainOutbound(host);
            drainOutbound(guest);

            configureTeams(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);
            configureTeams(room, 2L, Team.BLUE, SpawnRegion.BOTTOM_RIGHT);
            awaitRoom(room, () -> null);
            room.enqueueCommand(() -> room.handleLobbyCommand(1L, ready(true)));
            room.enqueueCommand(() -> room.handleLobbyCommand(2L, ready(true)));
            awaitRoom(room, () -> null);
            driveCountdown(room);

            ChatMessage matchStarted = readLastSystemChat(host);
            assertEquals("Match started", matchStarted.getText());
        }
    }

    private static void configureTeams(GameRoom room, long playerId, Team team, SpawnRegion region) {
        room.enqueueCommand(() -> LobbyTestSupport.configureTeam(room, playerId, team, region));
    }

    private static LobbyCommand ready(boolean ready) {
        return LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(ready))
                .build();
    }

    private static void driveCountdown(GameRoom room) throws InterruptedException {
        awaitRoom(room, () -> {
            int guard = 0;
            while (room.matchPhase() == MatchPhase.COUNTDOWN && guard < 10_000) {
                room.tickCountdownPhase();
                guard++;
            }
            return null;
        });
    }

    private static ChatMessage readLastChatMessage(EmbeddedChannel channel) throws Exception {
        ChatMessage last = null;
        MessageEnvelope envelope;
        while ((envelope = channel.readOutbound()) != null) {
            GameMessage gameMessage = GameMessage.parseFrom(envelope.getPayload());
            if (gameMessage.hasChatMessage()) {
                last = gameMessage.getChatMessage();
            }
        }
        assertNotNull(last, "expected outbound chat envelope");
        return last;
    }

    private static ChatMessage readLastSystemChat(EmbeddedChannel channel) throws Exception {
        ChatMessage last = null;
        MessageEnvelope envelope;
        while ((envelope = channel.readOutbound()) != null) {
            GameMessage gameMessage = GameMessage.parseFrom(envelope.getPayload());
            if (gameMessage.hasChatMessage() && gameMessage.getChatMessage().getSenderPlayerId() == 0L) {
                last = gameMessage.getChatMessage();
            }
        }
        assertNotNull(last, "expected a system chat line");
        return last;
    }

    private static void drainOutbound(EmbeddedChannel channel) {
        while (channel.readOutbound() != null) {
        }
    }

    private static <T> T awaitRoom(GameRoom room, Supplier<T> supplier) throws InterruptedException {
        java.util.concurrent.atomic.AtomicReference<T> result = new java.util.concurrent.atomic.AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        room.enqueueCommand(() -> {
            result.set(supplier.get());
            latch.countDown();
        });
        assertTrue(latch.await(3, TimeUnit.SECONDS));
        return result.get();
    }
}
