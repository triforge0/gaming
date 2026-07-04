package com.triforge.server.transport.discovery;

public record RoomSummary(
        String roomId,
        String roomName,
        int playerCount,
        int maxPlayers,
        String gamePluginId,
        String gameDisplayName,
        String hostDisplayName
) {
    public RoomSummary(
            String roomId,
            String roomName,
            int playerCount,
            int maxPlayers,
            String gamePluginId,
            String gameDisplayName
    ) {
        this(roomId, roomName, playerCount, maxPlayers, gamePluginId, gameDisplayName, "");
    }
}
