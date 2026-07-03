package com.triforge.games.oanquan;

import com.triforge.engine.game.Game;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.room.RoomSessionAccess;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.OAQBoardState;
import com.triforge.protocol.proto.OAQMoveRejected;
import com.triforge.protocol.proto.OAQMoveResult;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.TileChange;
import io.netty.channel.Channel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Room host stub that records every oanquan broadcast and per-player send. */
final class OAnQuanRoomHost implements RoomHost {

    private long nextPlayerId = 1L;

    final List<JoinResponse> joinResponses = new ArrayList<>();
    final List<OAQBoardState> boards = new ArrayList<>();
    final List<OAQMoveResult> moveResults = new ArrayList<>();
    final Map<Long, List<OAQMoveRejected>> rejectionsByPlayer = new HashMap<>();

    OAQBoardState latestBoard() {
        if (boards.isEmpty()) {
            throw new IllegalStateException("no board broadcast yet");
        }
        return boards.get(boards.size() - 1);
    }

    List<OAQMoveRejected> rejectionsFor(long playerId) {
        return rejectionsByPlayer.getOrDefault(playerId, List.of());
    }

    @Override
    public String roomId() {
        return "test-room";
    }

    @Override
    public String roomName() {
        return "Test Room";
    }

    @Override
    public long currentTick() {
        return 0L;
    }

    @Override
    public RoomSessionAccess sessions() {
        return new RoomSessionAccess() {
            @Override
            public long nextPlayerId() {
                return nextPlayerId++;
            }

            @Override
            public void register(long playerId, Channel channel) {
            }

            @Override
            public void unregister(long playerId) {
            }

            @Override
            public boolean isConnected(long playerId) {
                return true;
            }
        };
    }

    @Override
    public RoomBroadcastAccess broadcaster() {
        return new RoomBroadcastAccess() {
            @Override
            public void sendJoinResponse(Channel channel, JoinResponse response) {
                joinResponses.add(response);
            }

            @Override
            public void sendTo(long playerId, GameMessage message) {
                if (message.hasOaq() && message.getOaq().hasMoveRejected()) {
                    rejectionsByPlayer.computeIfAbsent(playerId, id -> new ArrayList<>())
                            .add(message.getOaq().getMoveRejected());
                }
            }

            @Override
            public void broadcast(GameMessage message) {
                if (!message.hasOaq()) {
                    return;
                }
                if (message.getOaq().hasBoard()) {
                    boards.add(message.getOaq().getBoard());
                }
                if (message.getOaq().hasMoveResult()) {
                    moveResults.add(message.getOaq().getMoveResult());
                }
            }

            @Override
            public JoinResponse.Builder joinResponseBuilder(long playerId, Game game, RoomLobbySnapshot lobby) {
                return JoinResponse.newBuilder().setPlayerId(playerId).setLobby(lobby);
            }

            @Override
            public JoinResponse.Builder rejectedJoinResponseBuilder(RoomLobbySnapshot lobby) {
                return JoinResponse.newBuilder().setLobby(lobby);
            }

            @Override
            public void broadcastLobbySnapshot(RoomHost host, Game game) {
            }

            @Override
            public void broadcastMapSnapshot(Game game) {
            }

            @Override
            public void broadcastMatchPhaseUpdate(MatchController matchController, com.triforge.engine.game.RoomBroadcastView view) {
            }

            @Override
            public void broadcastMatchPhaseUpdate(MatchController matchController) {
            }

            @Override
            public void broadcastMatchResult(MatchController matchController, Game game) {
            }

            @Override
            public void broadcastGameEvent(GameEvent event) {
            }

            @Override
            public void broadcastFullSnapshot(Game game, long tick) {
            }

            @Override
            public void broadcastStateSync(Game game, long tick, List<TileChange> pendingTileChanges) {
            }
        };
    }
}
