package com.triforge.server.transport.discovery;

import com.triforge.server.application.room.RoomRegistry;
import com.triforge.games.tankarena.TankArenaPlugin;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class DiscoveryServiceTest {

    @Test
    void includesLocalHostAndRemoteDiscoveredHosts() {
        RoomRegistry registry = new RoomRegistry();
        registry.ensureRoom("main", "Main Arena");

        UdpDiscoveryListener listener = new UdpDiscoveryListener();
        String localHostId = UUID.randomUUID().toString();
        DiscoveryService localService = new DiscoveryService(
                registry,
                listener,
                localHostId,
                "192.168.1.10",
                8080
        );

        HostPresenceAdvertisement remote = new HostPresenceAdvertisement(
                UUID.randomUUID().toString(),
                "192.168.1.20",
                8080,
                System.currentTimeMillis()
        );
        listener.registerPresence(remote);

        LobbySnapshot snapshot = localService.buildLobbySnapshot();
        assertEquals(2, snapshot.hosts().size());
        assertEquals(UdpDiscoveryListener.ENTRY_TTL_MS, snapshot.ttlMs());
        assertTrue(snapshot.hosts().stream().anyMatch(host -> "192.168.1.10".equals(host.hostIp())));
        assertTrue(snapshot.hosts().stream().anyMatch(host -> "192.168.1.20".equals(host.hostIp())));

        registry.clear();
    }

    @Test
    void dedupesRemoteHostsByHostId() {
        RoomRegistry registry = new RoomRegistry();
        UdpDiscoveryListener listener = new UdpDiscoveryListener();
        DiscoveryService localService = new DiscoveryService(
                registry,
                listener,
                UUID.randomUUID().toString(),
                "192.168.1.10",
                8080
        );

        String remoteHostId = UUID.randomUUID().toString();
        listener.registerPresence(new HostPresenceAdvertisement(
                remoteHostId,
                "192.168.1.20",
                8080,
                System.currentTimeMillis()
        ));
        listener.registerPresence(new HostPresenceAdvertisement(
                remoteHostId,
                "192.168.1.21",
                8080,
                System.currentTimeMillis()
        ));

        LobbySnapshot snapshot = localService.buildLobbySnapshot();
        assertEquals(2, snapshot.hosts().size());
        assertTrue(snapshot.hosts().stream().anyMatch(host -> remoteHostId.equals(host.hostId())));

        registry.clear();
    }

    @Test
    void serializesPresencePayloadWithoutRooms() throws Exception {
        HostPresenceAdvertisement presence = new HostPresenceAdvertisement(
                "host-123",
                "10.0.0.5",
                8080,
                1_700_000_000_000L
        );

        byte[] json = NetworkUtils.objectMapper().writeValueAsBytes(presence);
        String jsonText = new String(json);
        assertFalse(jsonText.contains("rooms"));

        HostPresenceAdvertisement parsed = NetworkUtils.objectMapper()
                .readValue(json, HostPresenceAdvertisement.class);

        assertEquals("10.0.0.5", parsed.hostIp());
        assertEquals(8080, parsed.port());
        assertEquals("host-123", parsed.hostId());
        assertEquals(DiscoveryConstants.SCHEMA_VERSION, parsed.schemaVersion());
    }

    @Test
    void listsLocalRoomsFromRegistry() {
        RoomRegistry registry = new RoomRegistry();
        registry.ensureRoom("main", "Main Arena");
        registry.ensureRoom("duel", "Duel Pit");

        UdpDiscoveryListener listener = new UdpDiscoveryListener();
        String hostId = UUID.randomUUID().toString();
        DiscoveryService service = new DiscoveryService(registry, listener, hostId, "127.0.0.1", 8080);

        RoomsResponse response = service.listLocalRooms();
        assertEquals(hostId, response.hostId());
        assertEquals(TankArenaPlugin.ID, response.defaultGamePluginId());
        assertEquals(2, response.rooms().size());
        assertTrue(response.rooms().stream().anyMatch(room -> "main".equals(room.roomId())));
        assertEquals("Tank Arena", response.rooms().get(0).gameDisplayName());

        registry.clear();
    }

    @Test
    void listsAvailablePlugins() {
        RoomRegistry registry = new RoomRegistry();
        UdpDiscoveryListener listener = new UdpDiscoveryListener();
        DiscoveryService service = new DiscoveryService(
                registry,
                listener,
                UUID.randomUUID().toString(),
                "127.0.0.1",
                8080
        );

        PluginsResponse response = service.listAvailablePlugins();
        assertTrue(response.plugins().stream()
                .anyMatch(plugin -> TankArenaPlugin.ID.equals(plugin.id())));

        registry.clear();
    }

    @Test
    void marksRemoteHostStaleWhenHeartbeatIsAging() {
        RoomRegistry registry = new RoomRegistry();
        UdpDiscoveryListener listener = new UdpDiscoveryListener();
        DiscoveryService localService = new DiscoveryService(
                registry,
                listener,
                UUID.randomUUID().toString(),
                "192.168.1.10",
                8080
        );

        HostPresenceAdvertisement remote = new HostPresenceAdvertisement(
                UUID.randomUUID().toString(),
                "192.168.1.20",
                8080,
                System.currentTimeMillis()
        );
        long agingLastSeen = System.currentTimeMillis() - (UdpDiscoveryListener.ENTRY_TTL_MS * 2 / 3);
        listener.registerPresence(remote, agingLastSeen);

        HostPresence remoteHost = localService.buildLobbySnapshot().hosts().stream()
                .filter(host -> "192.168.1.20".equals(host.hostIp()))
                .findFirst()
                .orElseThrow();
        assertTrue(remoteHost.stale());
        assertFalse(localService.buildLobbySnapshot().hosts().stream()
                .filter(host -> "192.168.1.10".equals(host.hostIp()))
                .findFirst()
                .orElseThrow()
                .stale());

        registry.clear();
    }
}
