package com.triforge.server.transport.codec;

import com.triforge.protocol.proto.MessageEnvelope;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToMessageCodec;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@ChannelHandler.Sharable
public final class EnvelopeCodec extends MessageToMessageCodec<WebSocketFrame, MessageEnvelope> {
    private static final Logger logger = LoggerFactory.getLogger(EnvelopeCodec.class);

    @Override
    protected void decode(ChannelHandlerContext ctx, WebSocketFrame frame, List<Object> out) throws Exception {
        if (frame instanceof BinaryWebSocketFrame) {
            ByteBuf content = frame.content();
            byte[] bytes = new byte[content.readableBytes()];
            content.readBytes(bytes);

            try {
                MessageEnvelope envelope = MessageEnvelope.parseFrom(bytes);
                out.add(envelope);
            } catch (Exception e) {
                logger.error("Failed to parse MessageEnvelope protobuf from binary frame", e);
                // Close channel on malformed frames to prevent protocol pollution
                ctx.close();
            }
        } else {
            // Pass other frames (Text, Ping, Pong, Close) down the pipeline.
            ctx.fireChannelRead(frame.retain());
        }
    }

    @Override
    protected void encode(ChannelHandlerContext ctx, MessageEnvelope envelope, List<Object> out) throws Exception {
        try {
            byte[] bytes = envelope.toByteArray();
            ByteBuf buf = Unpooled.wrappedBuffer(bytes);
            out.add(new BinaryWebSocketFrame(buf));
        } catch (Exception e) {
            logger.error("Failed to serialize MessageEnvelope protobuf", e);
            throw e;
        }
    }
}
