package com.triforge.games.oanquan.core;

/** Builds arbitrary positions for rules tests via the package-private mutators. */
final class TestBoards {

    private TestBoards() {
    }

    /**
     * @param stones     12 dân counts, circular index order
     * @param quanA      quan pieces in pit 5
     * @param quanB      quan pieces in pit 11
     * @param currentSeat seat to move
     */
    static Board custom(int[] stones, int quanA, int quanB, int currentSeat) {
        Board board = Board.initial(RuleConfig.defaults());
        for (int pit = 0; pit < Board.PIT_COUNT; pit++) {
            board.setStones(pit, stones[pit]);
            board.setQuanPieces(pit, 0);
        }
        board.setQuanPieces(Board.QUAN_PIT_A, quanA);
        board.setQuanPieces(Board.QUAN_PIT_B, quanB);
        board.setCurrentSeat(currentSeat);
        return board;
    }

    static int totalDan(Board board) {
        int total = 0;
        for (int pit = 0; pit < Board.PIT_COUNT; pit++) {
            total += board.stones(pit);
        }
        return total + board.capturedDan(0) + board.capturedDan(1);
    }

    static int totalQuan(Board board) {
        return board.quanPieces(Board.QUAN_PIT_A) + board.quanPieces(Board.QUAN_PIT_B)
                + board.capturedQuan(0) + board.capturedQuan(1);
    }
}
