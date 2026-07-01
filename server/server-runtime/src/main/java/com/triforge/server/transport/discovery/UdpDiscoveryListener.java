package com.triforge.server.transport.discovery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public final class UdpDiscoveryListener implements AutoCloseable {
    private static final Logger logger = LoggerFactory.getLogger(UdpDiscoveryListener.class);

    public static final long ENTRY_TTL_MS = 3_000L;

    private final Optional<String> bindAddress;
    private final Map<String, CachedPresence> cache = new ConcurrentHashMap<>();
    private final AtomicLifecycle running = new AtomicLifecycle();
    private Thread thread;

    public UdpDiscoveryListener() {
        this(Optional.empty());
    }

    public UdpDiscoveryListener(Optional<String> bindAddress) {
        this.bindAddress = bindAddress != null ? bindAddress : Optional.empty();
    }

    public void start() {
        if (!running.start()) {
            return;
        }
        thread = new Thread(this::listenLoop, "udp-discovery-listener");
        thread.setDaemon(true);
        thread.start();
        logger.info("UDP discovery listener started on port {}", UdpAdvertiser.DISCOVERY_PORT);
    }

    public void stop() {
        running.stop();
        if (thread != null) {
            thread.interrupt();
        }
        cache.clear();
    }

    @Override
    public void close() {
        stop();
    }

    void registerPresence(HostPresenceAdvertisement presence) {
        registerPresence(presence, System.currentTimeMillis());
    }

    void registerPresence(HostPresenceAdvertisement presence, long lastSeenMs) {
        cache.put(presence.cacheKey(), new CachedPresence(presence, lastSeenMs));
    }

    public List<HostPresenceAdvertisement> activePresences() {
        long now = System.currentTimeMillis();
        List<HostPresenceAdvertisement> active = new ArrayList<>();
        for (Map.Entry<String, CachedPresence> entry : cache.entrySet()) {
            if (now - entry.getValue().lastSeenMs() <= ENTRY_TTL_MS) {
                active.add(entry.getValue().presence());
            }
        }
        return active;
    }

    public long lastSeenMillis(String cacheKey) {
        CachedPresence cached = cache.get(cacheKey);
        return cached != null ? cached.lastSeenMs() : 0L;
    }

    private void listenLoop() {
        try (DatagramSocket socket = openSocket()) {
            socket.setBroadcast(true);
            byte[] buffer = new byte[2048];

            while (running.isRunning()) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);
                handlePacket(packet);
            }
        } catch (Exception e) {
            if (running.isRunning()) {
                logger.error("UDP discovery listener failed", e);
            }
        }
    }

    private DatagramSocket openSocket() throws Exception {
        if (bindAddress.isPresent()) {
            InetAddress address = InetAddress.getByName(bindAddress.get());
            return new DatagramSocket(new InetSocketAddress(address, UdpAdvertiser.DISCOVERY_PORT));
        }
        return new DatagramSocket(UdpAdvertiser.DISCOVERY_PORT);
    }

    private void handlePacket(DatagramPacket packet) {
        DiscoveryPacketCodec.JsonSlice jsonSlice = DiscoveryPacketCodec.decode(
                packet.getData(),
                packet.getOffset(),
                packet.getLength()
        );
        if (jsonSlice == null) {
            return;
        }

        try {
            String json = DiscoveryPacketCodec.toJson(packet.getData(), jsonSlice);
            HostPresenceAdvertisement presence = NetworkUtils.objectMapper()
                    .readValue(json, HostPresenceAdvertisement.class);
            if (!DiscoveryConstants.PRESENCE_TYPE.equals(presence.type())) {
                return;
            }
            cache.put(presence.cacheKey(), new CachedPresence(presence, System.currentTimeMillis()));
        } catch (Exception e) {
            logger.debug(
                    "Ignored invalid discovery packet from {}:{}: {}",
                    packet.getAddress().getHostAddress(),
                    packet.getPort(),
                    e.toString()
            );
        }
    }

    private record CachedPresence(HostPresenceAdvertisement presence, long lastSeenMs) {
    }

    private static final class AtomicLifecycle {
        private volatile boolean running;

        boolean start() {
            if (running) {
                return false;
            }
            running = true;
            return true;
        }

        void stop() {
            running = false;
        }

        boolean isRunning() {
            return running;
        }
    }
}
