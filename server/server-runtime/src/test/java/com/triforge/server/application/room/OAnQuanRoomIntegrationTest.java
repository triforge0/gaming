package com.triforge.server.application.room;

import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.oanquan.OAnQuanPlugin;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MessageEnvelope;
import com.triforge.protocol.proto.OAQBoardState;
import com.triforge.protocol.proto.OAQDirection;
import com.triforge.protocol.proto.OAQMoveCommand;
import com.triforge.protocol.proto.OAQMoveRejected;
import com.triforge.protocol.proto.OAnQuanMessage;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Drives a full Ô ăn quan game through the real room path: join, lobby, the generic
 * {@code queueGameMessage} seam, and envelope broadcasts to embedded channels.
 */
final class OAnQuanRoomIntegrationTest {

    @Test
    void twoPlayersPlayAFullGameToCompletion() throws Exception {
        GameRoom room = GameRoom.builder("oanquan-integration")
                .plugin(GamePlugins.require(OAnQuanPlugin.ID))
                .build();
        assertEquals(OAnQuanPlugin.ID, room.plugin().id());

        EmbeddedChannel an = new EmbeddedChannel();
        EmbeddedChannel binh = new EmbeddedChannel();
        room.handleJoinRequest("An", an);
        room.handleJoinRequest("Binh", binh);

        // A third seat does not exist.
        EmbeddedChannel chi = new EmbeddedChannel();
        room.handleJoinRequest("Chi", chi);
        JoinResponse rejected = readLastJoinResponse(chi);
        assertEquals(0L, rejected.getPlayerId());

        room.handleLobbyCommand(1L, ready());
        room.handleLobbyCommand(2L, ready());
        int guard = 0;
        while (room.matchPhase() == MatchPhase.COUNTDOWN && guard++ < 10_000) {
            room.tickCountdownPhase();
        }
        assertEquals(MatchPhase.PLAYING, room.matchPhase());

        // Both players see the same initial authoritative board; seat 0 (An) to move.
        OAQBoardState boardAtAn = readLastBoard(an);
        OAQBoardState boardAtBinh = readLastBoard(binh);
        assertEquals(boardAtAn, boardAtBinh);
        assertEquals(1L, boardAtAn.getCurrentPlayerId());

        // Out-of-turn move: rejected to Binh only, no board change broadcast.
        room.queueGameMessage(2L, move(6, OAQDirection.OAQ_CLOCKWISE));
        OAQMoveRejected rejection = readLastRejection(binh);
        assertNotNull(rejection);
        assertNull(tryReadLastBoard(an));

        // Random full game through the wire seam.
        Random random = new Random(23);
        OAQBoardState board = boardAtAn;
        int moves = 0;
        while (!board.getGameOver() && moves++ < 2000) {
            long current = board.getCurrentPlayerId();
            int rowStart = current == 1L ? 0 : 6;
            List<Integer> pits = new ArrayList<>();
            for (int pit = rowStart; pit < rowStart + 5; pit++) {
                if (board.getPitStones(pit) > 0) {
                    pits.add(pit);
                }
            }
            assertFalse(pits.isEmpty(), "current player must have a legal pit");
            int pit = pits.get(random.nextInt(pits.size()));
            OAQDirection dir = random.nextBoolean()
                    ? OAQDirection.OAQ_CLOCKWISE
                    : OAQDirection.OAQ_COUNTER_CLOCKWISE;
            room.queueGameMessage(current, move(pit, dir));

            OAQBoardState next = readLastBoard(current == 1L ? an : binh);
            assertNotNull(next, "a legal move must broadcast a board");
            drainOutbound(current == 1L ? binh : an);
            board = next;
        }

        assertTrue(board.getGameOver(), "game should finish within 2000 moves");
        assertEquals(MatchPhase.ENDED, room.matchPhase());

        int trayDan = board.getScores(0).getCapturedDan() + board.getScores(1).getCapturedDan();
        int trayQuan = board.getScores(0).getCapturedQuan() + board.getScores(1).getCapturedQuan();
        assertEquals(50, trayDan);
        assertEquals(2, trayQuan);
    }

    private static LobbyCommand ready() {
        return LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build();
    }

    private static GameMessage move(int pit, OAQDirection direction) {
        return GameMessage.newBuilder()
                .setOaq(OAnQuanMessage.newBuilder().setMove(OAQMoveCommand.newBuilder()
                        .setPitIndex(pit)
                        .setDirection(direction)))
                .build();
    }

    private static JoinResponse readLastJoinResponse(EmbeddedChannel channel) throws Exception {
        JoinResponse last = null;
        MessageEnvelope envelope;
        while ((envelope = channel.readOutbound()) != null) {
            GameMessage gameMessage = GameMessage.parseFrom(envelope.getPayload());
            if (gameMessage.hasJoinResponse()) {
                last = gameMessage.getJoinResponse();
            }
        }
        assertNotNull(last, "expected an outbound join response");
        return last;
    }

    private static OAQBoardState readLastBoard(EmbeddedChannel channel) throws Exception {
        OAQBoardState board = tryReadLastBoard(channel);
        assertNotNull(board, "expected an outbound board envelope");
        return board;
    }

    private static OAQBoardState tryReadLastBoard(EmbeddedChannel channel) throws Exception {
        OAQBoardState last = null;
        MessageEnvelope envelope;
        while ((envelope = channel.readOutbound()) != null) {
            GameMessage gameMessage = GameMessage.parseFrom(envelope.getPayload());
            if (gameMessage.hasOaq() && gameMessage.getOaq().hasBoard()) {
                last = gameMessage.getOaq().getBoard();
            }
        }
        return last;
    }

    private static OAQMoveRejected readLastRejection(EmbeddedChannel channel) throws Exception {
        OAQMoveRejected last = null;
        MessageEnvelope envelope;
        while ((envelope = channel.readOutbound()) != null) {
            GameMessage gameMessage = GameMessage.parseFrom(envelope.getPayload());
            if (gameMessage.hasOaq() && gameMessage.getOaq().hasMoveRejected()) {
                last = gameMessage.getOaq().getMoveRejected();
            }
        }
        return last;
    }

    private static void drainOutbound(EmbeddedChannel channel) {
        while (channel.readOutbound() != null) {
        }
    }
}
