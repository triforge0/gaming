package com.triforge.games.treasurequest;

import com.triforge.engine.game.Game;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.room.RoomSessionAccess;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.TileChange;
import io.netty.channel.Channel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Room host stub that records per-player {@code sendTo} messages for two-player tests. */
final class DualMessagingRoomHost implements RoomHost {

    private final String roomId;
    private long tick;
    private long nextPlayerId = 1L;
    private final Map<Long, List<GameMessage>> messagesByPlayer = new HashMap<>();

    DualMessagingRoomHost(String roomId) {
        this.roomId = roomId;
    }

    long nextTick() {
        return ++tick;
    }

    void setTick(long tick) {
        this.tick = tick;
    }

    List<GameMessage> messagesToPlayer(long playerId) {
        return List.copyOf(messagesByPlayer.getOrDefault(playerId, List.of()));
    }

    void clearMessages() {
        messagesByPlayer.clear();
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
        return tick;
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
            public void sendTo(long playerId, GameMessage message) {
                messagesByPlayer.computeIfAbsent(playerId, ignored -> new ArrayList<>()).add(message);
            }

            @Override
            public void broadcast(GameMessage message) {
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
