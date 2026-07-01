package com.triforge.server.transport.discovery;

import java.util.List;

public record RoomsResponse(
        String schemaVersion,
        String hostId,
        String hostIp,
        int port,
        String defaultGamePluginId,
        List<RoomSummary> rooms,
        long timestampMs
) {
}
