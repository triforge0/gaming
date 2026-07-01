package com.triforge.server.transport.discovery;

import java.nio.charset.StandardCharsets;

final class DiscoveryPacketCodec {
    static final byte[] MAGIC = new byte[] {'T', 'A', '1', 0};

    private DiscoveryPacketCodec() {
    }

    static byte[] encode(HostPresenceAdvertisement presence) throws java.io.IOException {
        byte[] json = NetworkUtils.objectMapper().writeValueAsBytes(presence);
        byte[] payload = new byte[MAGIC.length + json.length];
        System.arraycopy(MAGIC, 0, payload, 0, MAGIC.length);
        System.arraycopy(json, 0, payload, MAGIC.length, json.length);
        return payload;
    }

    static JsonSlice decode(byte[] data, int offset, int length) {
        if (length <= 0) {
            return null;
        }
        if (hasMagic(data, offset, length)) {
            return new JsonSlice(offset + MAGIC.length, length - MAGIC.length);
        }
        if (data[offset] == '{') {
            return new JsonSlice(offset, length);
        }
        return null;
    }

    static boolean hasMagic(byte[] data, int offset, int length) {
        if (length < MAGIC.length) {
            return false;
        }
        for (int i = 0; i < MAGIC.length; i++) {
            if (data[offset + i] != MAGIC[i]) {
                return false;
            }
        }
        return true;
    }

    static String toJson(byte[] data, JsonSlice slice) {
        return new String(data, slice.offset(), slice.length(), StandardCharsets.UTF_8);
    }

    record JsonSlice(int offset, int length) {
    }
}
