package com.triforge.server.transport.netty;

import com.triforge.server.application.room.RoomRegistry;
import com.triforge.server.transport.codec.EnvelopeCodec;
import com.triforge.server.transport.discovery.DiscoveryService;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

public final class WebSocketServer {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);
    private static final int MAX_HTTP_CONTENT_LENGTH = 65536;

    private final int port;
    private final RoomRegistry roomRegistry;
    private final DiscoveryService discoveryService;

    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private Channel serverChannel;

    public WebSocketServer(int port, RoomRegistry roomRegistry, DiscoveryService discoveryService) {
        this.port = port;
        this.roomRegistry = Objects.requireNonNull(roomRegistry, "roomRegistry");
        this.discoveryService = Objects.requireNonNull(discoveryService, "discoveryService");
    }

    public void start() throws InterruptedException {
        logger.info("Starting WebSocket server on port {}...", port);

        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();

        EnvelopeCodec envelopeCodec = new EnvelopeCodec();
        CommandDispatcher commandDispatcher = new CommandDispatcher(roomRegistry);
        LobbyHttpHandler lobbyHttpHandler = new LobbyHttpHandler(discoveryService);
        AdminHttpHandler adminHttpHandler = new AdminHttpHandler();

        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(bossGroup, workerGroup)
         .channel(NioServerSocketChannel.class)
         .handler(new LoggingHandler(LogLevel.INFO))
         .childHandler(new ChannelInitializer<SocketChannel>() {
             @Override
             protected void initChannel(SocketChannel ch) {
                 ChannelPipeline pipeline = ch.pipeline();
                 pipeline.addLast(new HttpServerCodec());
                 pipeline.addLast(new HttpObjectAggregator(MAX_HTTP_CONTENT_LENGTH));
                 pipeline.addLast(lobbyHttpHandler);
                 pipeline.addLast(adminHttpHandler);
                 pipeline.addLast(new StaticFileHandler());
                 pipeline.addLast(new WebSocketServerProtocolHandler("/ws", null, true));
                 pipeline.addLast(envelopeCodec);
                 pipeline.addLast(commandDispatcher);
             }
         });

        serverChannel = bootstrap.bind(port).sync().channel();
        logger.info("WebSocket server started and listening on ws://localhost:{}/ws", port);
    }

    public void stop() {
        logger.info("Stopping WebSocket server...");
        if (serverChannel != null) {
            serverChannel.close().syncUninterruptibly();
        }
        if (bossGroup != null) {
            bossGroup.shutdownGracefully();
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully();
        }
        logger.info("WebSocket server stopped.");
    }
}
