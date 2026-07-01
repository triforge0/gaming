package com.triforge.engine.game;

import com.triforge.engine.room.RoomHost;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.engine.sync.DeltaService;
import com.triforge.engine.sync.InterestFilter;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MapSnapshot;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import io.netty.channel.Channel;

/**
 * Pluggable game simulation owned by a room. The room shell delegates gameplay, lobby match flow,
 * and ECS updates here. Tank-specific APIs live on {@code TankArenaGame}, not this interface.
 */
public interface Game extends RoomBroadcastView {

    void bind(RoomHost host);

    void stop();

    void onTick(long tick);

    void handleJoinRequest(String requestedName, Channel channel);

    void handleLeaveRequest(long playerId);

    void handleLobbyCommand(long playerId, LobbyCommand command);

    void queueInputCommand(long playerId, InputCommand input);

    EntityManager entityManager();

    ComponentManager componentManager();

    DeltaService deltaService();

    EntitySnapshotWriter snapshotWriter();

    InterestFilter interestFilter();

    MapSnapshot toMapSnapshot();

    RoomLobbySnapshot toLobbySnapshot(RoomHost host);

    MatchResult toMatchResult(MatchController matchController);

    MatchController matchController();

    MatchPhase matchPhase();

    Game skipLobby(boolean skip);

    Game matchConfig(MatchConfig config);

    void tickCountdownPhase();

    void tickMatchTimer();

    void tickScoreboardPhase();
}
