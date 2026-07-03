package com.triforge.games.oanquan;

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
import com.triforge.games.oanquan.core.Board;
import com.triforge.games.oanquan.core.Direction;
import com.triforge.games.oanquan.core.Move;
import com.triforge.games.oanquan.core.MoveResolver;
import com.triforge.games.oanquan.core.RuleConfig;
import com.triforge.games.oanquan.core.Step;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameEventType;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MapSnapshot;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.OAQBoardState;
import com.triforge.protocol.proto.OAQDirection;
import com.triforge.protocol.proto.OAQMoveCommand;
import com.triforge.protocol.proto.OAQMoveRejected;
import com.triforge.protocol.proto.OAQMoveResult;
import com.triforge.protocol.proto.OAQScore;
import com.triforge.protocol.proto.OAQStep;
import com.triforge.protocol.proto.OAQStepType;
import com.triforge.protocol.proto.OAnQuanMessage;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.Team;
import io.netty.channel.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;
import java.util.Random;

/**
 * Ô ăn quan room game: authoritative turn-based board driven by the pure rules engine in
 * {@code core}. Ticks are idle while waiting for input except for the per-turn timeout,
 * which plays a random legal move for the slow player.
 */
public final class OAnQuanGame implements Game {

    private static final Logger logger = LoggerFactory.getLogger(OAnQuanGame.class);

    private RoomHost host;
    private final OAnQuanLobby lobby = new OAnQuanLobby();
    private MatchPhaseMachine matchPhase = new MatchPhaseMachine(MatchConfig.defaults());
    private final EcsWorld ecsWorld = new EcsWorld();
    private final DeltaService deltaService = new StandardDeltaService();
    private final RuleConfig rules = RuleConfig.defaults();
    private final MoveResolver resolver = new MoveResolver(rules);
    private final Random random = new Random();

    private Board board;
    private final long[] seatPlayers = new long[Board.SEATS];
    private int turnTicksRemaining;
    private boolean gameOver;
    private long winnerPlayerId;

    @Override
    public void bind(RoomHost host) {
        this.host = Objects.requireNonNull(host, "host");
    }

