package com.triforge.server.transport.discovery;

import com.triforge.server.application.room.RoomRegistry;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public final class DiscoveryService {
    private final RoomRegistry roomRegistry;
    private final UdpDiscoveryListener discoveryListener;
    private final String hostId;
    private final String hostIp;
    private final int port;

    public DiscoveryService(
            RoomRegistry roomRegistry,
            UdpDiscoveryListener discoveryListener,
            String hostId,
            String hostIp,
            int port
    ) {
        this.roomRegistry = Objects.requireNonNull(roomRegistry, "roomRegistry");
        this.discoveryListener = Objects.requireNonNull(discoveryListener, "discoveryListener");
        this.hostId = Objects.requireNonNull(hostId, "hostId");
        this.hostIp = Objects.requireNonNull(hostIp, "hostIp");
        this.port = port;
    }

    public String hostId() {
        return hostId;
    }

    public String hostIp() {
        return hostIp;
    }

    public int port() {
        return port;
    }

    public HostPresenceAdvertisement buildLocalPresenceAdvertisement() {
        return new HostPresenceAdvertisement(hostId, hostIp, port, System.currentTimeMillis());
    }

    public LobbySnapshot buildLobbySnapshot() {
        long now = System.currentTimeMillis();
        List<HostPresence> hosts = new ArrayList<>();
        Set<String> seenHostIds = new HashSet<>();

        HostPresence localHost = localHostPresence(now);
        hosts.add(localHost);
        seenHostIds.add(hostId);

        for (HostPresenceAdvertisement advertisement : discoveryListener.activePresences()) {
            if (advertisement.hostId() != null && seenHostIds.contains(advertisement.hostId())) {
                continue;
            }
            if (advertisement.endpointKey().equals(hostIp + ":" + port)) {
                continue;
            }
            long lastSeenMs = discoveryListener.lastSeenMillis(advertisement.cacheKey());
            hosts.add(toHostPresence(advertisement, lastSeenMs, now));
            if (advertisement.hostId() != null) {
                seenHostIds.add(advertisement.hostId());
            }
        }

        hosts.sort(Comparator.comparing(HostPresence::hostIp).thenComparingInt(HostPresence::port));
        return new LobbySnapshot(hosts, now, UdpDiscoveryListener.ENTRY_TTL_MS);
    }

    public RoomsResponse listLocalRooms() {
        List<RoomSummary> rooms = roomRegistry.listRooms().stream()
                .map(summary -> new RoomSummary(
                        summary.roomId(),
                        summary.roomName(),
                        summary.playerCount(),
                        summary.maxPlayers(),
                        summary.gamePluginId(),
                        summary.gameDisplayName()
                ))
                .toList();
        return new RoomsResponse(
                DiscoveryConstants.SCHEMA_VERSION,
                hostId,
                hostIp,
                port,
                roomRegistry.defaultPluginId(),
                rooms,
                System.currentTimeMillis()
        );
    }

    public PluginsResponse listAvailablePlugins() {
        List<PluginsResponse.GamePluginEntry> plugins = roomRegistry.availablePlugins().stream()
                .map(plugin -> new PluginsResponse.GamePluginEntry(plugin.id(), plugin.displayName()))
                .toList();
        return new PluginsResponse(
                DiscoveryConstants.SCHEMA_VERSION,
                plugins,
                System.currentTimeMillis()
        );
    }

    public boolean isLocalHost(String requestedHostIp, int requestedPort) {
        return hostIp.equals(requestedHostIp) && port == requestedPort;
    }

    private HostPresence localHostPresence(long now) {
        return new HostPresence(
                DiscoveryConstants.SCHEMA_VERSION,
                hostId,
                hostIp,
                port,
                now,
                false
        );
    }

    private HostPresence toHostPresence(HostPresenceAdvertisement advertisement, long lastSeenMs, long now) {
        long ageMs = now - lastSeenMs;
        boolean stale = ageMs >= (UdpDiscoveryListener.ENTRY_TTL_MS * 2 / 3);
        return new HostPresence(
                advertisement.schemaVersion(),
                advertisement.hostId(),
                advertisement.hostIp(),
                advertisement.port(),
                lastSeenMs,
                stale
        );
    }
}
