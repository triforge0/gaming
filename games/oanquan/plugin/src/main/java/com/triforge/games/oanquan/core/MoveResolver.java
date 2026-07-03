package com.triforge.games.oanquan.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Authoritative Ô ăn quan rules. Mutates the {@link Board} it is given and returns the
 * ordered {@link Step} trace clients replay as animation. Pure logic: no engine,
 * protocol, or transport dependencies.
 */
public final class MoveResolver {

    /** Defensive cap: a legal relay never comes close; a hit means a rules bug. */
    private static final int MAX_STEPS = 10_000;

    private final RuleConfig config;

    public MoveResolver(RuleConfig config) {
        this.config = config;
    }

    public RuleConfig config() {
        return config;
    }

    /** Result of one applied move. {@code winnerSeat} is -1 while running or on a draw. */
    public record Outcome(List<Step> steps, boolean gameOver, int winnerSeat) {
    }

    /**
     * All legal moves for {@code seat}. Assumes {@link #borrowIfNeeded} already ran this
     * turn, so an empty result is only possible mid-bug or after game over.
     */
    public List<Move> legalMoves(Board board, int seat) {
        List<Move> moves = new ArrayList<>();
        int start = Board.rowStart(seat);
        for (int pit = start; pit < start + Board.ROW_SIZE; pit++) {
            if (board.stones(pit) > 0) {
                moves.add(new Move(pit, Direction.CLOCKWISE));
                moves.add(new Move(pit, Direction.COUNTER_CLOCKWISE));
            }
        }
        return moves;
    }

    /**
     * Turn-start rule "vay quân": with all five own pits empty, one stone from the seat's
     * captured stock goes into each own pit; the stock may go negative (debt). Returns the
     * BORROW steps, or an empty list when no borrow was needed.
     */
    public List<Step> borrowIfNeeded(Board board, int seat) {
        if (board.quanExhausted() || !board.rowEmpty(seat)) {
            return List.of();
        }
        List<Step> steps = new ArrayList<>(Board.ROW_SIZE);
        int start = Board.rowStart(seat);
        for (int pit = start; pit < start + Board.ROW_SIZE; pit++) {
            board.addStones(pit, 1);
            board.addCapturedDan(seat, -1);
            steps.add(Step.borrow(pit, seat));
        }
        return steps;
    }

    /**
     * Applies one move for {@code seat}: relay sowing, capture chains, endgame sweep, and
     * the turn switch. Throws {@link IllegalArgumentException} on an illegal move, leaving
     * the board untouched.
     */
    public Outcome apply(Board board, int seat, Move move) {
        if (seat != board.currentSeat()) {
            throw new IllegalArgumentException("not seat " + seat + "'s turn");
        }
        if (!Board.ownsPit(seat, move.pitIndex())) {
            throw new IllegalArgumentException("pit " + move.pitIndex() + " is not seat " + seat + "'s");
        }
        if (board.stones(move.pitIndex()) == 0) {
            throw new IllegalArgumentException("pit " + move.pitIndex() + " is empty");
        }

        List<Step> steps = new ArrayList<>();
        Direction dir = move.direction();

        // Relay sowing: lift, drop one per pit, re-lift while the landing neighbour is a
        // stocked dân pit; stop at a quan-pit neighbour.
        int cursor = move.pitIndex();
        int hand = lift(board, cursor, steps);
        while (true) {
            while (hand > 0) {
                cursor = Board.nextPit(cursor, dir);
                board.addStones(cursor, 1);
                hand--;
                addStep(steps, Step.sow(cursor));
            }
            int neighbour = Board.nextPit(cursor, dir);
            if (Board.isQuanPit(neighbour)) {
                break; // quan pits are never lifted — turn ends here
            }
            if (board.stones(neighbour) > 0) {
                cursor = neighbour;
                hand = lift(board, cursor, steps);
                continue;
            }
            captureChain(board, seat, neighbour, dir, steps);
            break;
        }

        boolean gameOver = board.quanExhausted();
        int winnerSeat = -1;
        if (gameOver) {
            sweep(board, seat, steps);
            winnerSeat = decideWinner(board);
        } else {
            board.setCurrentSeat(1 - seat);
        }
        return new Outcome(List.copyOf(steps), gameOver, winnerSeat);
    }

    private int lift(Board board, int pit, List<Step> steps) {
        int hand = board.stones(pit);
        board.setStones(pit, 0);
        addStep(steps, Step.pickup(pit, hand));
        return hand;
    }

    /**
     * Landing next to an empty gate pit captures the pit beyond it; the chain repeats
     * through alternating empty-gate/stocked-target pairs. Two consecutive empties, or a
     * quan-non-protected quan pit, end the turn.
     */
    private void captureChain(Board board, int seat, int gate, Direction dir, List<Step> steps) {
        while (board.pitEmpty(gate)) {
            int target = Board.nextPit(gate, dir);
            if (!capturable(board, target)) {
                return;
            }
            int dan = board.stones(target);
            int quan = board.quanPieces(target);
            board.setStones(target, 0);
            board.setQuanPieces(target, 0);
            board.addCapturedDan(seat, dan);
            board.addCapturedQuan(seat, quan);
            addStep(steps, Step.capture(target, dan, quan, seat));
            gate = Board.nextPit(target, dir);
        }
    }

    private boolean capturable(Board board, int pit) {
        if (board.pitEmpty(pit)) {
            return false;
        }
        boolean quanNonProtected = config.quanNonThreshold() > 0
                && Board.isQuanPit(pit)
                && board.quanPieces(pit) > 0
                && board.stones(pit) < config.quanNonThreshold();
        return !quanNonProtected;
    }

    /**
     * "Hết quan tàn dân": each seat pockets its own row; leftovers in the quan pits split
     * evenly, with any odd stone going to the mover's opponent.
     */
    private void sweep(Board board, int moverSeat, List<Step> steps) {
        for (int seat = 0; seat < Board.SEATS; seat++) {
            int start = Board.rowStart(seat);
            for (int pit = start; pit < start + Board.ROW_SIZE; pit++) {
                int dan = board.stones(pit);
                if (dan > 0) {
                    board.setStones(pit, 0);
                    board.addCapturedDan(seat, dan);
                    addStep(steps, Step.sweep(pit, dan, seat));
                }
            }
        }
        for (int pit : new int[] {Board.QUAN_PIT_A, Board.QUAN_PIT_B}) {
            int dan = board.stones(pit);
            if (dan == 0) {
                continue;
            }
            board.setStones(pit, 0);
            int moverShare = dan / 2;
            int opponentShare = dan - moverShare;
            if (moverShare > 0) {
                board.addCapturedDan(moverSeat, moverShare);
                addStep(steps, Step.sweep(pit, moverShare, moverSeat));
            }
            board.addCapturedDan(1 - moverSeat, opponentShare);
            addStep(steps, Step.sweep(pit, opponentShare, 1 - moverSeat));
        }
    }

    private int decideWinner(Board board) {
        int points0 = board.points(0, config);
        int points1 = board.points(1, config);
        if (points0 == points1) {
            return -1;
        }
        return points0 > points1 ? 0 : 1;
    }

    private void addStep(List<Step> steps, Step step) {
        if (steps.size() >= MAX_STEPS) {
            throw new IllegalStateException("move resolution exceeded " + MAX_STEPS + " steps — rules bug");
        }
        steps.add(step);
    }
}
