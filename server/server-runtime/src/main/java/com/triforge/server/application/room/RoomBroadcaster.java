package com.triforge.server.application.room;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.RoomBroadcastView;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.match.MatchPhaseProtoMapper;
import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.snapshot.SnapshotService;
import com.triforge.engine.sync.ViewerContext;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.FullSnapshot;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.MatchPhaseUpdate;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.MessageEnvelope;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.TileChange;
import io.netty.channel.Channel;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.LongSupplier;

/**
 * Builds {@link MessageEnvelope}s and pushes game/lobby state to connected clients. Per-player
 * filtering is delegated to the active {@link Game}'s {@link com.triforge.engine.sync.InterestFilter}.
 */
public final class RoomBroadcaster implements RoomBroadcastAccess {
    static final int FULL_SNAPSHOT_INTERVAL_TICKS = 60;

    private final String roomId;
    private final RoomSessionManager sessions;
    private final LongSupplier currentTick;
    private final RoomBroadcastView view;
    private final AtomicLong msgIdCounter = new AtomicLong(1L);
    private final AtomicLong serverSeqCounter = new AtomicLong(0L);
    private final float[] viewerPositionScratch = new float[2];

    public RoomBroadcaster(
            String roomId,
            RoomSessionManager sessions,
            LongSupplier currentTick,
            RoomBroadcastView view
    ) {
        this.roomId = Objects.requireNonNull(roomId, "roomId");
        this.sessions = Objects.requireNonNull(sessions, "sessions");
        this.currentTick = Objects.requireNonNull(currentTick, "currentTick");
        this.view = Objects.requireNonNull(view, "view");
    }

    @Override
    public void sendJoinResponse(Channel channel, JoinResponse response) {
        channel.writeAndFlush(buildEnvelope(GameMessage.newBuilder().setJoinResponse(response).build()));
    }

    @Override
    public void broadcastLobbySnapshot(RoomHost host, Game game) {
        RoomLobbySnapshot snapshot = game.toLobbySnapshot(host);
        broadcastToAll(buildEnvelope(GameMessage.newBuilder().setRoomLobbySnapshot(snapshot).build()));
    }

    @Override
    public void broadcastMapSnapshot(Game game) {
        broadcastToAll(buildEnvelope(GameMessage.newBuilder()
                .setMapSnapshot(game.toMapSnapshot())
                .build()));
    }

    @Override
    public void broadcastMatchPhaseUpdate(MatchController matchController, RoomBroadcastView view) {
        MatchPhaseUpdate.Builder builder = MatchPhaseUpdate.newBuilder()
                .setPhase(MatchPhaseProtoMapper.toProto(matchController.phase()))
                .setCountdownSeconds(matchController.countdownSecondsRemaining())
                .setMatchRemainingMs(matchController.matchRemainingMs())
                .setServerTick(currentTick.getAsLong());
        if (view != null) {
            view.enrichMatchPhaseUpdate(builder, matchController);
        }
        broadcastToAll(buildEnvelope(GameMessage.newBuilder().setMatchPhaseUpdate(builder.build()).build()));
    }

    @Override
    public void broadcastMatchPhaseUpdate(MatchController matchController) {
        broadcastMatchPhaseUpdate(matchController, view);
    }

    @Override
    public void broadcastMatchResult(MatchController matchController, Game game) {
        MatchResult result = game.toMatchResult(matchController);
        broadcastToAll(buildEnvelope(GameMessage.newBuilder().setMatchResult(result).build()));
    }

    @Override
    public void broadcastGameEvent(GameEvent event) {
        broadcastToAll(buildEnvelope(GameMessage.newBuilder().setGameEvent(event).build()));
    }

