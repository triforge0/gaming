package com.triforge.server.application.room;

import com.google.protobuf.InvalidProtocolBufferException;
import com.triforge.protocol.proto.*;
import com.triforge.server.transport.codec.EnvelopeCodec;
import com.triforge.server.transport.netty.CommandDispatcher;
import io.netty.channel.embedded.EmbeddedChannel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public final class JoinSliceTest {

    @Test
    public void testPlayerJoinAndSpawn() throws InterruptedException, InvalidProtocolBufferException {
        RoomRegistry registry = new RoomRegistry();
        GameRoom room = registry.getOrCreate("test-room");

        // Set up the Netty pipeline inside EmbeddedChannel
        EnvelopeCodec codec = new EnvelopeCodec();
        CommandDispatcher dispatcher = new CommandDispatcher(registry);
        EmbeddedChannel channel = new EmbeddedChannel(codec, dispatcher);

        // Build JoinRequest GameMessage
        GameMessage joinMsg = GameMessage.newBuilder()
                .setJoinRequest(JoinRequest.newBuilder()
                        .setPlayerName("Challenger-1")
                        .build())
                .build();

        // Wrap it in a MessageEnvelope
        MessageEnvelope clientEnvelope = MessageEnvelope.newBuilder()
                .setRoomId("test-room")
                .setTick(0L)
                .setMsgId(1L)
                .setSchemaVersion("1.0.0")
                .setPayload(joinMsg.toByteString())
                .build();

        // 1. Simulate inbound client packet. The MessageEnvelope is not a WebSocketFrame,
        //    so EnvelopeCodec passes it through to CommandDispatcher, which consumes it.
        //    Nothing is left in the inbound buffer, so writeInbound returns false.
        channel.writeInbound(clientEnvelope);

        boolean joined = false;
        for (int i = 0; i < 200; i++) {
            if (room.hasRegisteredClients()) {
                joined = true;
                break;
            }
            Thread.sleep(10);
        }
        assertTrue(joined, "Client should be registered in the room");

        // 2. handleJoinRequest issues writeAndFlush from the room thread; drain any
        //    scheduled tasks on the channel and read the outbound response frame.
        Object outbound = null;
        for (int i = 0; i < 200 && outbound == null; i++) {
            channel.runPendingTasks();
            outbound = channel.readOutbound();
            if (outbound == null) {
                Thread.sleep(10);
            }
        }
        assertNotNull(outbound, "Server should write JoinResponse back to client channel");
        assertTrue(outbound instanceof BinaryWebSocketFrame);
        BinaryWebSocketFrame frame = (BinaryWebSocketFrame) outbound;

        // Decode the frame bytes back to MessageEnvelope
        byte[] bytes = new byte[frame.content().readableBytes()];
        frame.content().readBytes(bytes);
        MessageEnvelope serverEnvelope = MessageEnvelope.parseFrom(bytes);

        assertEquals("test-room", serverEnvelope.getRoomId());

        // Parse GameMessage payload
        GameMessage serverMsg = GameMessage.parseFrom(serverEnvelope.getPayload());
        assertEquals(GameMessage.ContentCase.JOINRESPONSE, serverMsg.getContentCase());

        JoinResponse joinResp = serverMsg.getJoinResponse();
        assertEquals(1L, joinResp.getPlayerId());

        // Join now enters the room lobby: no tank entity is spawned, and the response carries a
        // lobby snapshot instead of a world snapshot.
        assertEquals(0, joinResp.getInitialSnapshot().getEntitiesCount(), "no tank spawned on lobby join");
        assertTrue(joinResp.hasLobby(), "JoinResponse should carry a lobby snapshot");

        RoomLobbySnapshot lobby = joinResp.getLobby();
        assertEquals(MatchPhase.LOBBY, lobby.getPhase());
        assertEquals(1, lobby.getPlayersCount());

        LobbyPlayer lobbyPlayer = lobby.getPlayers(0);
        assertEquals(1L, lobbyPlayer.getPlayerId());
        assertEquals("Challenger-1", lobbyPlayer.getDisplayName());
        assertTrue(lobbyPlayer.getIsHost(), "first joiner is host");

        assertEquals(0, room.entityManager().count(), "no ECS entities exist while in the lobby");

        // Clean up
        channel.close();
        registry.clear();
    }
}
