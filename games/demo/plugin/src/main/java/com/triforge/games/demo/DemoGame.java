package com.triforge.games.demo;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.game.Game;
import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchPhaseMachine;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.snapshot.EmptyEntitySnapshotWriter;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.engine.sync.DeltaService;
import com.triforge.engine.sync.StandardDeltaService;
import com.triforge.engine.sync.InterestFilter;
import com.triforge.engine.sync.PassThroughInterestFilter;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameEventType;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MapSnapshot;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import io.netty.channel.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

/**
 * Placeholder game plugin: lobby + match timers only, no map or combat. Use as a template when
 * adding a new game mode.
 */
public final class DemoGame implements Game {

    private static final Logger logger = LoggerFactory.getLogger(DemoGame.class);

    private RoomHost host;
    private final DemoLobby lobby = new DemoLobby();
    private MatchPhaseMachine matchPhase = new MatchPhaseMachine(MatchConfig.defaults());
    private final EcsWorld ecsWorld = new EcsWorld();
    private final DeltaService deltaService = new StandardDeltaService();

    @Override
    public void bind(RoomHost host) {
        this.host = Objects.requireNonNull(host, "host");
    }

    private RoomHost host() {
        if (host == null) {
            throw new IllegalStateException("DemoGame not bound to a room host");
        }
        return host;
    }

    @Override
    public void stop() {
        ecsWorld.entityManager().clear();
        ecsWorld.componentManager().clear();
    }

    @Override
    public void onTick(long tick) {
        switch (matchPhase.phase()) {
            case COUNTDOWN -> tickCountdownPhase();
            case PLAYING -> tickMatchTimer();
            case ENDED -> tickScoreboardPhase();
            default -> {
            }
        }
    }

    @Override
    public void handleJoinRequest(String requestedName, Channel channel) {
        if (matchPhase.phase() == MatchPhase.PLAYING) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            return;
        }

        long playerId = host().sessions().nextPlayerId();
        String displayName = DemoLobby.isValidName(requestedName)
                ? requestedName.trim()
                : DemoLobby.defaultName(playerId);
        boolean isHost = lobby.playerCount() == 0;

        lobby.addPlayer(playerId, displayName, isHost);
        host().sessions().register(playerId, channel);

        RoomLobbySnapshot snapshot = toLobbySnapshot(host());
        JoinResponse response = host().broadcaster()
                .joinResponseBuilder(playerId, this, snapshot)
                .build();
        host().broadcaster().sendJoinResponse(channel, response);
        host().broadcaster().broadcastLobbySnapshot(host(), this);

        logger.info("Player '{}' joined demo room '{}' as playerId={} (host={})",
                displayName, host().roomId(), playerId, isHost);
    }

    @Override
    public void handleLeaveRequest(long playerId) {
        host().sessions().unregister(playerId);
        lobby.removePlayer(playerId);
        host().broadcaster().broadcastLobbySnapshot(host(), this);
    }

    @Override
    public void handleLobbyCommand(long playerId, LobbyCommand command) {
        if (matchPhase.phase() != MatchPhase.LOBBY) {
            return;
        }

        boolean applied = switch (command.getActionCase()) {
            case SETNAME -> lobby.setDisplayName(playerId, command.getSetName().getDisplayName());
            case SETREADY -> lobby.setReady(playerId, command.getSetReady().getReady());
            case STARTMATCH -> {
                if (lobby.isHost(playerId) && lobby.canStartMatch(matchPhase.phase())) {
                    beginCountdown();
                }
                yield false;
            }
            case SETTEAM, SETSPAWN, SETTEAMSETUP, ACTION_NOT_SET -> false;
        };

        if (applied) {
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            if (lobby.canStartMatch(matchPhase.phase()) && lobby.playerCount() >= 2 && lobby.allReady()) {
                beginCountdown();
            }
        }
    }

    @Override
    public void queueInputCommand(long playerId, InputCommand input) {
        // Demo plugin has no gameplay input handling yet.
    }

    @Override
    public EntityManager entityManager() {
        return ecsWorld.entityManager();
    }

    @Override
    public ComponentManager componentManager() {
        return ecsWorld.componentManager();
    }

    @Override
    public DeltaService deltaService() {
        return deltaService;
    }

    @Override
    public EntitySnapshotWriter snapshotWriter() {
        return EmptyEntitySnapshotWriter.INSTANCE;
    }

    @Override
    public InterestFilter interestFilter() {
        return PassThroughInterestFilter.INSTANCE;
    }

    @Override
    public MapSnapshot toMapSnapshot() {
        return MapSnapshot.newBuilder()
                .setWidth(1)
                .setHeight(1)
                .build();
    }

    @Override
    public RoomLobbySnapshot toLobbySnapshot(RoomHost host) {
        return lobby.toSnapshot(
                host.roomId(),
                host.roomName(),
                matchPhase.phase(),
                lobby.canStartMatch(matchPhase.phase()));
    }

    @Override
    public MatchResult toMatchResult(MatchController matchController) {
        return MatchResult.newBuilder()
                .setMatchDurationMs(matchController.config().matchDurationMs())
                .build();
    }

    @Override
    public MatchController matchController() {
        return matchPhase;
    }

    @Override
    public MatchPhase matchPhase() {
        return matchPhase.phase();
    }

    @Override
    public Game skipLobby(boolean skip) {
        return this;
    }

    @Override
    public Game matchConfig(MatchConfig config) {
        matchPhase = new MatchPhaseMachine(config);
        return this;
    }

    @Override
    public void tickCountdownPhase() {
        int before = matchPhase.countdownSecondsRemaining();
        matchPhase.tickCountdown();
        int after = matchPhase.countdownSecondsRemaining();
        if (after != before && after > 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        }
        if (matchPhase.countdownFinished()) {
            startMatch();
        }
    }

    private void startMatch() {
        matchPhase.startMatch();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_STARTED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastFullSnapshot(this, host().currentTick());
        deltaService.syncBaseline(this);
        logger.info("Demo match started in room '{}' ({} players)", host().roomId(), lobby.playerCount());
    }

    @Override
    public void tickMatchTimer() {
        matchPhase.tickMatch();
        if (matchPhase.matchTicksRemaining() % MatchPhaseMachine.TICKS_PER_SECOND == 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        }
        if (matchPhase.matchTimeExpired()) {
            endMatch();
        }
    }

    private void endMatch() {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        matchPhase.endMatch();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastMatchResult(matchPhase, this);
        logger.info("Demo match ended in room '{}'", host().roomId());
    }

    @Override
    public void tickScoreboardPhase() {
        matchPhase.tickScoreboard();
        if (matchPhase.scoreboardFinished()) {
            matchPhase.returnToLobby();
            lobby.resetAllReady();
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            logger.info("Demo room '{}' returned to lobby", host().roomId());
        }
    }

    private void beginCountdown() {
        matchPhase.startCountdown();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        logger.info("Demo room '{}' entering countdown ({} players)", host().roomId(), lobby.playerCount());
    }

    private GameEvent lifecycleEvent(GameEventType type) {
        return GameEvent.newBuilder().setType(type).build();
    }

    @Override
    public long playerEntityId(long playerId) {
        return 0L;
    }

    @Override
    public void viewerPosition(long playerId, float[] out) {
        out[0] = 0f;
        out[1] = 0f;
    }
}