    @Override
    public void broadcastFullSnapshot(Game game, long tick) {
        FullSnapshot snapshot = SnapshotService.buildFullSnapshot(
                game.snapshotWriter(),
                game.entityManager(),
                game.componentManager(),
                tick
        );
        MessageEnvelope envelope = buildEnvelope(GameMessage.newBuilder().setFullSnapshot(snapshot).build());

        sessions.forEachSession((playerId, channel) -> {
            if (!channel.isActive()) {
                return;
            }
            FullSnapshot filtered = game.interestFilter().filterFull(
                    snapshot,
                    viewerContext(playerId)
            );
            MessageEnvelope filteredEnvelope = envelope.toBuilder()
                    .setPayload(GameMessage.newBuilder().setFullSnapshot(filtered).build().toByteString())
                    .build();
            channel.writeAndFlush(filteredEnvelope);
        });
    }

    @Override
    public void broadcastStateSync(Game game, long tick, List<TileChange> pendingTileChanges) {
        if (!sessions.hasClients()) {
            return;
        }

        if (tick > 0 && tick % FULL_SNAPSHOT_INTERVAL_TICKS == 0) {
            broadcastFullSnapshot(game, tick);
            game.deltaService().syncBaseline(game);
            return;
        }

        Optional<DeltaSnapshot> delta = game.deltaService().buildDelta(game, tick, pendingTileChanges);
        if (delta.isEmpty()) {
            return;
        }

        broadcastDelta(game, delta.get());
        game.deltaService().applyDelta(delta.get(), pendingTileChanges);
    }

    @Override
    public JoinResponse.Builder joinResponseBuilder(long playerId, Game game, RoomLobbySnapshot lobby) {
        return JoinResponse.newBuilder()
                .setPlayerId(playerId)
                .setMap(game.toMapSnapshot())
                .setLobby(lobby);
    }

    @Override
    public JoinResponse.Builder rejectedJoinResponseBuilder(RoomLobbySnapshot lobby) {
        return JoinResponse.newBuilder()
                .setPlayerId(0L)
                .setLobby(lobby);
    }

    private void broadcastDelta(Game game, DeltaSnapshot delta) {
        MessageEnvelope envelope = buildEnvelope(GameMessage.newBuilder().setDeltaSnapshot(delta).build());
        sessions.forEachSession((playerId, channel) -> {
            if (channel.isActive()) {
                sendFilteredDelta(game, playerId, delta, envelope);
            }
        });
    }

    private void sendFilteredDelta(Game game, long playerId, DeltaSnapshot delta, MessageEnvelope envelope) {
        DeltaSnapshot filtered = game.interestFilter().filterDelta(delta, viewerContext(playerId));

        if (filtered.getUpdatedEntitiesCount() == 0
                && filtered.getRemovedEntityIdsCount() == 0
                && filtered.getTileChangesCount() == 0
                && !filtered.hasFog()) {
            return;
        }

        MessageEnvelope filteredEnvelope = envelope.toBuilder()
                .setPayload(GameMessage.newBuilder().setDeltaSnapshot(filtered).build().toByteString())
                .build();
        Channel channel = sessions.channelOf(playerId);
        if (channel != null) {
            channel.writeAndFlush(filteredEnvelope);
        }
    }

    private ViewerContext viewerContext(long playerId) {
        view.viewerPosition(playerId, viewerPositionScratch);
        return new ViewerContext(
                playerId,
                view.playerEntityId(playerId),
                viewerPositionScratch[0],
                viewerPositionScratch[1]
        );
    }

    private void broadcastToAll(MessageEnvelope envelope) {
        sessions.forEachSession((playerId, channel) -> {
            if (channel.isActive()) {
                channel.writeAndFlush(envelope);
            }
        });
    }

    private MessageEnvelope buildEnvelope(GameMessage gameMessage) {
        return MessageEnvelope.newBuilder()
                .setRoomId(roomId)
                .setTick(currentTick.getAsLong())
                .setMsgId(msgIdCounter.incrementAndGet())
                .setServerSeq(serverSeqCounter.incrementAndGet())
                .setSchemaVersion("1.0.0")
                .setPayload(gameMessage.toByteString())
                .build();
    }
}
