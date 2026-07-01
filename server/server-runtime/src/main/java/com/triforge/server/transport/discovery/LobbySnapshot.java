package com.triforge.server.transport.discovery;

import java.util.List;

public record LobbySnapshot(
        List<HostPresence> hosts,
        long timestampMs,
        long ttlMs
) {
}
