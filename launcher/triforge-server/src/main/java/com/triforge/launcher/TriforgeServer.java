package com.triforge.launcher;

import com.triforge.server.application.ApplicationConfig;
import com.triforge.server.application.room.RoomRegistry;
import com.triforge.engine.game.GamePlugin;
import com.triforge.engine.game.GamePlugins;
import com.triforge.server.transport.discovery.DiscoveryConfig;
import com.triforge.server.transport.discovery.DiscoveryService;
import com.triforge.server.transport.discovery.NetworkUtils;
import com.triforge.server.transport.discovery.UdpAdvertiser;
import com.triforge.server.transport.discovery.UdpDiscoveryListener;
import com.triforge.server.transport.netty.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public final class TriforgeServer {
    private static final Logger logger = LoggerFactory.getLogger(TriforgeServer.class);
    private static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                logger.warn("Invalid port specified: '{}'. Falling back to default port: {}", args[0], DEFAULT_PORT);
            }
        }

        DiscoveryConfig discoveryConfig = DiscoveryConfig.load();
        String hostIp = discoveryConfig.advertiseAddress()
                .orElseGet(NetworkUtils::resolveLocalHostAddress);
        String hostId = UUID.randomUUID().toString();

        ApplicationConfig appConfig = ApplicationConfig.load();
        logRegisteredPlugins(appConfig);

        RoomRegistry roomRegistry = new RoomRegistry(appConfig.defaultPlugin());
        roomRegistry.ensureRoom("main", "Main Arena");
        roomRegistry.ensureRoom("quest", "Treasure Quest", "treasurequest");

        boolean udpDiscoveryEnabled = discoveryConfig.enabled();
        if (!udpDiscoveryEnabled) {
            logger.info("UDP discovery disabled ({}=false)", DiscoveryConfig.ENABLED_PROPERTY);
        }

        try (UdpDiscoveryListener discoveryListener = new UdpDiscoveryListener(discoveryConfig.bindAddress())) {
            if (udpDiscoveryEnabled) {
                discoveryListener.start();
            }

            DiscoveryService discoveryService = new DiscoveryService(
                    roomRegistry,
                    discoveryListener,
                    hostId,
                    hostIp,
                    port
            );

            try (UdpAdvertiser udpAdvertiser = new UdpAdvertiser(discoveryService)) {
                if (udpDiscoveryEnabled) {
                    udpAdvertiser.start();
                }

                WebSocketServer server = new WebSocketServer(port, roomRegistry, discoveryService);

                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    logger.info("Shutdown hook triggered. Cleaning up...");
                    udpAdvertiser.close();
                    discoveryListener.close();
                    server.stop();
                }, "shutdown-hook"));

                try {
                    server.start();
                    logger.info(
                            "Triforge host ready at http://{}:{} (hostId={}, LAN IP: {})",
                            hostIp,
                            port,
                            hostId,
                            hostIp
                    );
                    Thread.currentThread().join();
                } catch (InterruptedException e) {
                    logger.info("Main thread interrupted. Stopping server...");
                    Thread.currentThread().interrupt();
                } catch (Exception e) {
                    logger.error("Failed to start server due to unexpected exception", e);
                    System.exit(1);
                } finally {
                    server.stop();
                }
            }
        }
    }

    private static void logRegisteredPlugins(ApplicationConfig appConfig) {
        var plugins = GamePlugins.loadAll();
        if (plugins.isEmpty()) {
            logger.warn("No GamePlugin implementations found on classpath");
            return;
        }
        for (GamePlugin plugin : plugins) {
            logger.info("Registered game plugin: id={}, name={}", plugin.id(), plugin.displayName());
        }
        logger.info("Default game plugin: {}", GamePlugins.DEFAULT_PLUGIN_ID);
        logger.info("Host default game plugin: {}", appConfig.defaultGamePluginId());
    }
}
