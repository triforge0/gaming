package com.triforge.server.transport.netty;

import com.triforge.server.transport.discovery.DiscoveryService;
import com.triforge.server.transport.discovery.NetworkUtils;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.triforge.server.application.presence.PresenceService;
import com.triforge.server.transport.discovery.RoomsResponse;
import com.triforge.server.transport.discovery.RoomSummary;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@ChannelHandler.Sharable
public final class LobbyHttpHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final Logger logger = LoggerFactory.getLogger(LobbyHttpHandler.class);
    private static final String HOSTS_PATH = "/api/lobby/hosts";
    private static final String ROOMS_PATH = "/api/lobby/rooms";
    private static final String PLUGINS_PATH = "/api/lobby/plugins";

    private final DiscoveryService discoveryService;
    private final PresenceService presenceService;

    public LobbyHttpHandler(DiscoveryService discoveryService, PresenceService presenceService) {
        this.discoveryService = Objects.requireNonNull(discoveryService, "discoveryService");
        this.presenceService = Objects.requireNonNull(presenceService, "presenceService");
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
        String upgradeHeader = request.headers().get(HttpHeaderNames.UPGRADE);
        if (upgradeHeader != null && upgradeHeader.equalsIgnoreCase("websocket")) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        String path = requestPath(request.uri());
        if (!HOSTS_PATH.equals(path) && !ROOMS_PATH.equals(path) && !PLUGINS_PATH.equals(path)) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        if (request.method() != HttpMethod.GET) {
            sendError(ctx, HttpResponseStatus.METHOD_NOT_ALLOWED);
            return;
        }

        try {
            if (HOSTS_PATH.equals(path)) {
                sendJson(ctx, discoveryService.buildLobbySnapshot());
                return;
            }
            if (PLUGINS_PATH.equals(path)) {
                sendJson(ctx, discoveryService.listAvailablePlugins());
                return;
            }
            handleRoomsRequest(ctx, request);
        } catch (Exception e) {
            logger.error("Failed to build lobby response", e);
            sendError(ctx, HttpResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void handleRoomsRequest(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        QueryStringDecoder decoder = new QueryStringDecoder(request.uri());
        String requestedHost = firstQueryValue(decoder, "host");
        String requestedPort = firstQueryValue(decoder, "port");

        if (requestedHost != null && requestedPort != null) {
            try {
                int port = Integer.parseInt(requestedPort);
                if (!discoveryService.isLocalHost(requestedHost, port)) {
                    sendError(ctx, HttpResponseStatus.NOT_FOUND);
                    return;
                }
            } catch (NumberFormatException e) {
                sendError(ctx, HttpResponseStatus.BAD_REQUEST);
                return;
            }
        }

        RoomsResponse roomsResponse = discoveryService.listLocalRooms();
        if (presenceService != null) {
            List<RoomSummary> allRooms = new ArrayList<>(roomsResponse.rooms());
            allRooms.addAll(presenceService.getVirtualRooms());
            roomsResponse = new RoomsResponse(
                    roomsResponse.schemaVersion(),
                    roomsResponse.hostId(),
                    roomsResponse.hostIp(),
                    roomsResponse.port(),
                    roomsResponse.defaultGamePluginId(),
                    allRooms,
                    roomsResponse.timestampMs()
            );
        }

        sendJson(ctx, roomsResponse);
    }

    private static String firstQueryValue(QueryStringDecoder decoder, String key) {
        return decoder.parameters().getOrDefault(key, java.util.List.of()).stream()
                .findFirst()
                .orElse(null);
    }

    private static String requestPath(String uri) {
        int queryIndex = uri.indexOf('?');
        return queryIndex >= 0 ? uri.substring(0, queryIndex) : uri;
    }

    private void sendJson(ChannelHandlerContext ctx, Object payload) throws Exception {
        byte[] body = NetworkUtils.objectMapper().writeValueAsBytes(payload);
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                HttpResponseStatus.OK,
                Unpooled.wrappedBuffer(body)
        );
        response.headers().set(HttpHeaderNames.CONTENT_TYPE, "application/json; charset=UTF-8");
        response.headers().set(HttpHeaderNames.CONTENT_LENGTH, body.length);
        response.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private void sendError(ChannelHandlerContext ctx, HttpResponseStatus status) {
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                status,
                Unpooled.copiedBuffer("Failure: " + status + "\r\n", CharsetUtil.UTF_8)
        );
        response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/plain; charset=UTF-8");
        response.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }
}
