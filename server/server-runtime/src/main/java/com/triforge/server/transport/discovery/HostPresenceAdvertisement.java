package com.triforge.server.transport.discovery;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HostPresenceAdvertisement(
        String schemaVersion,
        String type,
        String hostId,
        String hostIp,
        int port,
        long timestampMs
) {
    public HostPresenceAdvertisement {
        if (schemaVersion == null) {
            schemaVersion = DiscoveryConstants.SCHEMA_VERSION;
        }
        if (type == null) {
            type = DiscoveryConstants.PRESENCE_TYPE;
        }
    }

    public HostPresenceAdvertisement(String hostId, String hostIp, int port, long timestampMs) {
        this(DiscoveryConstants.SCHEMA_VERSION, DiscoveryConstants.PRESENCE_TYPE, hostId, hostIp, port, timestampMs);
    }

    public String cacheKey() {
        if (hostId != null && !hostId.isBlank()) {
            return hostId;
        }
        return hostIp + ":" + port;
    }

    public String endpointKey() {
        return hostIp + ":" + port;
    }
}
