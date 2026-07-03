package com.triforge.server.application.room.chat;

import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomSessionAccess;
import com.triforge.protocol.proto.ChatMessage;
import com.triforge.protocol.proto.GameMessage;

import java.util.Objects;
import java.util.function.LongSupplier;

public final class RoomChatService {
    static final int MAX_TEXT_LENGTH = 200;
    private static final String SYSTEM_SENDER_NAME = "System";

    private final RoomBroadcastAccess broadcaster;
    private final RoomSessionAccess sessions;
    private final LongSupplier currentTick;
    private final ChatRateLimiter rateLimiter;
    private final ChatHistory history;

    public RoomChatService(
            RoomBroadcastAccess broadcaster,
            RoomSessionAccess sessions,
            LongSupplier currentTick) {
        this(broadcaster, sessions, currentTick, new ChatRateLimiter(), new NoOpChatHistory());
    }

    RoomChatService(
            RoomBroadcastAccess broadcaster,
            RoomSessionAccess sessions,
            LongSupplier currentTick,
            ChatRateLimiter rateLimiter,
            ChatHistory history) {
        this.broadcaster = Objects.requireNonNull(broadcaster, "broadcaster");
        this.sessions = Objects.requireNonNull(sessions, "sessions");
        this.currentTick = Objects.requireNonNull(currentTick, "currentTick");
        this.rateLimiter = Objects.requireNonNull(rateLimiter, "rateLimiter");
        this.history = Objects.requireNonNull(history, "history");
    }

    public void handle(long playerId, String text) {
        if (!rateLimiter.allow(playerId)) {
            return;
        }
        String sanitized = sanitize(text);
        if (sanitized == null) {
            return;
        }
        broadcast(playerId, sessions.displayNameOf(playerId), sanitized);
    }

    public void announce(String text) {
        String sanitized = sanitize(text);
        if (sanitized == null) {
            return;
        }
        broadcast(0L, SYSTEM_SENDER_NAME, sanitized);
    }

    private void broadcast(long senderPlayerId, String senderName, String text) {
        ChatMessage chatMessage = ChatMessage.newBuilder()
                .setSenderPlayerId(senderPlayerId)
                .setSenderName(senderName)
                .setText(text)
                .setTick(currentTick.getAsLong())
                .build();
        history.append(chatMessage);
        broadcaster.broadcast(GameMessage.newBuilder().setChatMessage(chatMessage).build());
    }

    private static String sanitize(String text) {
        if (text == null) {
            return null;
        }
        String trimmed = text.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (trimmed.length() > MAX_TEXT_LENGTH) {
            return trimmed.substring(0, MAX_TEXT_LENGTH);
        }
        return trimmed;
    }
}
