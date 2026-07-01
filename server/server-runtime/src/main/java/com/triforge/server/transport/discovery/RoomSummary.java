package com.triforge.server.transport.discovery;

public record RoomSummary(
        String roomId,
        String roomName,
        int playerCount,
        int maxPlayers,
        String gamePluginId,
        String gameDisplayName
) {
}
