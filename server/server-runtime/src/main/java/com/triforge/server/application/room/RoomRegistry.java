package com.triforge.server.application.room;

import com.triforge.engine.game.GamePlugin;
import com.triforge.engine.game.GamePlugins;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public final class RoomRegistry {
    public static final int DEFAULT_MAX_PLAYERS = 16;

    private final GamePlugin defaultPlugin;
    private final ConcurrentMap<String, GameRoom> rooms = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, String> roomNames = new ConcurrentHashMap<>();

    public RoomRegistry() {
        this(GamePlugins.defaultPlugin());
    }

    public RoomRegistry(GamePlugin defaultPlugin) {
        this.defaultPlugin = Objects.requireNonNull(defaultPlugin, "defaultPlugin");
    }

    public GamePlugin defaultPlugin() {
        return defaultPlugin;
    }

    public String defaultPluginId() {
        return defaultPlugin.id();
    }

    public List<AvailablePlugin> availablePlugins() {
        return GamePlugins.loadAll().stream()
                .map(plugin -> new AvailablePlugin(plugin.id(), plugin.displayName()))
                .sorted((left, right) -> left.id().compareToIgnoreCase(right.id()))
                .toList();
    }

    public GameRoom getOrCreate(String roomId) {
        GameRoom existing = rooms.get(roomId);
        if (existing != null) {
            return existing;
        }

        String pluginId = defaultPluginId();
        int delimiterIndex = roomId.indexOf(':');
        if (delimiterIndex > 0) {
            String prefix = roomId.substring(0, delimiterIndex);
            if (GamePlugins.loadAll().stream().anyMatch(p -> p.id().equals(prefix))) {
                pluginId = prefix;
            }
        }

        return ensureRoom(roomId, formatRoomName(roomId), pluginId);
    }

    public GameRoom ensureRoom(String roomId, String roomName) {
        return ensureRoom(roomId, roomName, defaultPlugin);
    }

    public GameRoom ensureRoom(String roomId, String roomName, String pluginId) {
        return ensureRoom(roomId, roomName, GamePlugins.require(pluginId));
    }

    public GameRoom ensureRoom(String roomId, String roomName, GamePlugin plugin) {
        Objects.requireNonNull(roomId, "roomId");
        Objects.requireNonNull(roomName, "roomName");
        Objects.requireNonNull(plugin, "plugin");
        roomNames.put(roomId, roomName);

        GameRoom existing = rooms.get(roomId);
        if (existing != null) {
            if (!existing.plugin().id().equals(plugin.id())) {
                throw new IllegalStateException(
                        "Room '" + roomId + "' already uses plugin '" + existing.plugin().id()
                                + "', cannot recreate with '" + plugin.id() + "'");
            }
            return existing;
        }

        return rooms.computeIfAbsent(roomId, id -> {
            GameRoom room = GameRoom.builder(id)
                    .plugin(plugin)
                    .roomName(roomName)
                    .build();
            room.start();
            return room;
        });
    }

    public Optional<GameRoom> get(String roomId) {
        Objects.requireNonNull(roomId, "roomId");
        return Optional.ofNullable(rooms.get(roomId));
    }

    public void remove(String roomId) {
        Objects.requireNonNull(roomId, "roomId");
        GameRoom room = rooms.remove(roomId);
        roomNames.remove(roomId);
        if (room != null) {
            room.stop();
        }
    }

    public Collection<GameRoom> allRooms() {
        return rooms.values();
    }

    public List<RoomSummary> listRooms() {
        return rooms.entrySet().stream()
                .map(entry -> toSummary(entry.getKey(), entry.getValue()))
                .sorted((left, right) -> left.roomId().compareToIgnoreCase(right.roomId()))
                .toList();
    }

    public int totalPlayerCount() {
        return rooms.values().stream()
                .mapToInt(GameRoom::connectedClientCount)
                .sum();
    }

    public void clear() {
        for (GameRoom room : rooms.values()) {
            room.stop();
        }
        rooms.clear();
        roomNames.clear();
    }

    private RoomSummary toSummary(String roomId, GameRoom room) {
        GamePlugin plugin = room.plugin();
        return new RoomSummary(
                roomId,
                roomNames.getOrDefault(roomId, formatRoomName(roomId)),
                room.connectedClientCount(),
                DEFAULT_MAX_PLAYERS,
                plugin.id(),
                plugin.displayName()
        );
    }

    private static String formatRoomName(String roomId) {
        if ("main".equalsIgnoreCase(roomId)) {
            return "Main Arena";
        }
        if ("quest".equalsIgnoreCase(roomId)) {
            return "Treasure Quest";
        }
        return roomId;
    }

    public record AvailablePlugin(String id, String displayName) {
    }

    public record RoomSummary(
            String roomId,
            String roomName,
            int playerCount,
            int maxPlayers,
            String gamePluginId,
            String gameDisplayName
    ) {
    }
}