    private RoomHost host() {
        if (host == null) {
            throw new IllegalStateException("OAnQuanGame not bound to a room host");
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

    // ── Join / leave ────────────────────────────────────────────────

    @Override
    public void handleJoinRequest(String requestedName, Channel channel) {
        if (matchPhase.phase() != MatchPhase.LOBBY || lobby.isFull()) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            return;
        }

        long playerId = host().sessions().nextPlayerId();
        String displayName = OAnQuanLobby.isValidName(requestedName)
                ? requestedName.trim()
                : OAnQuanLobby.defaultName(playerId);
        boolean isHost = lobby.playerCount() == 0;

        lobby.addPlayer(playerId, displayName, isHost);
        host().sessions().register(playerId, channel);

        RoomLobbySnapshot snapshot = toLobbySnapshot(host());
        JoinResponse response = host().broadcaster()
                .joinResponseBuilder(playerId, this, snapshot)
                .build();
        host().broadcaster().sendJoinResponse(channel, response);
        host().broadcaster().broadcastLobbySnapshot(host(), this);

        logger.info("Player '{}' joined oanquan room '{}' as playerId={} (host={})",
                displayName, host().roomId(), playerId, isHost);
    }

    @Override
    public void handleLeaveRequest(long playerId) {
        boolean wasSeated = lobby.contains(playerId);
        host().sessions().unregister(playerId);
        lobby.removePlayer(playerId);

        if (wasSeated && matchPhase.phase() == MatchPhase.PLAYING && !gameOver) {
            forfeitAgainst(playerId);
            return;
        }
        if (wasSeated && matchPhase.phase() == MatchPhase.COUNTDOWN) {
            matchPhase.returnToLobby();
            lobby.resetAllReady();
        }
        host().broadcaster().broadcastLobbySnapshot(host(), this);
    }

    /** The player who left loses; the remaining seated player wins by forfeit. */
    private void forfeitAgainst(long leaverPlayerId) {
        int leaverSeat = seatOf(leaverPlayerId);
        gameOver = true;
        winnerPlayerId = leaverSeat >= 0 ? seatPlayers[1 - leaverSeat] : 0L;
        logger.info("Player {} left mid-game in room '{}' — forfeit, winner={}",
                leaverPlayerId, host().roomId(), winnerPlayerId);
        broadcastBoard();
        endMatch();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
    }

    // ── Lobby flow ──────────────────────────────────────────────────

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
            if (lobby.canStartMatch(matchPhase.phase())) {
                beginCountdown();
            }
        }
    }

    private void beginCountdown() {
        matchPhase.startCountdown();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        logger.info("Oanquan room '{}' entering countdown", host().roomId());
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
        List<Long> seated = lobby.seatedPlayerIds();
        if (seated.size() != Board.SEATS) {
            logger.warn("Oanquan room '{}' countdown finished with {} players — back to lobby",
                    host().roomId(), seated.size());
            matchPhase.returnToLobby();
            lobby.resetAllReady();
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            return;
        }
        seatPlayers[0] = seated.get(0);
        seatPlayers[1] = seated.get(1);
        board = Board.initial(rules);
        gameOver = false;
        winnerPlayerId = 0L;

        matchPhase.startMatch();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_STARTED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastFullSnapshot(this, host().currentTick());
        deltaService.syncBaseline(this);
        beginTurn();
        logger.info("Oanquan match started in room '{}': seat0={}, seat1={}",
                host().roomId(), seatPlayers[0], seatPlayers[1]);
    }

    // ── Gameplay ────────────────────────────────────────────────────

    @Override
    public void handleGameMessage(long playerId, GameMessage message) {
        if (!message.hasOaq() || !message.getOaq().hasMove()) {
            return;
        }
        OAQMoveCommand move = message.getOaq().getMove();
        if (matchPhase.phase() != MatchPhase.PLAYING || gameOver) {
            sendRejected(playerId, move, "match is not running");
            return;
        }
        int seat = seatOf(playerId);
        if (seat < 0 || seat != board.currentSeat()) {
            sendRejected(playerId, move, "not your turn");
            return;
        }
        Direction direction = fromProto(move.getDirection());
        if (direction == null) {
            sendRejected(playerId, move, "direction must be set");
            return;
        }
        applyMove(seat, new Move(move.getPitIndex(), direction), move);
    }

    private void applyMove(int seat, Move move, OAQMoveCommand original) {
        MoveResolver.Outcome outcome;
        try {
            outcome = resolver.apply(board, seat, move);
        } catch (IllegalArgumentException e) {
            sendRejected(seatPlayers[seat], original, e.getMessage());
            return;
        }

        broadcastMoveResult(seatPlayers[seat], outcome.steps());
        if (outcome.gameOver()) {
            gameOver = true;
            winnerPlayerId = outcome.winnerSeat() >= 0 ? seatPlayers[outcome.winnerSeat()] : 0L;
            broadcastBoard();
            endMatch();
        } else {
            beginTurn();
        }
    }

    /** Turn start: reset the timeout and apply the borrow rule before input is accepted. */
    private void beginTurn() {
        turnTicksRemaining = rules.turnTimeoutTicks();
        List<Step> borrow = resolver.borrowIfNeeded(board, board.currentSeat());
        if (!borrow.isEmpty()) {
            broadcastMoveResult(seatPlayers[board.currentSeat()], borrow);
        }
        broadcastBoard();
    }

    @Override
    public void tickMatchTimer() {
        // No global match clock: an oanquan match ends by board state. Only the turn
        // timeout ticks here.
        if (gameOver) {
            return;
        }
        turnTicksRemaining--;
        if (turnTicksRemaining > 0) {
            return;
        }
        int seat = board.currentSeat();
        List<Move> moves = resolver.legalMoves(board, seat);
        if (moves.isEmpty()) {
            // Unreachable if borrow ran at turn start; guard against a rules bug.
            logger.error("Oanquan room '{}': no legal moves for seat {} — ending match", host().roomId(), seat);
            gameOver = true;
            winnerPlayerId = 0L;
            broadcastBoard();
            endMatch();
            return;
        }
        Move move = moves.get(random.nextInt(moves.size()));
        logger.info("Oanquan room '{}': turn timeout, auto-playing {} for seat {}",
                host().roomId(), move, seat);
        applyMove(seat, move, OAQMoveCommand.newBuilder()
                .setPitIndex(move.pitIndex())
                .setDirection(toProto(move.direction()))
                .build());
    }

    private void endMatch() {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        matchPhase.endMatch();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastMatchResult(matchPhase, this);
        logger.info("Oanquan match ended in room '{}' (winner playerId={})", host().roomId(), winnerPlayerId);
    }

    @Override
    public void tickScoreboardPhase() {
        matchPhase.tickScoreboard();
        if (matchPhase.scoreboardFinished()) {
            matchPhase.returnToLobby();
            lobby.resetAllReady();
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            logger.info("Oanquan room '{}' returned to lobby", host().roomId());
        }
    }

    // ── Broadcasts ──────────────────────────────────────────────────

    private void broadcastBoard() {
        host().broadcaster().broadcast(GameMessage.newBuilder()
                .setOaq(OAnQuanMessage.newBuilder().setBoard(boardState()))
                .build());
    }

    private void broadcastMoveResult(long playerId, List<Step> steps) {
        OAQMoveResult.Builder result = OAQMoveResult.newBuilder().setPlayerId(playerId);
        for (Step step : steps) {
            result.addSteps(toProto(step));
        }
        host().broadcaster().broadcast(GameMessage.newBuilder()
                .setOaq(OAnQuanMessage.newBuilder().setMoveResult(result))
                .build());
    }

    private void sendRejected(long playerId, OAQMoveCommand move, String reason) {
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setOaq(OAnQuanMessage.newBuilder().setMoveRejected(OAQMoveRejected.newBuilder()
                        .setPitIndex(move.getPitIndex())
                        .setDirection(move.getDirection())
                        .setReason(reason == null ? "illegal move" : reason)))
                .build());
    }

    private OAQBoardState boardState() {
        OAQBoardState.Builder state = OAQBoardState.newBuilder();
        for (int pit = 0; pit < Board.PIT_COUNT; pit++) {
            state.addPitStones(board.stones(pit));
        }
        state.addQuanPieces(board.quanPieces(Board.QUAN_PIT_A));
        state.addQuanPieces(board.quanPieces(Board.QUAN_PIT_B));
        state.setCurrentPlayerId(gameOver ? 0L : seatPlayers[board.currentSeat()]);
        for (int seat = 0; seat < Board.SEATS; seat++) {
            state.addScores(OAQScore.newBuilder()
                    .setPlayerId(seatPlayers[seat])
                    .setSeat(seat)
                    .setCapturedDan(board.capturedDan(seat))
                    .setCapturedQuan(board.capturedQuan(seat))
                    .setPoints(board.points(seat, rules)));
        }
        state.setTurnTicksRemaining(Math.max(turnTicksRemaining, 0));
        state.setGameOver(gameOver);
        state.setWinnerPlayerId(winnerPlayerId);
        return state.build();
    }

    // ── Mapping helpers ─────────────────────────────────────────────

    private int seatOf(long playerId) {
        for (int seat = 0; seat < Board.SEATS; seat++) {
            if (seatPlayers[seat] == playerId) {
                return seat;
            }
        }
        return -1;
    }

    private static Direction fromProto(OAQDirection direction) {
        return switch (direction) {
            case OAQ_CLOCKWISE -> Direction.CLOCKWISE;
            case OAQ_COUNTER_CLOCKWISE -> Direction.COUNTER_CLOCKWISE;
            default -> null;
        };
    }

    private static OAQDirection toProto(Direction direction) {
        return direction == Direction.CLOCKWISE
                ? OAQDirection.OAQ_CLOCKWISE
                : OAQDirection.OAQ_COUNTER_CLOCKWISE;
    }

    private static OAQStep toProto(Step step) {
        return OAQStep.newBuilder()
                .setType(switch (step.type()) {
                    case PICKUP -> OAQStepType.OAQ_PICKUP;
                    case SOW -> OAQStepType.OAQ_SOW;
                    case CAPTURE -> OAQStepType.OAQ_CAPTURE;
                    case BORROW -> OAQStepType.OAQ_BORROW;
                    case SWEEP -> OAQStepType.OAQ_SWEEP;
                })
                .setPitIndex(step.pitIndex())
                .setStones(step.stones())
                .setQuanPieces(step.quanPieces())
                .setToSeat(Math.max(step.toSeat(), 0))
                .build();
    }

    private GameEvent lifecycleEvent(GameEventType type) {
        return GameEvent.newBuilder().setType(type).build();
    }

    // ── Engine plumbing (board game: ECS and spatial sync are inert) ──

    @Override
    public void queueInputCommand(long playerId, InputCommand input) {
        // Tank-style movement input does not apply to a board game.
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
        MatchResult.Builder result = MatchResult.newBuilder()
                .setWinningTeam(Team.TEAM_NONE)
                .setMatchDurationMs(matchController.config().matchDurationMs());
        if (board != null) {
            // Board-game points ride the legacy red/blue score fields: red = seat 0.
            result.setRedScore(Math.max(board.points(0, rules), 0));
            result.setBlueScore(Math.max(board.points(1, rules), 0));
        }
        return result.build();
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
    public long playerEntityId(long playerId) {
        return 0L;
    }

    @Override
    public void viewerPosition(long playerId, float[] out) {
        out[0] = 0f;
        out[1] = 0f;
    }
}
