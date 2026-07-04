package com.triforge.games.oanquan;

import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.OAQBoardState;
import com.triforge.protocol.proto.OAQDirection;
import com.triforge.protocol.proto.OAQMoveCommand;
import com.triforge.protocol.proto.OAnQuanMessage;
import com.triforge.protocol.proto.SetReadyAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

class OAnQuanGameTest {

    private OAnQuanRoomHost host;
    private OAnQuanGame game;

    @BeforeEach
    void setUp() {
        host = new OAnQuanRoomHost();
        game = new OAnQuanGame();
        game.matchConfig(new MatchConfig(1, 300, 1, 2, false));
        game.bind(host);
    }

    private void join(String name) {
        game.handleJoinRequest(name, null);
    }

    private void ready(long playerId) {
        game.handleLobbyCommand(playerId, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
    }

    private void tickUntilPlaying() {
        for (int tick = 0; tick < 600 && game.matchPhase() != MatchPhase.PLAYING; tick++) {
            game.onTick(tick);
        }
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.PLAYING);
    }

    private void startTwoPlayerMatch() {
        join("An");   // playerId 1 → seat 0 (host, moves first)
        join("Binh"); // playerId 2 → seat 1 — auto-ready and countdown
        tickUntilPlaying();
    }

    private void sendMove(long playerId, int pit, OAQDirection direction) {
        game.handleGameMessage(playerId, GameMessage.newBuilder()
                .setOaq(OAnQuanMessage.newBuilder().setMove(OAQMoveCommand.newBuilder()
                        .setPitIndex(pit)
                        .setDirection(direction)))
                .build());
    }

    // ── Lobby ───────────────────────────────────────────────────────

    @Test
    void thirdJoinIsRejected() {
        join("An");
        join("Binh");
        join("Chi");

        assertThat(host.joinResponses).hasSize(3);
        assertThat(host.joinResponses.get(2).getPlayerId()).isZero(); // rejected: no playerId
    }

