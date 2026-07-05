package com.triforge.games.f1racing;

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
import com.triforge.engine.sync.InterestFilter;
import com.triforge.engine.sync.PassThroughInterestFilter;
import com.triforge.engine.sync.StandardDeltaService;
import com.triforge.games.f1racing.sync.F1RacingSnapshotWriter;
import com.triforge.games.f1racing.replay.ReplayRecorder;
import com.triforge.games.f1racing.replay.ReplayWriter;
import com.triforge.games.f1racing.replay.ReplayDocument;
import com.triforge.games.f1racing.track.TrackCatalog;
import com.triforge.games.f1racing.track.TrackDefinition;
import com.triforge.protocol.proto.F1AbortReason;
import com.triforge.protocol.proto.F1Message;
import com.triforge.protocol.proto.F1QualifyingResult;
import com.triforge.protocol.proto.F1RaceResult;
import com.triforge.protocol.proto.F1SessionPhase;
import com.triforge.protocol.proto.F1StandingUpdate;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameEventType;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MapSnapshot;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import io.netty.channel.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;

/**
 * F1 LAN racing plugin. Lobby + session scaffolding; physics and race logic land in later tasks.
 */
public final class F1RacingGame implements Game {

    private static final Logger logger = LoggerFactory.getLogger(F1RacingGame.class);

    private RoomHost host;
    private final F1Lobby lobby = new F1Lobby();
    private final F1RoomConfigState roomConfig = new F1RoomConfigState();
    private MatchPhaseMachine matchPhase = new MatchPhaseMachine(
            MatchConfig.defaults().withMinPlayers(F1Constants.MIN_PLAYERS));
    private final EcsWorld ecsWorld = new EcsWorld();
    private final DeltaService deltaService = new StandardDeltaService();
    private F1SessionPhase sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
    private String pendingJoinPassword = "";
    private final TrackCatalog trackCatalog = new TrackCatalog();
    private RaceSession raceSession;
    private long sessionTick;
    private int standingsBroadcastCooldown;
    private int qualifyingTicksRemaining;
    private boolean sessionPrepared;
    private boolean qualifyingCompletedForMatch;
    private F1QualifyingResult lastQualifyingResult = F1QualifyingResult.getDefaultInstance();
    private List<Long> raceGridOrder = List.of();
    private long raceStartTick;
    private F1StandingUpdate lastStandings = F1StandingUpdate.getDefaultInstance();
    private F1SoloMode soloMode;
    private final ReplayRecorder replayRecorder = new ReplayRecorder();

    @Override
    public void bind(RoomHost host) {
        this.host = Objects.requireNonNull(host, "host");
        F1SoloRoom.parse(host.roomId()).ifPresent(solo -> {
            soloMode = solo.mode();
            roomConfig.applySoloPreset(solo.mode(), solo.trackId());
            syncTrackMetadata();
            matchPhase = new MatchPhaseMachine(matchConfigForSolo(solo.mode()));
        });
    }

    private boolean isSoloRoom() {
        return soloMode != null;
    }

    private MatchConfig matchConfigForSolo(F1SoloMode mode) {
        MatchConfig base = MatchConfig.defaults().withMinPlayers(1);
        if (mode == F1SoloMode.PRACTICE) {
            return base.withMatchDurationSeconds(86_400);
        }
        return base;
    }

    private RoomHost host() {
        if (host == null) {
            throw new IllegalStateException("F1RacingGame not bound to a room host");
        }
        return host;
    }

    @Override
    public void stop() {
        if (raceSession != null) {
            raceSession.clear(entityManager(), componentManager());
            raceSession = null;
        }
        ecsWorld.entityManager().clear();
        ecsWorld.componentManager().clear();
        sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
        sessionPrepared = false;
    }

    @Override
    public void onTick(long tick) {
        sessionTick = tick;
        switch (matchPhase.phase()) {
            case COUNTDOWN -> tickCountdownPhase();
            case PLAYING -> {
                tickRaceSimulation(tick);
                tickMatchTimer();
            }
            case ENDED -> tickScoreboardPhase();
            default -> {
            }
        }
    }

