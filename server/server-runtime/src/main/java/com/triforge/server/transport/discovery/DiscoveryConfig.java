package com.triforge.server.transport.discovery;

import java.util.Optional;

public final class DiscoveryConfig {
    public static final String BIND_ADDRESS_PROPERTY = "tankarena.discovery.bindAddress";
    public static final String ADVERTISE_ADDRESS_PROPERTY = "tankarena.discovery.advertiseAddress";

    private final String bindAddress;
    private final String advertiseAddress;

    private DiscoveryConfig(String bindAddress, String advertiseAddress) {
        this.bindAddress = bindAddress;
        this.advertiseAddress = advertiseAddress;
    }

    public static DiscoveryConfig load() {
        return new DiscoveryConfig(
                readProperty(BIND_ADDRESS_PROPERTY),
                readProperty(ADVERTISE_ADDRESS_PROPERTY)
        );
    }

    public Optional<String> bindAddress() {
        return optionalNonBlank(bindAddress);
    }

    public Optional<String> advertiseAddress() {
        return optionalNonBlank(advertiseAddress);
    }

    private static String readProperty(String key) {
        String value = System.getProperty(key);
        if (value == null || value.isBlank()) {
            value = System.getenv(key.replace('.', '_').toUpperCase());
        }
        return value;
    }

    private static Optional<String> optionalNonBlank(String value) {
        return value == null || value.isBlank() ? Optional.empty() : Optional.of(value.trim());
    }
}
