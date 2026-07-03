package com.triforge.server.application.room;

import com.triforge.engine.game.RoomBroadcastView;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.HintReveal;
import com.triforge.protocol.proto.Leaderboard;
import com.triforge.protocol.proto.MessageEnvelope;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Covers the generic {@code sendTo} / {@code broadcast} surface (plan-001 Task 3). */
final class RoomBroadcasterMessagingTest {

    private static final RoomBroadcastView NOOP_VIEW = new RoomBroadcastView() {
        @Override
        public long playerEntityId(long playerId) {
            return 0L;
        }

        @Override
        public void viewerPosition(long playerId, float[] out) {
            out[0] = 0f;
            out[1] = 0f;
        }
    };

    @Test
    void sendToReachesOnlyTarget() throws Exception {
        RoomSessionManager sessions = new RoomSessionManager("room");
        EmbeddedChannel target = new EmbeddedChannel();
        EmbeddedChannel other = new EmbeddedChannel();
        sessions.register(1L, target);
        sessions.register(2L, other);
        RoomBroadcaster broadcaster = new RoomBroadcaster("room", sessions, () -> 5L, NOOP_VIEW);

        GameMessage message = GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder()
                        .setHintReveal(HintReveal.newBuilder().setText("go north")))
                .build();

        broadcaster.sendTo(1L, message);

        MessageEnvelope received = target.readOutbound();
        assertNotNull(received);
        GameMessage decoded = GameMessage.parseFrom(received.getPayload());
        assertTrue(decoded.hasTq());
        assertEquals("go north", decoded.getTq().getHintReveal().getText());

        assertNull(other.readOutbound(), "non-target must receive nothing");
    }

    @Test
    void broadcastReachesAll() throws Exception {
        RoomSessionManager sessions = new RoomSessionManager("room");
        EmbeddedChannel a = new EmbeddedChannel();
        EmbeddedChannel b = new EmbeddedChannel();
        sessions.register(1L, a);
        sessions.register(2L, b);
        RoomBroadcaster broadcaster = new RoomBroadcaster("room", sessions, () -> 0L, NOOP_VIEW);

        GameMessage message = GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder()
                        .setLeaderboard(Leaderboard.newBuilder().setFinalStandings(true)))
                .build();

        broadcaster.broadcast(message);

        for (EmbeddedChannel channel : new EmbeddedChannel[]{a, b}) {
            MessageEnvelope received = channel.readOutbound();
            assertNotNull(received);
            GameMessage decoded = GameMessage.parseFrom(received.getPayload());
            assertTrue(decoded.getTq().getLeaderboard().getFinalStandings());
        }
    }

    @Test
    void sendToUnknownPlayerIsNoop() {
        RoomSessionManager sessions = new RoomSessionManager("room");
        RoomBroadcaster broadcaster = new RoomBroadcaster("room", sessions, () -> 0L, NOOP_VIEW);

        // No players registered — must not throw.
        broadcaster.sendTo(99L, GameMessage.getDefaultInstance());
    }
}