    @Test
    void matchDoesNotStartWithOnlyOnePlayer() {
        join("An");
        for (int tick = 0; tick < 300; tick++) {
            game.onTick(tick);
        }
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.LOBBY);
    }

    @Test
    void matchStartsAutomaticallyWhenSecondPlayerJoins() {
        join("An");
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.LOBBY);

        join("Binh");
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.COUNTDOWN);

        tickUntilPlaying();
    }

    @Test
    void leaveDuringCountdownReturnsToLobby() {
        join("An");
        join("Binh");
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.COUNTDOWN);

        game.handleLeaveRequest(2L);

        assertThat(game.matchPhase()).isEqualTo(MatchPhase.LOBBY);
    }

    // ── Match start ─────────────────────────────────────────────────

    @Test
    void matchStartBroadcastsInitialBoardWithSeatZeroToMove() {
        startTwoPlayerMatch();

        OAQBoardState board = host.latestBoard();
        assertThat(board.getPitStonesList()).containsExactly(5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 0);
        assertThat(board.getQuanPiecesList()).containsExactly(1, 1);
        assertThat(board.getCurrentPlayerId()).isEqualTo(1L);
        assertThat(board.getGameOver()).isFalse();
        assertThat(board.getTurnTicksRemaining()).isEqualTo(1800);
    }

    // ── Moves ───────────────────────────────────────────────────────

    @Test
    void legalMoveBroadcastsTraceThenBoardAndSwitchesTurn() {
        startTwoPlayerMatch();

        sendMove(1L, 0, OAQDirection.OAQ_CLOCKWISE);

        assertThat(host.moveResults).hasSize(1);
        assertThat(host.moveResults.get(0).getPlayerId()).isEqualTo(1L);
        assertThat(host.moveResults.get(0).getStepsCount()).isGreaterThan(1);
        assertThat(host.latestBoard().getCurrentPlayerId()).isEqualTo(2L);
        assertThat(host.rejectionsFor(1L)).isEmpty();
    }

    @Test
    void moveOutOfTurnIsRejectedToSenderOnlyAndBoardUnchanged() {
        startTwoPlayerMatch();
        OAQBoardState before = host.latestBoard();

        sendMove(2L, 6, OAQDirection.OAQ_CLOCKWISE);

        assertThat(host.rejectionsFor(2L)).hasSize(1);
        assertThat(host.rejectionsFor(2L).get(0).getReason()).contains("turn");
        assertThat(host.latestBoard()).isEqualTo(before);
        assertThat(host.moveResults).isEmpty();
    }

    @Test
    void moveOnForeignOrEmptyPitOrWithoutDirectionIsRejected() {
        startTwoPlayerMatch();

        sendMove(1L, 6, OAQDirection.OAQ_CLOCKWISE); // seat 1's pit
        sendMove(1L, 5, OAQDirection.OAQ_CLOCKWISE); // quan pit
        sendMove(1L, 0, OAQDirection.OAQ_DIR_UNSPECIFIED);

        assertThat(host.rejectionsFor(1L)).hasSize(3);
        assertThat(host.moveResults).isEmpty();
    }

    // ── Turn timer ──────────────────────────────────────────────────

    @Test
    void turnTimeoutAutoPlaysALegalMoveAndSwitchesTurn() {
        startTwoPlayerMatch();

        for (int tick = 0; tick < 1800; tick++) {
            game.onTick(tick);
        }

        assertThat(host.moveResults).hasSize(1);
        assertThat(host.moveResults.get(0).getPlayerId()).isEqualTo(1L);
        assertThat(host.latestBoard().getCurrentPlayerId()).isEqualTo(2L);
    }

    @Test
    void timerResetsAfterEachMove() {
        startTwoPlayerMatch();

        for (int tick = 0; tick < 1000; tick++) {
            game.onTick(tick);
        }
        sendMove(1L, 0, OAQDirection.OAQ_CLOCKWISE);
        assertThat(host.latestBoard().getTurnTicksRemaining()).isEqualTo(1800);

        // Another full timeout must elapse before seat 1 is auto-played.
        for (int tick = 0; tick < 1799; tick++) {
            game.onTick(tick);
        }
        assertThat(host.moveResults).hasSize(1);
        game.onTick(0);
        assertThat(host.moveResults).hasSize(2);
        assertThat(host.moveResults.get(1).getPlayerId()).isEqualTo(2L);
    }

    // ── Forfeit ─────────────────────────────────────────────────────

    @Test
    void leavingMidMatchForfeitsToTheRemainingPlayer() {
        startTwoPlayerMatch();

        game.handleLeaveRequest(1L);

        OAQBoardState board = host.latestBoard();
        assertThat(board.getGameOver()).isTrue();
        assertThat(board.getWinnerPlayerId()).isEqualTo(2L);
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.ENDED);
    }

    // ── Full game via the public seam ───────────────────────────────

    @Test
    void randomFullGameReachesEndedWithConsistentFinalScores() {
        startTwoPlayerMatch();
        Random random = new Random(11);

        for (int move = 0; move < 2000 && !host.latestBoard().getGameOver(); move++) {
            OAQBoardState board = host.latestBoard();
            long current = board.getCurrentPlayerId();
            int rowStart = current == 1L ? 0 : 6;
            List<Integer> pits = new ArrayList<>();
            for (int pit = rowStart; pit < rowStart + 5; pit++) {
                if (board.getPitStones(pit) > 0) {
                    pits.add(pit);
                }
            }
            assertThat(pits).as("stocked pits for player %d (%s)", current, board).isNotEmpty();
            int pit = pits.get(random.nextInt(pits.size()));
            OAQDirection dir = random.nextBoolean()
                    ? OAQDirection.OAQ_CLOCKWISE
                    : OAQDirection.OAQ_COUNTER_CLOCKWISE;
            sendMove(current, pit, dir);
        }

        OAQBoardState finalBoard = host.latestBoard();
        assertThat(finalBoard.getGameOver()).isTrue();
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.ENDED);

        // All 50 dân are in the trays and both quan captured.
        int trayDan = finalBoard.getScores(0).getCapturedDan() + finalBoard.getScores(1).getCapturedDan();
        int trayQuan = finalBoard.getScores(0).getCapturedQuan() + finalBoard.getScores(1).getCapturedQuan();
        assertThat(finalBoard.getPitStonesList()).containsOnly(0);
        assertThat(trayDan).isEqualTo(50);
        assertThat(trayQuan).isEqualTo(2);

        // Winner matches the higher score (or draw → winner 0).
        int points0 = finalBoard.getScores(0).getPoints();
        int points1 = finalBoard.getScores(1).getPoints();
        if (points0 == points1) {
            assertThat(finalBoard.getWinnerPlayerId()).isZero();
        } else {
            long expected = points0 > points1
                    ? finalBoard.getScores(0).getPlayerId()
                    : finalBoard.getScores(1).getPlayerId();
            assertThat(finalBoard.getWinnerPlayerId()).isEqualTo(expected);
        }

        // Scoreboard phase eventually returns to the lobby for a rematch.
        for (int tick = 0; tick < 600 && game.matchPhase() != MatchPhase.LOBBY; tick++) {
            game.onTick(tick);
        }
        assertThat(game.matchPhase()).isEqualTo(MatchPhase.LOBBY);
    }
}
