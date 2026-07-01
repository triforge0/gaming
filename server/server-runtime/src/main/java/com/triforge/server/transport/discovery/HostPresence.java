package com.triforge.server.transport.discovery;

public record HostPresence(
        String schemaVersion,
        String hostId,
        String hostIp,
        int port,
        long lastSeenMs,
        boolean stale
) {
}
