package com.triforge.engine.room;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.RoomBroadcastView;
import com.triforge.engine.match.MatchController;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.TileChange;
import io.netty.channel.Channel;

import java.util.List;

/** Outbound message surface from a room host to connected clients. */
public interface RoomBroadcastAccess {

    void sendJoinResponse(Channel channel, JoinResponse response);

    JoinResponse.Builder joinResponseBuilder(long playerId, Game game, RoomLobbySnapshot lobby);

    JoinResponse.Builder rejectedJoinResponseBuilder(RoomLobbySnapshot lobby);

    void broadcastLobbySnapshot(RoomHost host, Game game);

    void broadcastMapSnapshot(Game game);

    void broadcastMatchPhaseUpdate(MatchController matchController, RoomBroadcastView view);

    void broadcastMatchPhaseUpdate(MatchController matchController);

    void broadcastMatchResult(MatchController matchController, Game game);

    void broadcastGameEvent(GameEvent event);

    void broadcastFullSnapshot(Game game, long tick);

    void broadcastStateSync(Game game, long tick, List<TileChange> pendingTileChanges);
}
