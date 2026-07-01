package com.triforge.server.transport.discovery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

public final class UdpAdvertiser implements AutoCloseable {
    private static final Logger logger = LoggerFactory.getLogger(UdpAdvertiser.class);

    public static final int DISCOVERY_PORT = 9999;
    public static final long ADVERTISE_INTERVAL_MS = 1_000L;

    private final DiscoveryService discoveryService;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread thread;

    public UdpAdvertiser(DiscoveryService discoveryService) {
        this.discoveryService = Objects.requireNonNull(discoveryService, "discoveryService");
    }

    public void start() {
        if (!running.compareAndSet(false, true)) {
            return;
        }
        thread = new Thread(this::broadcastLoop, "udp-advertiser");
        thread.setDaemon(true);
        thread.start();
        logger.info("UDP advertiser started on port {}", DISCOVERY_PORT);
    }

    public void stop() {
        running.set(false);
        if (thread != null) {
            thread.interrupt();
        }
    }

    @Override
    public void close() {
        stop();
    }

    private void broadcastLoop() {
        while (running.get()) {
            try {
                broadcastOnce();
                Thread.sleep(ADVERTISE_INTERVAL_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            } catch (Exception e) {
                logger.warn("Failed to broadcast discovery packet", e);
            }
        }
    }

    private void broadcastOnce() throws Exception {
        HostPresenceAdvertisement presence = discoveryService.buildLocalPresenceAdvertisement();
        byte[] payload = DiscoveryPacketCodec.encode(presence);

        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true);
            InetAddress broadcastAddress = InetAddress.getByName("255.255.255.255");
            DatagramPacket packet = new DatagramPacket(
                    payload,
                    payload.length,
                    broadcastAddress,
                    DISCOVERY_PORT
            );
            socket.send(packet);
        }
    }
}
