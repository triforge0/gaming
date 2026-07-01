package com.triforge.server.transport.discovery;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.DatagramSocket;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;

public final class NetworkUtils {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /** Off-box destination used only to make the OS pick a routable source address; no packet is sent. */
    private static final String ROUTE_PROBE_HOST = "8.8.8.8";
    private static final int ROUTE_PROBE_PORT = 9;

    private NetworkUtils() {
    }

    public static ObjectMapper objectMapper() {
        return MAPPER;
    }

    /**
     * Resolves the IPv4 address other LAN peers should use to reach this host.
     *
     * <p>Strategy: first ask the OS routing table (via a connected, but un-sent, UDP socket) which local
     * address it would use to reach the outside world — this naturally selects the default-route interface
     * (e.g. Wi-Fi/Ethernet) over virtual bridges such as Docker/OrbStack. If that fails (e.g. no default
     * route on an isolated LAN), fall back to scanning interfaces while skipping virtual interfaces and
     * unusable addresses (network/broadcast, link-local).
     */
    public static String resolveLocalHostAddress() {
        String routed = routedLocalAddress();
        if (routed != null) {
            return routed;
        }
        String scanned = scanForUsableAddress();
        if (scanned != null) {
            return scanned;
        }
        return "127.0.0.1";
    }

    private static String routedLocalAddress() {
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.connect(InetAddress.getByName(ROUTE_PROBE_HOST), ROUTE_PROBE_PORT);
            InetAddress local = socket.getLocalAddress();
            if (local instanceof Inet4Address
                    && !local.isAnyLocalAddress()
                    && !local.isLoopbackAddress()
                    && !local.isLinkLocalAddress()) {
                return local.getHostAddress();
            }
        } catch (Exception ignored) {
            // No default route reachable; fall through to interface scan.
        }
        return null;
    }

    private static String scanForUsableAddress() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                NetworkInterface networkInterface = interfaces.nextElement();
                if (!isUsableInterface(networkInterface)) {
                    continue;
                }
                for (InterfaceAddress interfaceAddress : networkInterface.getInterfaceAddresses()) {
                    InetAddress address = interfaceAddress.getAddress();
                    if (isUsableAddress(address, interfaceAddress)) {
                        return address.getHostAddress();
                    }
                }
            }
        } catch (Exception ignored) {
            // Fall through to localhost.
        }
        return null;
    }

    private static boolean isUsableInterface(NetworkInterface networkInterface) throws java.net.SocketException {
        if (!networkInterface.isUp() || networkInterface.isLoopback()
                || networkInterface.isVirtual() || networkInterface.isPointToPoint()) {
            return false;
        }
        // macOS/Linux virtual interface name prefixes (Docker/OrbStack bridges, VPN tunnels, AirDrop, etc.).
        String name = networkInterface.getName().toLowerCase();
        return !(name.startsWith("bridge") || name.startsWith("utun") || name.startsWith("awdl")
                || name.startsWith("llw") || name.startsWith("docker") || name.startsWith("veth")
                || name.startsWith("vnic") || name.startsWith("vboxnet") || name.startsWith("tun")
                || name.startsWith("tap") || name.startsWith("gif") || name.startsWith("stf"));
    }

    private static boolean isUsableAddress(InetAddress address, InterfaceAddress interfaceAddress) {
        if (!(address instanceof Inet4Address)
                || address.isLoopbackAddress()
                || address.isLinkLocalAddress()
                || address.isAnyLocalAddress()) {
            return false;
        }
        return !isNetworkOrBroadcastAddress(address, interfaceAddress.getNetworkPrefixLength());
    }

    /** Rejects the subnet's network address (e.g. 192.168.97.0/24) and its broadcast address. */
    private static boolean isNetworkOrBroadcastAddress(InetAddress address, short prefixLength) {
        if (prefixLength <= 0 || prefixLength >= 32) {
            return false;
        }
        byte[] bytes = address.getAddress();
        int value = ((bytes[0] & 0xFF) << 24) | ((bytes[1] & 0xFF) << 16)
                | ((bytes[2] & 0xFF) << 8) | (bytes[3] & 0xFF);
        int hostMask = (int) ((1L << (32 - prefixLength)) - 1);
        int hostBits = value & hostMask;
        return hostBits == 0 || hostBits == hostMask;
    }
}
