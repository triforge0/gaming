package com.triforge.server.application.room;

import com.triforge.engine.room.RoomSessionAccess;
import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.BiConsumer;

/**
 * Owns connected client channels for a {@link GameRoom}. All mutation happens on the room's
 * game-loop thread except {@link #nextPlayerId()}, which is called before registration.
 */
public final class RoomSessionManager implements RoomSessionAccess {
    public static final AttributeKey<Long> PLAYER_ID_KEY = AttributeKey.valueOf("playerId");
    public static final AttributeKey<String> ROOM_ID_KEY = AttributeKey.valueOf("roomId");

    private final String roomId;
    private final Map<Long, Channel> clientSessions = new ConcurrentHashMap<>();
    private final Map<Long, String> displayNames = new ConcurrentHashMap<>();
    private final AtomicLong playerIds = new AtomicLong(1L);

    public RoomSessionManager(String roomId) {
        this.roomId = Objects.requireNonNull(roomId, "roomId");
    }

    public long nextPlayerId() {
        return playerIds.getAndIncrement();
    }

    public void register(long playerId, Channel channel) {
        Objects.requireNonNull(channel, "channel");
        clientSessions.put(playerId, channel);
        channel.attr(PLAYER_ID_KEY).set(playerId);
        channel.attr(ROOM_ID_KEY).set(roomId);
    }

    public void unregister(long playerId) {
        Channel channel = clientSessions.remove(playerId);
        displayNames.remove(playerId);
        if (channel != null) {
            channel.attr(PLAYER_ID_KEY).set(null);
            channel.attr(ROOM_ID_KEY).set(null);
        }
    }

    public boolean isConnected(long playerId) {
        return clientSessions.containsKey(playerId);
    }

    @Override
    public void setDisplayName(long playerId, String name) {
        if (name == null || name.isBlank()) {
            return;
        }
        displayNames.put(playerId, name.trim());
    }

    @Override
    public String displayNameOf(long playerId) {
        return displayNames.getOrDefault(playerId, "Player-" + playerId);
    }

    public boolean hasClients() {
        return !clientSessions.isEmpty();
    }

    public int connectedCount() {
        return clientSessions.size();
    }

    public Channel channelOf(long playerId) {
        return clientSessions.get(playerId);
    }

    public void forEachSession(BiConsumer<Long, Channel> action) {
        clientSessions.forEach(action);
    }

    public void clear() {
        clientSessions.clear();
    }
}
