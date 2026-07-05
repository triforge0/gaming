package com.triforge.server.transport.netty;

import com.triforge.games.f1racing.replay.ReplayArchive;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ChannelHandler.Sharable
public final class F1ReplayHttpHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final Logger logger = LoggerFactory.getLogger(F1ReplayHttpHandler.class);
    private static final String LAST_PATH = "/api/f1/replays/last";

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
        String upgradeHeader = request.headers().get(HttpHeaderNames.UPGRADE);
        if (upgradeHeader != null && upgradeHeader.equalsIgnoreCase("websocket")) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        if (!LAST_PATH.equals(requestPath(request.uri()))) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        if (request.method() != HttpMethod.GET) {
            sendError(ctx, HttpResponseStatus.METHOD_NOT_ALLOWED);
            return;
        }

        try {
            var json = ReplayArchive.lastReplayJson();
            if (json.isEmpty()) {
                sendError(ctx, HttpResponseStatus.NOT_FOUND);
                return;
            }
            sendJson(ctx, json.get());
        } catch (Exception exception) {
            logger.error("Failed to serve F1 replay", exception);
            sendError(ctx, HttpResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private static String requestPath(String uri) {
        int query = uri.indexOf('?');
        return query >= 0 ? uri.substring(0, query) : uri;
    }

    private static void sendJson(ChannelHandlerContext ctx, String json) {
        byte[] bytes = json.getBytes(CharsetUtil.UTF_8);
        DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                HttpResponseStatus.OK,
                Unpooled.wrappedBuffer(bytes));
        response.headers().set(HttpHeaderNames.CONTENT_TYPE, "application/json; charset=UTF-8");
        response.headers().set(HttpHeaderNames.CONTENT_LENGTH, bytes.length);
        response.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private static void sendError(ChannelHandlerContext ctx, HttpResponseStatus status) {
        DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                status,
                Unpooled.EMPTY_BUFFER);
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }
}
