package com.triforge.server.transport.netty;

import com.triforge.games.treasurequest.content.TreasureQuestContentAdmin;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ChannelHandler.Sharable
public final class AdminHttpHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final Logger logger = LoggerFactory.getLogger(AdminHttpHandler.class);

    private static final String BASE_PATH = "/api/admin/treasurequest";
    private static final String QUIZZES_PATH = BASE_PATH + "/quizzes";
    private static final String CHECKPOINTS_PATH = BASE_PATH + "/checkpoints";
    private static final String CONFIG_PATH = BASE_PATH + "/config";

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
        String upgradeHeader = request.headers().get(HttpHeaderNames.UPGRADE);
        if (upgradeHeader != null && upgradeHeader.equalsIgnoreCase("websocket")) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        String path = requestPath(request.uri());
        if (!path.startsWith(BASE_PATH)) {
            ctx.fireChannelRead(request.retain());
            return;
        }

        if (!authorized(request)) {
            sendError(ctx, HttpResponseStatus.UNAUTHORIZED, "Unauthorized");
            return;
        }

        try {
            switch (path) {
                case QUIZZES_PATH -> handleResource(ctx, request, Resource.QUIZZES);
                case CHECKPOINTS_PATH -> handleResource(ctx, request, Resource.CHECKPOINTS);
                case CONFIG_PATH -> handleResource(ctx, request, Resource.CONFIG);
                default -> sendError(ctx, HttpResponseStatus.NOT_FOUND, "Not found");
            }
        } catch (IllegalArgumentException e) {
            sendError(ctx, HttpResponseStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            logger.error("Admin request failed for {}", path, e);
            sendError(ctx, HttpResponseStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    private void handleResource(ChannelHandlerContext ctx, FullHttpRequest request, Resource resource)
            throws Exception {
        if (request.method() == HttpMethod.GET) {
            sendJson(ctx, HttpResponseStatus.OK, resource.read());
            return;
        }
        if (request.method() == HttpMethod.PUT) {
            byte[] body = readBody(request);
            resource.save(body);
            sendJson(ctx, HttpResponseStatus.OK, resource.read());
            return;
        }
        sendError(ctx, HttpResponseStatus.METHOD_NOT_ALLOWED, "Method not allowed");
    }

    private static byte[] readBody(FullHttpRequest request) {
        ByteBuf content = request.content();
        if (content == null || !content.isReadable()) {
            throw new IllegalArgumentException("Request body is required");
        }
        byte[] body = new byte[content.readableBytes()];
        content.readBytes(body);
        if (body.length == 0) {
            throw new IllegalArgumentException("Request body is required");
        }
        return body;
    }

    private static boolean authorized(FullHttpRequest request) {
        String expected = System.getProperty(TreasureQuestContentAdmin.ADMIN_TOKEN_PROPERTY);
        if (expected == null || expected.isBlank()) {
            return true;
        }
        return expected.equals(request.headers().get("X-TreasureQuest-Admin-Token"));
    }

    private static String requestPath(String uri) {
        int queryIndex = uri.indexOf('?');
        return queryIndex >= 0 ? uri.substring(0, queryIndex) : uri;
    }

    private void sendJson(ChannelHandlerContext ctx, HttpResponseStatus status, byte[] body) {
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1, status, Unpooled.wrappedBuffer(body));
        response.headers().set(HttpHeaderNames.CONTENT_TYPE, "application/json; charset=UTF-8");
        response.headers().set(HttpHeaderNames.CONTENT_LENGTH, body.length);
        response.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private void sendError(ChannelHandlerContext ctx, HttpResponseStatus status, String message) {
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                status,
                Unpooled.copiedBuffer(message + "\r\n", CharsetUtil.UTF_8));
        response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/plain; charset=UTF-8");
        response.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private enum Resource {
        QUIZZES {
            @Override
            byte[] read() throws Exception {
                return TreasureQuestContentAdmin.readQuizzes();
            }

            @Override
            void save(byte[] body) throws Exception {
                TreasureQuestContentAdmin.saveQuizzes(body);
            }
        },
        CHECKPOINTS {
            @Override
            byte[] read() throws Exception {
                return TreasureQuestContentAdmin.readCheckpoints();
            }

            @Override
            void save(byte[] body) throws Exception {
                TreasureQuestContentAdmin.saveCheckpoints(body);
            }
        },
        CONFIG {
            @Override
            byte[] read() throws Exception {
                return TreasureQuestContentAdmin.readConfig();
            }

            @Override
            void save(byte[] body) throws Exception {
                TreasureQuestContentAdmin.saveConfig(body);
            }
        };

        abstract byte[] read() throws Exception;

        abstract void save(byte[] body) throws Exception;
    }
}
