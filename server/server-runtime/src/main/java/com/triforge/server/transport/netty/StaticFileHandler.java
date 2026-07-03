package com.triforge.server.transport.netty;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

public final class StaticFileHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final Logger logger = LoggerFactory.getLogger(StaticFileHandler.class);

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
        String upgradeHeader = request.headers().get(HttpHeaderNames.UPGRADE);
        if (upgradeHeader != null && upgradeHeader.equalsIgnoreCase("websocket")) {
            logger.debug("Routing WebSocket handshake request to next handler");
            ctx.fireChannelRead(request.retain());
            return;
        }

        if (request.method() != HttpMethod.GET) {
            sendError(ctx, HttpResponseStatus.METHOD_NOT_ALLOWED);
            return;
        }

        String uri = request.uri();
        int queryIndex = uri.indexOf('?');
        if (queryIndex >= 0) {
            uri = uri.substring(0, queryIndex);
        }

        if (uri.contains("..") || uri.contains("//")) {
            sendError(ctx, HttpResponseStatus.FORBIDDEN);
            return;
        }

        Optional<StaticAssetResolver.ResolvedAsset> asset = StaticAssetResolver.resolve(uri);
        if (asset.isEmpty()) {
            logger.warn(
                    "Static resource not found: /static{}. Build frontend with "
                            + "'mvn package -pl launcher/triforge-server -am' or run 'npm run build' under frontend/launcher-web.",
                    uri
            );
            sendError(ctx, HttpResponseStatus.NOT_FOUND);
            return;
        }

        byte[] bytes = asset.get().bytes();
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                HttpResponseStatus.OK,
                Unpooled.wrappedBuffer(bytes)
        );
        response.headers().set(
                HttpHeaderNames.CONTENT_TYPE,
                StaticAssetResolver.contentTypeFor(asset.get().path())
        );
        response.headers().set(HttpHeaderNames.CONTENT_LENGTH, bytes.length);

        if (HttpUtil.isKeepAlive(request)) {
            response.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);
            ctx.writeAndFlush(response);
        } else {
            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("Exception in StaticFileHandler", cause);
        sendError(ctx, HttpResponseStatus.INTERNAL_SERVER_ERROR);
    }

    private void sendError(ChannelHandlerContext ctx, HttpResponseStatus status) {
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                status,
                Unpooled.copiedBuffer("Failure: " + status + "\r\n", io.netty.util.CharsetUtil.UTF_8)
        );
        response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/plain; charset=UTF-8");
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }
}
