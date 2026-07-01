package com.triforge.server.transport.codec;

import com.google.protobuf.ByteString;
import com.triforge.protocol.proto.MessageEnvelope;
import io.netty.channel.embedded.EmbeddedChannel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public final class EnvelopeCodecTest {

    @Test
    public void testRoundTripSerialization() {
        // Create an original MessageEnvelope
        MessageEnvelope original = MessageEnvelope.newBuilder()
                .setRoomId("room-123")
                .setTick(100L)
                .setMsgId(456L)
                .setClientSeq(789L)
                .setServerSeq(999L)
                .setSchemaVersion("1.0.0")
                .setPayload(ByteString.copyFromUtf8("hello-test"))
                .build();

        // Create an EmbeddedChannel to test the EnvelopeCodec
        EmbeddedChannel channel = new EmbeddedChannel(new EnvelopeCodec());

        // 1. Test Outbound: MessageEnvelope -> BinaryWebSocketFrame
        assertTrue(channel.writeOutbound(original));
        Object outbound = channel.readOutbound();
        assertNotNull(outbound, "Outbound object should not be null");
        assertTrue(outbound instanceof BinaryWebSocketFrame, "Outbound object should be a BinaryWebSocketFrame");
        BinaryWebSocketFrame frame = (BinaryWebSocketFrame) outbound;

        // 2. Test Inbound: BinaryWebSocketFrame -> MessageEnvelope
        // Note: writeInbound retains the frame, so we duplicate or retain it to simulate pipeline read
        assertTrue(channel.writeInbound(frame.retain()));
        Object inbound = channel.readInbound();
        assertNotNull(inbound, "Inbound object should not be null");
        assertTrue(inbound instanceof MessageEnvelope, "Inbound object should be parsed to MessageEnvelope");
        MessageEnvelope decoded = (MessageEnvelope) inbound;

        // 3. Verify assertions
        assertEquals(original.getRoomId(), decoded.getRoomId());
        assertEquals(original.getTick(), decoded.getTick());
        assertEquals(original.getMsgId(), decoded.getMsgId());
        assertEquals(original.getClientSeq(), decoded.getClientSeq());
        assertEquals(original.getServerSeq(), decoded.getServerSeq());
        assertEquals(original.getSchemaVersion(), decoded.getSchemaVersion());
        assertEquals(original.getPayload().toStringUtf8(), decoded.getPayload().toStringUtf8());

        // Cleanup
        channel.close();
    }
}
