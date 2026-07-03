package com.triforge.server.application.room.chat;

import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomSessionAccess;
import com.triforge.protocol.proto.ChatMessage;
import com.triforge.protocol.proto.GameMessage;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class RoomChatServiceTest {

    @Test
    void handleBroadcastsAuthoritativeSenderNameAndTruncates() {
        RecordingBroadcaster broadcaster = new RecordingBroadcaster();
        FakeSessions sessions = new FakeSessions();
        sessions.setDisplayName(7L, "Pilot");
        RoomChatService service = new RoomChatService(
                broadcaster,
                sessions,
                () -> 42L,
                new ChatRateLimiter(),
                new NoOpChatHistory());

        service.handle(7L, "  hello world  ");
        ChatMessage message = broadcaster.lastChatMessage();
        assertEquals(7L, message.getSenderPlayerId());
        assertEquals("Pilot", message.getSenderName());
        assertEquals("hello world", message.getText());
        assertEquals(42L, message.getTick());
    }

    @Test
    void handleDropsBlankAndTruncatesLongText() {
        RecordingBroadcaster broadcaster = new RecordingBroadcaster();
        FakeSessions sessions = new FakeSessions();
        RoomChatService service = new RoomChatService(
                broadcaster,
                sessions,
                () -> 0L,
                new ChatRateLimiter(),
                new NoOpChatHistory());

        service.handle(1L, "   ");
        assertTrue(broadcaster.messages.isEmpty());

        String longText = "x".repeat(RoomChatService.MAX_TEXT_LENGTH + 50);
        service.handle(1L, longText);
        assertEquals(RoomChatService.MAX_TEXT_LENGTH, broadcaster.lastChatMessage().getText().length());
    }

    @Test
    void handleEnforcesRateLimit() {
        RecordingBroadcaster broadcaster = new RecordingBroadcaster();
        FakeSessions sessions = new FakeSessions();
        ChatRateLimiter limiter = new ChatRateLimiter();
        RoomChatService service = new RoomChatService(
                broadcaster,
                sessions,
                () -> 0L,
                limiter,
                new NoOpChatHistory());

        for (int i = 0; i < ChatRateLimiter.MAX_MESSAGES; i++) {
            service.handle(1L, "msg " + i);
        }
        assertEquals(ChatRateLimiter.MAX_MESSAGES, broadcaster.messages.size());

        service.handle(1L, "blocked");
        assertEquals(ChatRateLimiter.MAX_MESSAGES, broadcaster.messages.size());
    }

    @Test
    void announceEmitsSystemLine() {
        RecordingBroadcaster broadcaster = new RecordingBroadcaster();
        FakeSessions sessions = new FakeSessions();
        RoomChatService service = new RoomChatService(
                broadcaster,
                sessions,
                () -> 9L,
                new ChatRateLimiter(),
                new NoOpChatHistory());

        service.announce("Match started");

        ChatMessage message = broadcaster.lastChatMessage();
        assertEquals(0L, message.getSenderPlayerId());
        assertEquals("System", message.getSenderName());
        assertEquals("Match started", message.getText());
        assertEquals(9L, message.getTick());
    }

    private static final class RecordingBroadcaster implements RoomBroadcastAccess {
        private final List<GameMessage> messages = new ArrayList<>();

        @Override
        public void broadcast(GameMessage message) {
            messages.add(message);
        }

        ChatMessage lastChatMessage() {
            assertFalse(messages.isEmpty());
            return messages.get(messages.size() - 1).getChatMessage();
        }

        @Override
        public void sendJoinResponse(io.netty.channel.Channel channel,
                                     com.triforge.protocol.proto.JoinResponse response) {
        }

        @Override
        public void sendTo(long playerId, GameMessage message) {
        }

        @Override
        public com.triforge.protocol.proto.JoinResponse.Builder joinResponseBuilder(
                long playerId,
                com.triforge.engine.game.Game game,
                com.triforge.protocol.proto.RoomLobbySnapshot lobby) {
            return com.triforge.protocol.proto.JoinResponse.newBuilder();
        }

        @Override
        public com.triforge.protocol.proto.JoinResponse.Builder rejectedJoinResponseBuilder(
                com.triforge.protocol.proto.RoomLobbySnapshot lobby) {
            return com.triforge.protocol.proto.JoinResponse.newBuilder();
        }

        @Override
        public void broadcastLobbySnapshot(com.triforge.engine.room.RoomHost host,
                                           com.triforge.engine.game.Game game) {
        }

        @Override
        public void broadcastMapSnapshot(com.triforge.engine.game.Game game) {
        }

        @Override
        public void broadcastMatchPhaseUpdate(
                com.triforge.engine.match.MatchController matchController,
                com.triforge.engine.game.RoomBroadcastView view) {
        }

        @Override
        public void broadcastMatchPhaseUpdate(com.triforge.engine.match.MatchController matchController) {
        }

        @Override
        public void broadcastMatchResult(com.triforge.engine.match.MatchController matchController,
                                         com.triforge.engine.game.Game game) {
        }

        @Override
        public void broadcastGameEvent(com.triforge.protocol.proto.GameEvent event) {
        }

        @Override
        public void broadcastFullSnapshot(com.triforge.engine.game.Game game, long tick) {
        }

        @Override
        public void broadcastStateSync(com.triforge.engine.game.Game game,
                                       long tick,
                                       List<com.triforge.protocol.proto.TileChange> pendingTileChanges) {
        }
    }

    private static final class FakeSessions implements RoomSessionAccess {
        private final java.util.Map<Long, String> names = new java.util.HashMap<>();

        @Override
        public long nextPlayerId() {
            return 1L;
        }

        @Override
        public void register(long playerId, io.netty.channel.Channel channel) {
        }

        @Override
        public void unregister(long playerId) {
            names.remove(playerId);
        }

        @Override
        public boolean isConnected(long playerId) {
            return true;
        }

        @Override
        public void setDisplayName(long playerId, String name) {
            names.put(playerId, name);
        }

        @Override
        public String displayNameOf(long playerId) {
            return names.getOrDefault(playerId, "Player-" + playerId);
        }
    }
}
