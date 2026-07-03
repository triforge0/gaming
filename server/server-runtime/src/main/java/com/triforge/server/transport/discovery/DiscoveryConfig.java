package com.triforge.server.transport.discovery;

import java.util.Optional;

public final class DiscoveryConfig {
    public static final String BIND_ADDRESS_PROPERTY = "tankarena.discovery.bindAddress";
    public static final String ADVERTISE_ADDRESS_PROPERTY = "tankarena.discovery.advertiseAddress";
    public static final String ENABLED_PROPERTY = "server.udpDiscovery";

    private final String bindAddress;
    private final String advertiseAddress;
    private final boolean enabled;

    private DiscoveryConfig(String bindAddress, String advertiseAddress, boolean enabled) {
        this.bindAddress = bindAddress;
        this.advertiseAddress = advertiseAddress;
        this.enabled = enabled;
    }

    public static DiscoveryConfig load() {
        return new DiscoveryConfig(
                readProperty(BIND_ADDRESS_PROPERTY),
                readProperty(ADVERTISE_ADDRESS_PROPERTY),
                readBooleanProperty(ENABLED_PROPERTY, true)
        );
    }

    public Optional<String> bindAddress() {
        return optionalNonBlank(bindAddress);
    }

    public Optional<String> advertiseAddress() {
        return optionalNonBlank(advertiseAddress);
    }

    /**
     * Whether the UDP broadcast listener/advertiser should run. Disable on hosts without
     * LAN broadcast (e.g. a VPS) via {@code -Dserver.udpDiscovery=false} or
     * {@code SERVER_UDPDISCOVERY=false}.
     */
    public boolean enabled() {
        return enabled;
    }

    private static String readProperty(String key) {
        String value = System.getProperty(key);
        if (value == null || value.isBlank()) {
            value = System.getenv(key.replace('.', '_').toUpperCase());
        }
        return value;
    }

    private static boolean readBooleanProperty(String key, boolean defaultValue) {
        String value = readProperty(key);
        return value == null || value.isBlank() ? defaultValue : Boolean.parseBoolean(value.trim());
    }

    private static Optional<String> optionalNonBlank(String value) {
        return value == null || value.isBlank() ? Optional.empty() : Optional.of(value.trim());
    }
}
