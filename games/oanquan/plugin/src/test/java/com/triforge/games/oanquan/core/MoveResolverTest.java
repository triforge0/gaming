package com.triforge.games.oanquan.core;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MoveResolverTest {

    private final RuleConfig config = RuleConfig.defaults();
    private final MoveResolver resolver = new MoveResolver(config);

    // ── Setup & basics ──────────────────────────────────────────────

    @Test
    void initialBoardSeedsTenDanPitsAndTwoQuan() {
        Board board = Board.initial(config);
        for (int pit = 0; pit < Board.PIT_COUNT; pit++) {
            if (Board.isQuanPit(pit)) {
                assertThat(board.stones(pit)).isZero();
                assertThat(board.quanPieces(pit)).isEqualTo(1);
            } else {
                assertThat(board.stones(pit)).isEqualTo(5);
            }
        }
        assertThat(board.currentSeat()).isZero();
        assertThat(TestBoards.totalDan(board)).isEqualTo(50);
        assertThat(TestBoards.totalQuan(board)).isEqualTo(2);
    }

    @Test
    void legalMovesAreOwnStockedPitsInBothDirections() {
        int[] stones = {3, 0, 1, 0, 0, /*quan*/ 0, 5, 5, 5, 5, 5, /*quan*/ 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        List<Move> moves = resolver.legalMoves(board, 0);
        assertThat(moves).containsExactlyInAnyOrder(
                new Move(0, Direction.CLOCKWISE), new Move(0, Direction.COUNTER_CLOCKWISE),
                new Move(2, Direction.CLOCKWISE), new Move(2, Direction.COUNTER_CLOCKWISE));
    }

    // ── Sowing ──────────────────────────────────────────────────────

    @Test
    void sowingDropsOneStonePerPitIncludingQuanPits() {
        // Pit 3 holds 3 stones; clockwise they land in 4, 5 (quan), 6. Pit 7 is empty and
        // pit 8 is empty too → two empties, turn ends with no capture.
        int[] stones = {5, 5, 5, 3, 5, 0, 5, 0, 0, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(3, Direction.CLOCKWISE));

        assertThat(board.stones(3)).isZero();
        assertThat(board.stones(4)).isEqualTo(6);
        assertThat(board.stones(Board.QUAN_PIT_A)).isEqualTo(1); // dân landed in quan pit
        assertThat(board.quanPieces(Board.QUAN_PIT_A)).isEqualTo(1); // quan piece untouched
        assertThat(board.stones(6)).isEqualTo(6);
        assertThat(outcome.steps()).containsExactly(
                Step.pickup(3, 3), Step.sow(4), Step.sow(5), Step.sow(6));
        assertThat(board.currentSeat()).isEqualTo(1);
        assertThat(outcome.gameOver()).isFalse();
    }

    @Test
    void counterClockwiseSowingWrapsAroundTheBoard() {
        // Pit 0 counter-clockwise: stones land in 11 (quan), 10, 9. Pits 8 and 7 are empty,
        // so no relay and no capture follow.
        int[] stones = {3, 5, 5, 5, 5, 0, 5, 0, 0, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        resolver.apply(board, 0, new Move(0, Direction.COUNTER_CLOCKWISE));

        assertThat(board.stones(Board.QUAN_PIT_B)).isEqualTo(1);
        assertThat(board.stones(10)).isEqualTo(6);
        assertThat(board.stones(9)).isEqualTo(6);
    }

    @Test
    void relayLiftsTheStockedNeighbourAndKeepsSowing() {
        // Pit 0 with 1 stone → lands in 1; neighbour 2 stocked with 2 → relay: sow into 3, 4;
        // neighbour 5 is a quan pit → stop.
        int[] stones = {1, 0, 2, 0, 0, 0, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(0, Direction.CLOCKWISE));

        assertThat(outcome.steps()).containsExactly(
                Step.pickup(0, 1), Step.sow(1),
                Step.pickup(2, 2), Step.sow(3), Step.sow(4));
        assertThat(board.stones(1)).isEqualTo(1);
        assertThat(board.stones(2)).isZero();
        assertThat(board.stones(3)).isEqualTo(1);
        assertThat(board.stones(4)).isEqualTo(1);
    }

    @Test
    void turnEndsWhenLandingNextToAQuanPitEvenIfItHoldsStones() {
        // Pit 4 with 1 stone lands in 5? No — pit 4's clockwise neighbour is the quan pit,
        // so sow into 5, cursor=5, neighbour=6... use pit 3: 1 stone lands in 4, neighbour
        // is quan pit 5 → stop, quan pit not lifted even though it holds dân.
        int[] stones = {5, 5, 5, 1, 0, 4, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(3, Direction.CLOCKWISE));

        assertThat(outcome.steps()).containsExactly(Step.pickup(3, 1), Step.sow(4));
        assertThat(board.stones(Board.QUAN_PIT_A)).isEqualTo(4);
    }

    // ── Capturing ───────────────────────────────────────────────────

    @Test
    void landingBeforeAnEmptyGateCapturesThePitBeyondIt() {
        // Pit 0 with 1 stone lands in 1; gate 2 empty; target 3 has 7 → seat 0 captures 7.
        int[] stones = {1, 0, 0, 7, 5, 0, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(0, Direction.CLOCKWISE));

        assertThat(board.capturedDan(0)).isEqualTo(7);
        assertThat(board.stones(3)).isZero();
        assertThat(outcome.steps()).endsWith(Step.capture(3, 7, 0, 0));
    }

    @Test
    void captureChainsThroughAlternatingEmptyAndStockedPits() {
        // Land in 1; gate 2 empty → capture 3 (4 stones); gate 4 empty → capture 5's dân?
        // Pit 5 is the quan pit holding 1 quan + 2 dân → captured too (quan-non off).
        int[] stones = {1, 0, 0, 4, 0, 2, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(0, Direction.CLOCKWISE));

        assertThat(board.capturedDan(0)).isEqualTo(6);
        assertThat(board.capturedQuan(0)).isEqualTo(1);
        assertThat(outcome.steps()).endsWith(
                Step.capture(3, 4, 0, 0),
                Step.capture(Board.QUAN_PIT_A, 2, 1, 0));
    }

    @Test
    void twoConsecutiveEmptyPitsEndTheTurnWithoutCapture() {
        int[] stones = {1, 0, 0, 0, 5, 0, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(0, Direction.CLOCKWISE));

        assertThat(board.capturedDan(0)).isZero();
        assertThat(outcome.steps()).containsExactly(Step.pickup(0, 1), Step.sow(1));
    }

    @Test
    void capturesOwnRowPitsToo() {
        // Seat 1 plays pit 6 counter-clockwise: 1 stone lands in 5? no — CCW from 6 is 5
        // (quan). Use seat 1 pit 8 CCW: lands in 7; gate 6 empty; target 5 is quan pit with
        // dân → capture. Ownership never matters, only geometry.
        int[] stones = {5, 5, 5, 5, 5, 3, 0, 1, 1, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 1);
        resolver.apply(board, 1, new Move(8, Direction.COUNTER_CLOCKWISE));

        assertThat(board.capturedDan(1)).isEqualTo(3);
        assertThat(board.capturedQuan(1)).isEqualTo(1);
    }

    @Test
    void quanNonThresholdProtectsAQuanPitHoldingItsQuan() {
        MoveResolver protectedResolver = new MoveResolver(new RuleConfig(5, 1, 10, 5, 1800));
        // Land in 3; gate 4 empty; target 5 = quan pit with 1 quan + 2 dân (< 5) → protected.
        int[] stones = {5, 5, 1, 0, 0, 2, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        MoveResolver.Outcome outcome = protectedResolver.apply(board, 0, new Move(2, Direction.CLOCKWISE));

        assertThat(board.capturedQuan(0)).isZero();
        assertThat(board.quanPieces(Board.QUAN_PIT_A)).isEqualTo(1);
        assertThat(outcome.steps()).containsExactly(Step.pickup(2, 1), Step.sow(3));
    }

    // ── Borrowing (vay quân) ────────────────────────────────────────

    @Test
    void emptyRowBorrowsOneStonePerPitFromCapturedStock() {
        int[] stones = {0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        board.addCapturedDan(0, 8);

        List<Step> steps = resolver.borrowIfNeeded(board, 0);

        assertThat(steps).containsExactly(
                Step.borrow(0, 0), Step.borrow(1, 0), Step.borrow(2, 0),
                Step.borrow(3, 0), Step.borrow(4, 0));
        assertThat(board.capturedDan(0)).isEqualTo(3);
        for (int pit = 0; pit < 5; pit++) {
            assertThat(board.stones(pit)).isEqualTo(1);
        }
    }

    @Test
    void borrowMayDriveCapturedStockNegative() {
        int[] stones = {0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0};
        Board board = TestBoards.custom(stones, 1, 1, 0);
        board.addCapturedDan(0, 2);

        resolver.borrowIfNeeded(board, 0);

        assertThat(board.capturedDan(0)).isEqualTo(-3);
    }

    @Test
    void noBorrowWhenRowHasStonesOrGameIsOver() {
        Board board = Board.initial(config);
        assertThat(resolver.borrowIfNeeded(board, 0)).isEmpty();

        int[] stones = {0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0};
        Board over = TestBoards.custom(stones, 0, 0, 0);
        assertThat(resolver.borrowIfNeeded(over, 0)).isEmpty();
    }

    // ── Endgame ─────────────────────────────────────────────────────

    @Test
    void capturingTheLastQuanEndsTheGameAndSweepsTheRows() {
        // Quan pit 11 already exhausted. Seat 0 lands in 3; gate 4 empty; target 5 = last
        // quan (1 quan + 0 dân) → captured → game over. Rows swept to their owners; no
        // leftovers in quan pits.
        int[] stones = {5, 5, 1, 0, 0, 0, 2, 3, 0, 0, 4, 0};
        Board board = TestBoards.custom(stones, 1, 0, 0);
        board.addCapturedDan(0, 20);
        board.addCapturedDan(1, 15);
        board.addCapturedQuan(1, 1);

        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(2, Direction.CLOCKWISE));

        assertThat(outcome.gameOver()).isTrue();
        assertThat(board.quanExhausted()).isTrue();
        // Seat 0: 20 + quan capture (0 dân) + own row sweep (5+5+0+1 landed... pit0=5,pit1=5,pit3=1) = 31
        assertThat(board.capturedDan(0)).isEqualTo(20 + 5 + 5 + 1);
        assertThat(board.capturedQuan(0)).isEqualTo(1);
        // Seat 1: 15 + row sweep (2+3+4) = 24
        assertThat(board.capturedDan(1)).isEqualTo(15 + 2 + 3 + 4);
        // Points: seat0 = 31 + 10, seat1 = 24 + 10 → seat 0 wins
        assertThat(outcome.winnerSeat()).isZero();
        assertThat(outcome.steps()).contains(
                Step.sweep(0, 5, 0), Step.sweep(1, 5, 0), Step.sweep(3, 1, 0),
                Step.sweep(6, 2, 1), Step.sweep(7, 3, 1), Step.sweep(10, 4, 1));
    }

    @Test
    void leftoverDanInQuanPitsSplitsEvenlyWithOddStoneToMoversOpponent() {
        // Seat 0 makes the final capture; quan pit 11 holds 3 leftover dân → mover gets 1,
        // opponent gets 2.
        int[] stones = {5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3};
        Board board = TestBoards.custom(stones, 1, 0, 0);

        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(2, Direction.CLOCKWISE));

        assertThat(outcome.gameOver()).isTrue();
        assertThat(outcome.steps()).contains(
                Step.sweep(Board.QUAN_PIT_B, 1, 0),
                Step.sweep(Board.QUAN_PIT_B, 2, 1));
    }

    @Test
    void equalPointsIsADraw() {
        // Final capture leaves both seats with identical points.
        int[] stones = {5, 5, 1, 0, 0, 0, 5, 6, 0, 0, 0, 0};
        Board board = TestBoards.custom(stones, 1, 0, 0);
        board.addCapturedQuan(1, 1); // each seat ends with 1 quan; dan: seat0 = 11, seat1 = 11

        MoveResolver.Outcome outcome = resolver.apply(board, 0, new Move(2, Direction.CLOCKWISE));

        assertThat(outcome.gameOver()).isTrue();
        assertThat(board.points(0, config)).isEqualTo(board.points(1, config));
        assertThat(outcome.winnerSeat()).isEqualTo(-1);
    }

    // ── Validation ──────────────────────────────────────────────────

    @Test
    void rejectsMovesOutOfTurnFromForeignPitsOrEmptyPits() {
        Board board = Board.initial(config);

        assertThatThrownBy(() -> resolver.apply(board, 1, new Move(6, Direction.CLOCKWISE)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("turn");
        assertThatThrownBy(() -> resolver.apply(board, 0, new Move(7, Direction.CLOCKWISE)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not seat");
        assertThatThrownBy(() -> resolver.apply(board, 0, new Move(Board.QUAN_PIT_A, Direction.CLOCKWISE)))
                .isInstanceOf(IllegalArgumentException.class);

        int[] stones = {0, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 0};
        Board withEmpty = TestBoards.custom(stones, 1, 1, 0);
        assertThatThrownBy(() -> resolver.apply(withEmpty, 0, new Move(0, Direction.CLOCKWISE)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("empty");

        // Failed validation must leave the board untouched.
        assertThat(TestBoards.totalDan(withEmpty)).isEqualTo(45);
        assertThat(withEmpty.currentSeat()).isZero();
    }

    // ── Conservation property ───────────────────────────────────────

    @Test
    void randomPlayoutsConserveStonesAndQuanAfterEveryMove() {
        Random random = new Random(42);
        for (int game = 0; game < 50; game++) {
            Board board = Board.initial(config);
            for (int turn = 0; turn < 500 && !board.quanExhausted(); turn++) {
                int seat = board.currentSeat();
                resolver.borrowIfNeeded(board, seat);
                List<Move> moves = resolver.legalMoves(board, seat);
                assertThat(moves).as("legal moves after borrow, game %d turn %d", game, turn)
                        .isNotEmpty();
                Move move = moves.get(random.nextInt(moves.size()));
                resolver.apply(board, seat, move);

                assertThat(TestBoards.totalDan(board))
                        .as("dân conservation, game %d turn %d (%s)", game, turn, board)
                        .isEqualTo(50);
                assertThat(TestBoards.totalQuan(board))
                        .as("quan conservation, game %d turn %d", game, turn)
                        .isEqualTo(2);
            }
        }
    }

    @Test
    void randomPlayoutsReachGameOverWithinReasonableTurns() {
        Random random = new Random(7);
        int finished = 0;
        for (int game = 0; game < 20; game++) {
            Board board = Board.initial(config);
            for (int turn = 0; turn < 2000 && !board.quanExhausted(); turn++) {
                int seat = board.currentSeat();
                resolver.borrowIfNeeded(board, seat);
                List<Move> moves = resolver.legalMoves(board, seat);
                resolver.apply(board, seat, moves.get(random.nextInt(moves.size())));
            }
            if (board.quanExhausted()) {
                finished++;
            }
        }
        assertThat(finished).as("random games that ended").isEqualTo(20);
    }
}
