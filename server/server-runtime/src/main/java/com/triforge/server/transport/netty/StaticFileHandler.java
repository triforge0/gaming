package com.triforge.server.transport.netty;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;

public final class StaticFileHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final Logger logger = LoggerFactory.getLogger(StaticFileHandler.class);

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        // If it's a WebSocket upgrade request, pass it to the next handler.
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
        if (uri.equals("/")) {
            uri = "/index.html";
        }

        // Basic security check to prevent directory traversal
        if (uri.contains("..") || uri.contains("//")) {
            sendError(ctx, HttpResponseStatus.FORBIDDEN);
            return;
        }

        String resourcePath = "/static" + uri;
        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            if (in == null) {
                logger.warn("Static resource not found: {}", resourcePath);
                sendError(ctx, HttpResponseStatus.NOT_FOUND);
                return;
            }

            byte[] bytes = in.readAllBytes();
            FullHttpResponse response = new DefaultFullHttpResponse(
                    HttpVersion.HTTP_1_1,
                    HttpResponseStatus.OK,
                    Unpooled.wrappedBuffer(bytes)
            );

            // Determine content type based on extension
            String contentType = "text/plain";
            if (uri.endsWith(".html")) {
                contentType = "text/html; charset=UTF-8";
            } else if (uri.endsWith(".js")) {
                contentType = "application/javascript; charset=UTF-8";
            } else if (uri.endsWith(".css")) {
                contentType = "text/css; charset=UTF-8";
            } else if (uri.endsWith(".png")) {
                contentType = "image/png";
            } else if (uri.endsWith(".json")) {
                contentType = "application/json; charset=UTF-8";
            } else if (uri.endsWith(".svg")) {
                contentType = "image/svg+xml";
            }
            
            response.headers().set(HttpHeaderNames.CONTENT_TYPE, contentType);
            response.headers().set(HttpHeaderNames.CONTENT_LENGTH, bytes.length);

            if (HttpUtil.isKeepAlive(request)) {
                response.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);
                ctx.writeAndFlush(response);
            } else {
                ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
            }
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
