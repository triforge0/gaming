package com.triforge.server.transport.netty;

import com.fasterxml.jackson.databind.JsonNode;
import com.triforge.server.application.presence.PresenceService;
import com.triforge.server.transport.discovery.NetworkUtils;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.util.CharsetUtil;

import java.util.Objects;
import java.util.regex.Pattern;

@ChannelHandler.Sharable
public class PresenceHttpHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final String PREFIX = "/api/presence/";
    private static final Pattern APP_ID_PATTERN = Pattern.compile("^[a-z0-9-]{1,32}$");
    private static final Pattern SESSION_ID_PATTERN = Pattern.compile("^[A-Za-z0-9-]{1,64}$");

    private final PresenceService presenceService;

    public PresenceHttpHandler(PresenceService presenceService) {
        this.presenceService = Objects.requireNonNull(presenceService, "presenceService");
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
        String upgradeHeader = request.headers().get(HttpHeaderNames.UPGRADE);
        if (upgradeHeader != null && upgradeHeader.equalsIgnoreCase("websocket")) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        String path = request.uri();
        int queryIndex = path.indexOf('?');
        if (queryIndex >= 0) {
            path = path.substring(0, queryIndex);
        }

        if (!path.startsWith(PREFIX)) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        if (request.method() != HttpMethod.POST) {
            sendError(ctx, HttpResponseStatus.METHOD_NOT_ALLOWED);
            return;
        }

        String appId = path.substring(PREFIX.length());
        if (!APP_ID_PATTERN.matcher(appId).matches()) {
            sendError(ctx, HttpResponseStatus.BAD_REQUEST);
            return;
        }

        try {
            String body = request.content().toString(CharsetUtil.UTF_8);
            JsonNode json = NetworkUtils.objectMapper().readTree(body);
            if (json == null || !json.has("sessionId")) {
                sendError(ctx, HttpResponseStatus.BAD_REQUEST);
                return;
            }
            String sessionId = json.get("sessionId").asText();
            if (!SESSION_ID_PATTERN.matcher(sessionId).matches()) {
                sendError(ctx, HttpResponseStatus.BAD_REQUEST);
                return;
            }

            presenceService.heartbeat(appId, sessionId);

            FullHttpResponse response = new DefaultFullHttpResponse(
                    HttpVersion.HTTP_1_1,
                    HttpResponseStatus.OK,
                    Unpooled.copiedBuffer("{\"status\":\"ok\"}", CharsetUtil.UTF_8)
            );
            response.headers().set(HttpHeaderNames.CONTENT_TYPE, "application/json; charset=UTF-8");
            response.headers().set(HttpHeaderNames.CONTENT_LENGTH, response.content().readableBytes());
            response.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
        } catch (Exception e) {
            sendError(ctx, HttpResponseStatus.BAD_REQUEST);
        }
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
