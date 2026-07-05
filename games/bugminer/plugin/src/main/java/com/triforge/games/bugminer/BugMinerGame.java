package com.triforge.games.bugminer;

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
import com.triforge.protocol.proto.*;
import io.netty.channel.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class BugMinerGame implements Game {
    private static final Logger logger = LoggerFactory.getLogger(BugMinerGame.class);

    private RoomHost host;
    private final BugMinerLobby lobby = new BugMinerLobby();
    private MatchPhaseMachine matchPhase = new MatchPhaseMachine(MatchConfig.defaults());
    private final EcsWorld ecsWorld = new EcsWorld();
    private final DeltaService deltaService = new StandardDeltaService();
    
    private BugMinerBoard board = new BugMinerBoard();

    @Override
    public void bind(RoomHost host) {
        this.host = Objects.requireNonNull(host, "host");
    }

    private RoomHost host() {
        if (host == null) {
            throw new IllegalStateException("BugMinerGame not bound to a room host");
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
        Long existingPlayerId = lobby.getPlayerIdByName(requestedName);
        if (existingPlayerId != null) {
            if (host().sessions().isConnected(existingPlayerId)) {
                JoinResponse response = host().broadcaster()
                        .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                        .build();
                host().broadcaster().sendJoinResponse(channel, response);
                logger.info("Rejected duplicate name '{}' in room '{}'", requestedName, host().roomId());
                return;
            }
            host().sessions().register(existingPlayerId, channel);
            logger.info("Player '{}' reconnected as playerId={}", requestedName, existingPlayerId);
            
            RoomLobbySnapshot snapshot = toLobbySnapshot(host());
            JoinResponse response = host().broadcaster()
                    .joinResponseBuilder(existingPlayerId, this, snapshot)
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            broadcastBoardState();
            return;
        }

        if (matchPhase.phase() == MatchPhase.PLAYING) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            return;
        }

        if (lobby.playerCount() >= BugMinerLobby.MAX_PLAYERS) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            logger.info("Rejected join for '{}' — room full ({})", requestedName, host().roomId());
            return;
        }

        long playerId = host().sessions().nextPlayerId();
        String displayName = BugMinerLobby.isValidName(requestedName)
                ? requestedName.trim()
                : BugMinerLobby.defaultName(playerId);
        boolean isHost = lobby.playerCount() == 0;

        lobby.addPlayer(playerId, displayName, isHost);
        host().sessions().register(playerId, channel);

        RoomLobbySnapshot snapshot = toLobbySnapshot(host());
        JoinResponse response = host().broadcaster()
                .joinResponseBuilder(playerId, this, snapshot)
                .build();
        host().broadcaster().sendJoinResponse(channel, response);
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        broadcastBoardState();

        logger.info("Player '{}' joined bugminer room '{}' as playerId={} (host={})",
                displayName, host().roomId(), playerId, isHost);
    }

    @Override
    public void handleLeaveRequest(long playerId) {
        if (matchPhase.phase() == MatchPhase.PLAYING) {
            host().sessions().unregister(playerId);
            logger.info("Player playerId={} disconnected during match, keeping session for reconnect", playerId);
        } else {
            host().sessions().unregister(playerId);
            lobby.removePlayer(playerId);
            host().broadcaster().broadcastLobbySnapshot(host(), this);
        }
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
                if (lobby.isHost(playerId) && lobby.playerCount() >= BugMinerLobby.MAX_PLAYERS
                        && matchPhase.phase() == MatchPhase.LOBBY) {
                    beginCountdown();
                }
                yield false;
            }
            case SETTEAM, SETSPAWN, SETTEAMSETUP, ACTION_NOT_SET -> false;
        };

        if (applied) {
            host().broadcaster().broadcastLobbySnapshot(host(), this);
        }
    }

    @Override
    public void queueInputCommand(long playerId, InputCommand input) {
    }

    @Override
    public EntityManager entityManager() { return ecsWorld.entityManager(); }
    @Override
    public ComponentManager componentManager() { return ecsWorld.componentManager(); }
    @Override
    public DeltaService deltaService() { return deltaService; }
    @Override
    public EntitySnapshotWriter snapshotWriter() { return EmptyEntitySnapshotWriter.INSTANCE; }
    @Override
    public InterestFilter interestFilter() { return PassThroughInterestFilter.INSTANCE; }

    @Override
    public MapSnapshot toMapSnapshot() {
        return MapSnapshot.newBuilder().setWidth(1).setHeight(1).build();
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
    public MatchController matchController() { return matchPhase; }
    @Override
    public MatchPhase matchPhase() { return matchPhase.phase(); }
    @Override
    public Game skipLobby(boolean skip) { return this; }
    
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
        
        List<Long> pids = lobby.playerIds();
        long p1 = pids.size() > 0 ? pids.get(0) : 0;
        long p2 = pids.size() > 1 ? pids.get(1) : 0;
        
        board.init(p1, p2);
        if (board.isBattleModeActive()) {
            board.beginBattleMode(host().roomId());
        } else if (board.isFairModeActive()) {
            board.beginFairMode(host().roomId());
        } else {
            board.beginFreeMode();
        }
        broadcastBoardState();
        
        logger.info("BugMiner match started in room '{}' ({} players)", host().roomId(), lobby.playerCount());
    }

    @Override
    public void tickMatchTimer() {
        matchPhase.tickMatch();
        boolean active = hasConnectedPlayers();
        if (matchPhase.matchTicksRemaining() % MatchPhaseMachine.TICKS_PER_SECOND == 0) {
            if (active) {
                host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
            }
        }
        if (matchPhase.matchTimeExpired()) {
            endMatch();
        }
        
        if (active) {
            board.tick(1f / 60f, true);
            if (board.battleArena != null && board.battleArena.isFinished()) {
                board.setMatchOutcome(board.battleArena.winnerId(), board.battleArena.toProto().getEndReason());
                broadcastBoardState();
                endMatch();
                return;
            }
            if (checkChallengeWinConditions()) {
                board.setMatchOutcome(board.resolveDualWinner(), board.resolveDualEndReason());
                broadcastBoardState();
                endMatch();
                return;
            }
            broadcastBoardState();
        }
    }

    private boolean checkChallengeWinConditions() {
        if (board.battleArena != null || board.challengeA == null || board.challengeB == null) {
            return false;
        }
        ChallengeInstance a = board.challengeA;
        ChallengeInstance b = board.challengeB;

        if ("target".equals(a.endReason()) || "target".equals(b.endReason())) return true;
        if ("poison".equals(a.endReason()) || "poison".equals(b.endReason())) return true;
        return a.isFinished() && b.isFinished();
    }

    private boolean hasConnectedPlayers() {
        for (long playerId : lobby.playerIds()) {
            if (host().sessions().isConnected(playerId)) {
                return true;
            }
        }
        return false;
    }

    private void endMatch() {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        matchPhase.endMatch();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastMatchResult(matchPhase, this);
        logger.info("BugMiner match ended in room '{}'", host().roomId());
    }

    @Override
    public void tickScoreboardPhase() {
        matchPhase.tickScoreboard();
        if (matchPhase.scoreboardFinished()) {
            board.resetForLobby();
            matchPhase.returnToLobby();
            lobby.resetAllReady();
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            broadcastBoardState();
            logger.info("BugMiner room '{}' returned to lobby", host().roomId());
        }
    }

    private void beginCountdown() {
        matchPhase.startCountdown();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        logger.info("BugMiner room '{}' entering countdown ({} players)", host().roomId(), lobby.playerCount());
    }

    private GameEvent lifecycleEvent(GameEventType type) {
        return GameEvent.newBuilder().setType(type).build();
    }

    @Override
    public long playerEntityId(long playerId) { return 0L; }

    @Override
    public void viewerPosition(long playerId, float[] out) {
        out[0] = 0f;
        out[1] = 0f;
    }
    
    private void broadcastBoardState() {
        BugMinerBoardState state = board.getState();
        GameMessage msg = GameMessage.newBuilder()
            .setBugminer(BugMinerMessage.newBuilder().setBoard(state))
            .build();
        host().broadcaster().broadcast(msg);
    }

    @Override
    public void handleGameMessage(long playerId, GameMessage message) {
        if (!message.hasBugminer()) return;
        BugMinerMessage bm = message.getBugminer();
        
        ChallengeInstance c;
        switch (bm.getContentCase()) {
            case CONFIGUREFAIRMODE -> {
                if (!lobby.isHost(playerId)) break;
                if (matchPhase.phase() != MatchPhase.LOBBY && matchPhase.phase() != MatchPhase.COUNTDOWN) break;
                BMConfigureFairModeCommand cmd = bm.getConfigureFairMode();
                board.fairMode().applyPartial(
                        cmd.hasEnabled() ? cmd.getEnabled() : null,
                        cmd.hasBattle() ? cmd.getBattle() : null,
                        cmd.hasLevelId() ? cmd.getLevelId() : null,
                        cmd.hasTimeLimit() ? cmd.getTimeLimit() : null);
                broadcastBoardState();
            }
            case SETLEVEL -> {
                if (board.isAutoSetupMode()) break;
                c = board.getChallengeForPlayer(playerId);
                if (c != null && c.setLevel(bm.getSetLevel().getLevelId())) broadcastBoardState();
            }
            case SETTIMELIMIT -> {
                if (board.isAutoSetupMode()) break;
                c = board.getChallengeForPlayer(playerId);
                if (c != null && c.setTimeLimit(bm.getSetTimeLimit().getTimeLimit())) broadcastBoardState();
            }
            case PLACEITEM -> {
                if (board.isAutoSetupMode()) break;
                c = board.getChallengeForPlayer(playerId);
                // We need to parse ItemType here
                BugMinerItemType type = BugMinerItemType.BM_ITEM_NONE;
                try {
                    type = BugMinerItemType.valueOf(bm.getPlaceItem().getItemId()); // wait, place item sends item ID not type?
                } catch (Exception e) {}
                if (c != null && c.placeItem(playerId, bm.getPlaceItem().getItemId(), bm.getPlaceItem().getX(), bm.getPlaceItem().getY())) {
                    broadcastBoardState();
                }
            }
            case AUTOARRANGE -> {
                if (board.isAutoSetupMode()) break;
                c = board.getChallengeForPlayer(playerId);
                if (c != null && c.autoArrange(playerId)) broadcastBoardState();
            }
            case LOCKMAP -> {
                if (board.isAutoSetupMode()) break;
                c = board.getChallengeForPlayer(playerId);
                if (c != null && c.lockSetup(playerId)) {
                    board.onSetupLocked();
                    broadcastBoardState();
                }
            }
            case FIREHOOK -> {
                if (board.fireHook(playerId)) broadcastBoardState();
            }
            case THROWBOMB -> {
                if (board.throwBomb(playerId)) broadcastBoardState();
            }
            case PAUSE -> {
                if (matchPhase.phase() != MatchPhase.PLAYING) break;
                board.setPaused(bm.getPause().getPaused());
                broadcastBoardState();
            }
            case RESTART -> {
                restartToLobby();
            }
            default -> {}
        }
    }

    private void restartToLobby() {
        if (matchPhase.phase() != MatchPhase.PLAYING && matchPhase.phase() != MatchPhase.ENDED) {
            return;
        }
        board.resetForLobby();
        matchPhase.returnToLobby();
        lobby.resetAllReady();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        broadcastBoardState();
        logger.info("BugMiner room '{}' restarted to lobby", host().roomId());
    }
}
