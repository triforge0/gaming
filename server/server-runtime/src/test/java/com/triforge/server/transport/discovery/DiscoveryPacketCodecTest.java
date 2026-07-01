package com.triforge.server.transport.discovery;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class DiscoveryPacketCodecTest {

    @Test
    void encodesAndDecodesPresenceWithMagicPrefix() throws Exception {
        HostPresenceAdvertisement presence = new HostPresenceAdvertisement(
                "host-123",
                "192.168.1.10",
                8080,
                1_700_000_000_000L
        );

        byte[] payload = DiscoveryPacketCodec.encode(presence);
        assertTrue(DiscoveryPacketCodec.hasMagic(payload, 0, payload.length));

        DiscoveryPacketCodec.JsonSlice slice = DiscoveryPacketCodec.decode(payload, 0, payload.length);
        assertNotNull(slice);

        HostPresenceAdvertisement parsed = NetworkUtils.objectMapper().readValue(
                DiscoveryPacketCodec.toJson(payload, slice),
                HostPresenceAdvertisement.class
        );
        assertEquals("host-123", parsed.hostId());
        assertEquals("192.168.1.10", parsed.hostIp());
    }

    @Test
    void acceptsLegacyJsonWithoutMagicPrefix() throws Exception {
        byte[] json = "{\"schemaVersion\":\"1\",\"type\":\"tank-arena-host-presence\",\"hostId\":\"h1\",\"hostIp\":\"10.0.0.2\",\"port\":8080,\"timestampMs\":1}"
                .getBytes(StandardCharsets.UTF_8);

        DiscoveryPacketCodec.JsonSlice slice = DiscoveryPacketCodec.decode(json, 0, json.length);
        assertNotNull(slice);

        HostPresenceAdvertisement parsed = NetworkUtils.objectMapper().readValue(
                DiscoveryPacketCodec.toJson(json, slice),
                HostPresenceAdvertisement.class
        );
        assertEquals("h1", parsed.hostId());
    }

    @Test
    void ignoresBinaryNoise() {
        byte[] noise = new byte[] {(byte) 0xFF, (byte) 0xFE, 0x01, 0x02};
        assertNull(DiscoveryPacketCodec.decode(noise, 0, noise.length));
    }
}
