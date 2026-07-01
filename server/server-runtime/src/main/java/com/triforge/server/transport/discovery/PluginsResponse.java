package com.triforge.server.transport.discovery;

import java.util.List;

public record PluginsResponse(
        String schemaVersion,
        List<GamePluginEntry> plugins,
        long timestampMs
) {
    public record GamePluginEntry(String id, String displayName) {
    }
}
