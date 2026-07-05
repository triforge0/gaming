package com.triforge.games.f1racing;

import com.triforge.engine.game.Game;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.room.RoomSessionAccess;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.TileChange;
import io.netty.channel.Channel;

import java.util.ArrayList;
import java.util.List;

/** Minimal room host stub for unit tests. */
final class F1RacingRoomHost implements RoomHost {

    private final String roomId;
    private long nextPlayerId = 1L;
    private final List<com.triforge.protocol.proto.GameMessage> broadcasts = new ArrayList<>();

    F1RacingRoomHost(String roomId) {
        this.roomId = roomId;
    }

    List<com.triforge.protocol.proto.GameMessage> broadcasts() {
        return broadcasts;
    }

    @Override
    public String roomId() {
        return roomId;
    }

    @Override
    public String roomName() {
        return roomId;
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
            }

            @Override
            public void sendTo(long playerId, com.triforge.protocol.proto.GameMessage message) {
            }

            @Override
            public void broadcast(com.triforge.protocol.proto.GameMessage message) {
                broadcasts.add(message);
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