    private void tickRaceSimulation(long tick) {
        if (raceSession == null) {
            return;
        }
        if (sessionPhase == F1SessionPhase.F1_SESSION_QUALIFYING) {
            if (qualifyingTicksRemaining > 0) {
                qualifyingTicksRemaining--;
            }
            if (qualifyingTicksRemaining <= 0) {
                finishQualifying();
                return;
            }
        }

        F1StandingUpdate standings = raceSession.tick(tick, entityManager(), componentManager());
        lastStandings = standings;
        raceSession.sampleReplay(replayRecorder, tick, entityManager(), componentManager());
        if (--standingsBroadcastCooldown <= 0) {
            standingsBroadcastCooldown = MatchPhaseMachine.TICKS_PER_SECOND;
            host().broadcaster().broadcast(raceSession.standingsMessage(standings));
        }
        host().broadcaster().broadcastStateSync(this, tick, java.util.List.of());
        if (sessionPhase == F1SessionPhase.F1_SESSION_RACE
                && raceSession.allFinished()
                && soloMode != F1SoloMode.PRACTICE) {
            endMatchNormally(F1AbortReason.F1_ABORT_NONE);
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

        if (lobby.isFull(roomConfig)) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            logger.info("Rejected join for '{}' — room '{}' is full ({}/{})",
                    requestedName, host().roomId(), lobby.playerCount(), roomConfig.maxPlayers());
            return;
        }

        if (!roomConfig.passwordMatches(pendingJoinPassword)) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            logger.info("Rejected join for '{}' — wrong password in room '{}'", requestedName, host().roomId());
            return;
        }

        long playerId = host().sessions().nextPlayerId();
        String displayName = F1Lobby.isValidName(requestedName)
                ? requestedName.trim()
                : F1Lobby.defaultName(playerId);
        boolean isHost = lobby.playerCount() == 0;

        lobby.addPlayer(playerId, displayName, isHost);
        host().sessions().register(playerId, channel);
        pendingJoinPassword = "";

        RoomLobbySnapshot snapshot = toLobbySnapshot(host());
        JoinResponse response = host().broadcaster()
                .joinResponseBuilder(playerId, this, snapshot)
                .build();
        host().broadcaster().sendJoinResponse(channel, response);
        broadcastRoomConfig();
        host().broadcaster().broadcastLobbySnapshot(host(), this);

        if (isSoloRoom() && isHost) {
            maybeAutoStartSolo(playerId);
        }

        logger.info("Player '{}' joined f1 room '{}' as playerId={} (host={})",
                displayName, host().roomId(), playerId, isHost);
    }

    @Override
    public void handleLeaveRequest(long playerId) {
        if (lobby.isHost(playerId)
                && (sessionPhase == F1SessionPhase.F1_SESSION_QUALIFYING
                || sessionPhase == F1SessionPhase.F1_SESSION_RACE)) {
            abortRace(F1AbortReason.F1_ABORT_HOST_DISCONNECTED);
        }

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
                if (lobby.isHost(playerId) && lobby.canStartMatch(matchPhase.phase(), isSoloRoom())) {
                    beginCountdown();
                }
                yield false;
            }
            case SETTEAM, SETSPAWN, SETTEAMSETUP, ACTION_NOT_SET -> false;
        };

        if (applied) {
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            if (lobby.canStartMatch(matchPhase.phase(), isSoloRoom())) {
                beginCountdown();
            }
        }
    }

    @Override
    public void handleGameMessage(long playerId, GameMessage message) {
        if (message.getContentCase() != GameMessage.ContentCase.F1) {
            return;
        }
        handleF1Message(playerId, message.getF1());
    }

    void handleF1Message(long playerId, F1Message message) {
        switch (message.getContentCase()) {
            case JOINREQUEST -> pendingJoinPassword = message.getJoinRequest().getPassword();
            case GARAGELOADOUT -> {
                lobby.setLoadout(playerId, message.getGarageLoadout());
                host().broadcaster().broadcastLobbySnapshot(host(), this);
            }
            case SETROOMCONFIG -> {
                if (lobby.isHost(playerId) && matchPhase.phase() == MatchPhase.LOBBY) {
                    roomConfig.applyHostConfig(message.getSetRoomConfig());
                    syncTrackMetadata();
                    broadcastRoomConfig();
                }
            }
            case VEHICLEINPUT -> {
                if (matchPhase.phase() == MatchPhase.PLAYING && raceSession != null) {
                    raceSession.queueInput(playerId, message.getVehicleInput());
                }
            }
            case STARTRACE -> {
                if (lobby.isHost(playerId) && lobby.canStartMatch(matchPhase.phase(), isSoloRoom())) {
                    beginCountdown();
                }
            }
            case ADDBOT -> {
                if (lobby.isHost(playerId)
                        && matchPhase.phase() == MatchPhase.LOBBY
                        && !lobby.isFull(roomConfig)) {
                    if (lobby.addBot()) {
                        host().broadcaster().broadcastLobbySnapshot(host(), this);
                    }
                }
            }
            case KICKPLAYER -> {
                if (lobby.isHost(playerId) && matchPhase.phase() == MatchPhase.LOBBY) {
                    long target = message.getKickPlayer().getPlayerId();
                    if (lobby.kickPlayer(target)) {
                        host().sessions().unregister(target);
                        host().broadcaster().broadcastLobbySnapshot(host(), this);
                    }
                }
            }
            case SKIPQUALIFYING -> {
                if (lobby.isHost(playerId)
                        && sessionPhase == F1SessionPhase.F1_SESSION_QUALIFYING
                        && matchPhase.phase() == MatchPhase.PLAYING) {
                    finishQualifying();
                }
            }
            case ROOMCONFIG, RACESTATE, LAPEVENT, SECTORTIME, RACERESULT, STANDINGS,
                 QUALIFYINGRESULT, CONTENT_NOT_SET -> {
            }
        }
    }

    @Override
    public void queueInputCommand(long playerId, InputCommand input) {
        // Racing input uses F1VehicleInput via handleGameMessage.
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
        return raceSession == null ? EmptyEntitySnapshotWriter.INSTANCE : F1RacingSnapshotWriter.INSTANCE;
    }

    @Override
    public InterestFilter interestFilter() {
        return PassThroughInterestFilter.INSTANCE;
    }

    @Override
    public MapSnapshot toMapSnapshot() {
        return MapSnapshot.newBuilder().setWidth(1).setHeight(1).build();
    }

    @Override
    public RoomLobbySnapshot toLobbySnapshot(RoomHost host) {
        if (matchPhase.phase() == MatchPhase.LOBBY) {
            lobby.ensureBotCount(roomConfig.botCount(), roomConfig);
        }
        return lobby.toSnapshot(
                host.roomId(),
                host.roomName(),
                matchPhase.phase(),
                lobby.canStartMatch(matchPhase.phase(), isSoloRoom()),
                roomConfig);
    }

    private void maybeAutoStartSolo(long playerId) {
        if (matchPhase.phase() != MatchPhase.LOBBY || !lobby.isHost(playerId)) {
            return;
        }
        lobby.ensureBotCount(roomConfig.botCount(), roomConfig);
        lobby.setReady(playerId, true);
        if (lobby.canStartMatch(matchPhase.phase(), true)) {
            beginCountdown();
        }
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

    F1SessionPhase sessionPhase() {
        return sessionPhase;
    }

    int lobbyPlayerCount() {
        return lobby.playerCount();
    }

    int configuredMaxPlayers() {
        return roomConfig.maxPlayers();
    }

    boolean isHostPlayer(long playerId) {
        return lobby.isHost(playerId);
    }

    @Override
    public Game skipLobby(boolean skip) {
        return this;
    }

    @Override
    public Game matchConfig(MatchConfig config) {
        matchPhase = new MatchPhaseMachine(config.withMinPlayers(F1Constants.MIN_PLAYERS));
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
            startSession();
        }
    }

    /**
     * Spawn the grid the moment the countdown begins so every client can render the cars on the
     * line and lock their chase camera during "3·2·1". Physics stays frozen (no {@code PLAYING}
     * tick) until the countdown finishes; {@link #startSession()} then flips to green.
     */
    private void prepareSessionForCountdown() {
        if (sessionPrepared) {
            return;
        }
        if (roomConfig.toProto().getEnableQualifying() && !qualifyingCompletedForMatch) {
            sessionPhase = F1SessionPhase.F1_SESSION_QUALIFYING;
            qualifyingTicksRemaining = roomConfig.toProto().getQualifyingDurationSec()
                    * MatchPhaseMachine.TICKS_PER_SECOND;
        } else {
            sessionPhase = F1SessionPhase.F1_SESSION_RACE;
        }
        beginRaceSimulation();
        host().broadcaster().broadcastFullSnapshot(this, host().currentTick());
        deltaService.syncBaseline(this);
        sessionPrepared = true;
    }

    private void startSession() {
        if (!sessionPrepared) {
            prepareSessionForCountdown();
        }
        if (sessionPhase == F1SessionPhase.F1_SESSION_RACE) {
            raceStartTick = sessionTick;
        }
        // Cars have sat on the grid through the countdown; start lap/race timing now at "GO".
        if (raceSession != null) {
            raceSession.markRaceStart(sessionTick);
        }
        replayRecorder.begin();
        matchPhase.startMatch();
        sessionPrepared = false;
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_STARTED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastFullSnapshot(this, host().currentTick());
        deltaService.syncBaseline(this);
        broadcastRaceState();
        logger.info("F1 session started in room '{}' phase={} ({} players)",
                host().roomId(), sessionPhase, lobby.playerCount());
    }

    private void finishQualifying() {
        if (raceSession == null || sessionPhase != F1SessionPhase.F1_SESSION_QUALIFYING) {
            return;
        }
        lastQualifyingResult = raceSession.buildQualifyingResult();
        if (soloMode == F1SoloMode.TIME_TRIAL) {
            host().broadcaster().broadcast(GameMessage.newBuilder()
                    .setF1(F1Message.newBuilder().setQualifyingResult(lastQualifyingResult))
                    .build());
            raceSession.clear(entityManager(), componentManager());
            raceSession = null;
            sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
            endMatchNormally(F1AbortReason.F1_ABORT_NONE);
            logger.info("F1 time trial finished in room '{}'", host().roomId());
            return;
        }
        raceGridOrder = QualifyingGrid.playerOrder(lastQualifyingResult);
        qualifyingCompletedForMatch = true;
        raceSession.clear(entityManager(), componentManager());
        raceSession = null;

        host().broadcaster().broadcast(GameMessage.newBuilder()
                .setF1(F1Message.newBuilder().setQualifyingResult(lastQualifyingResult))
                .build());
        sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
        matchPhase.startCountdown();
        prepareSessionForCountdown();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        logger.info("F1 qualifying finished in room '{}' — starting race countdown", host().roomId());
    }

    private void beginRaceSimulation() {
        TrackDefinition track = trackCatalog.require(roomConfig.toProto().getTrackId());
        int laps = sessionPhase == F1SessionPhase.F1_SESSION_QUALIFYING
                ? 999
                : Math.max(1, roomConfig.toProto().getLapCount());
        raceSession = new RaceSession(track, laps);
        raceSession.bindLobby(lobby);
        raceSession.setCollisionMode(roomConfig.toProto().getCollision());
        List<Long> gridOrder = sessionPhase == F1SessionPhase.F1_SESSION_RACE && !raceGridOrder.isEmpty()
                ? raceGridOrder
                : null;
        raceSession.spawnGrid(entityManager(), componentManager(), sessionTick, gridOrder);
        standingsBroadcastCooldown = 1;
    }

    private void syncTrackMetadata() {
        trackCatalog.find(roomConfig.toProto().getTrackId())
                .ifPresent(track -> roomConfig.setTrackDisplayName(track.displayName()));
    }

    @Override
    public void tickMatchTimer() {
        if (soloMode == F1SoloMode.PRACTICE) {
            return;
        }
        matchPhase.tickMatch();
        if (matchPhase.matchTicksRemaining() % MatchPhaseMachine.TICKS_PER_SECOND == 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        }
        if (matchPhase.matchTimeExpired()) {
            endMatchNormally(F1AbortReason.F1_ABORT_TIME_CAP);
        }
    }

    private void endMatchNormally(F1AbortReason abortReason) {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        broadcastRaceResult(abortReason);
        matchPhase.endMatch();
        sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
        sessionPrepared = false;
        if (raceSession != null) {
            raceSession.clear(entityManager(), componentManager());
            raceSession = null;
        }
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastMatchResult(matchPhase, this);
    }

    private void abortRace(F1AbortReason abortReason) {
        broadcastRaceResult(abortReason);
        matchPhase.endMatch();
        sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
        sessionPrepared = false;
        if (raceSession != null) {
            raceSession.clear(entityManager(), componentManager());
            raceSession = null;
        }
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        logger.info("F1 room '{}' aborted — reason={}", host().roomId(), abortReason);
    }

    @Override
    public void tickScoreboardPhase() {
        matchPhase.tickScoreboard();
        if (matchPhase.scoreboardFinished()) {
            matchPhase.returnToLobby();
            lobby.resetAllReady();
            sessionPhase = F1SessionPhase.F1_SESSION_LOBBY;
            qualifyingCompletedForMatch = false;
            lastQualifyingResult = F1QualifyingResult.getDefaultInstance();
            raceGridOrder = List.of();
            host().broadcaster().broadcastLobbySnapshot(host(), this);
        }
    }

    private void broadcastRaceResult(F1AbortReason abortReason) {
        replayRecorder.stop();
        long durationMs = raceStartTick <= 0L
                ? Math.max(0L, sessionTick * 1000L / MatchPhaseMachine.TICKS_PER_SECOND)
                : Math.max(0L, (sessionTick - raceStartTick) * 1000L / MatchPhaseMachine.TICKS_PER_SECOND);
        String trackId = roomConfig.toProto().getTrackId();
        String replayFileName = ReplayWriter.write(
                host().roomId(),
                trackId,
                durationMs,
                replayRecorder.frames())
                .map(ReplayDocument::fileName)
                .orElse("");
        F1RaceResult result = F1RaceResult.newBuilder()
                .addAllFinalStandings(lastStandings.getEntriesList())
                .setRaceDurationMs(durationMs)
                .setAbortReason(abortReason)
                .addAllQualifyingGrid(lastQualifyingResult.getEntriesList())
                .setReplayFileName(replayFileName)
                .build();
        host().broadcaster().broadcast(GameMessage.newBuilder()
                .setF1(F1Message.newBuilder().setRaceResult(result))
                .build());
    }

    private void beginCountdown() {
        lobby.ensureBotCount(roomConfig.botCount(), roomConfig);
        matchPhase.startCountdown();
        prepareSessionForCountdown();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
    }

    private void broadcastRoomConfig() {
        host().broadcaster().broadcast(GameMessage.newBuilder()
                .setF1(F1Message.newBuilder().setRoomConfig(roomConfig.toProto()))
                .build());
    }

    private void broadcastRaceState() {
        long sessionRemainingMs = sessionPhase == F1SessionPhase.F1_SESSION_QUALIFYING
                ? qualifyingTicksRemaining * 1000L / MatchPhaseMachine.TICKS_PER_SECOND
                : matchPhase.matchRemainingMs();
        host().broadcaster().broadcast(GameMessage.newBuilder()
                .setF1(F1Message.newBuilder()
                        .setRaceState(com.triforge.protocol.proto.F1RaceState.newBuilder()
                                .setLapCount(roomConfig.toProto().getLapCount())
                                .setRaceStarted(true)
                                .setSessionPhase(sessionPhase)
                                .setSessionRemainingMs(sessionRemainingMs)
                                .build()))
                .build());
    }

    private GameEvent lifecycleEvent(GameEventType type) {
        return GameEvent.newBuilder().setType(type).build();
    }

    @Override
    public long playerEntityId(long playerId) {
        return raceSession == null ? 0L : raceSession.playerEntityId(playerId);
    }

    @Override
    public void viewerPosition(long playerId, float[] out) {
        long entityId = playerEntityId(playerId);
        if (entityId == 0L) {
            out[0] = 0f;
            out[1] = 0f;
            return;
        }
        int index = entityManager().indexOf(entityId);
        if (index < 0) {
            out[0] = 0f;
            out[1] = 0f;
            return;
        }
        var kinematics = componentManager().getAt(index, com.triforge.games.f1racing.components.CarKinematicsComponent.class);
        if (kinematics == null) {
            out[0] = 0f;
            out[1] = 0f;
            return;
        }
        out[0] = kinematics.x();
        out[1] = kinematics.y();
    }
}
