package com.triforge.games.oanquan.core;

import java.util.Arrays;

/**
 * Mutable Ô ăn quan position. Twelve circular pits: indices 0-4 are seat 0's dân row,
 * 5 is a quan pit, 6-10 are seat 1's dân row, 11 is the other quan pit. Quan pits hold
 * both quan pieces and sown dân stones. Captured stock per seat may go negative under
 * borrow debt (vay nợ).
 */
public final class Board {

    public static final int PIT_COUNT = 12;
    public static final int QUAN_PIT_A = 5;
    public static final int QUAN_PIT_B = 11;
    public static final int ROW_SIZE = 5;
    public static final int SEATS = 2;

    private final int[] stones = new int[PIT_COUNT];
    private final int[] quanPieces = new int[PIT_COUNT];
    private final int[] capturedDan = new int[SEATS];
    private final int[] capturedQuan = new int[SEATS];
    private int currentSeat;

    private Board() {
    }

    public static Board initial(RuleConfig config) {
        Board board = new Board();
        for (int pit = 0; pit < PIT_COUNT; pit++) {
            if (isQuanPit(pit)) {
                board.quanPieces[pit] = config.quanPerPit();
            } else {
                board.stones[pit] = config.stonesPerPit();
            }
        }
        board.currentSeat = 0;
        return board;
    }

    public Board copy() {
        Board board = new Board();
        System.arraycopy(stones, 0, board.stones, 0, PIT_COUNT);
        System.arraycopy(quanPieces, 0, board.quanPieces, 0, PIT_COUNT);
        System.arraycopy(capturedDan, 0, board.capturedDan, 0, SEATS);
        System.arraycopy(capturedQuan, 0, board.capturedQuan, 0, SEATS);
        board.currentSeat = currentSeat;
        return board;
    }

    public static boolean isQuanPit(int pit) {
        return pit == QUAN_PIT_A || pit == QUAN_PIT_B;
    }

    /** First pit index of a seat's dân row (0 or 6). */
    public static int rowStart(int seat) {
        return seat == 0 ? 0 : 6;
    }

    public static boolean ownsPit(int seat, int pit) {
        int start = rowStart(seat);
        return pit >= start && pit < start + ROW_SIZE;
    }

    public static int nextPit(int pit, Direction direction) {
        return Math.floorMod(pit + direction.step(), PIT_COUNT);
    }

    public int stones(int pit) {
        return stones[pit];
    }

    public int quanPieces(int pit) {
        return quanPieces[pit];
    }

    public boolean pitEmpty(int pit) {
        return stones[pit] == 0 && quanPieces[pit] == 0;
    }

    public int capturedDan(int seat) {
        return capturedDan[seat];
    }

    public int capturedQuan(int seat) {
        return capturedQuan[seat];
    }

    public int currentSeat() {
        return currentSeat;
    }

    public boolean rowEmpty(int seat) {
        int start = rowStart(seat);
        for (int pit = start; pit < start + ROW_SIZE; pit++) {
            if (stones[pit] > 0) {
                return false;
            }
        }
        return true;
    }

    /** Both quan captured — the game-over condition ("hết quan"). */
    public boolean quanExhausted() {
        return quanPieces[QUAN_PIT_A] == 0 && quanPieces[QUAN_PIT_B] == 0;
    }

    public int points(int seat, RuleConfig config) {
        return capturedDan[seat] + config.quanValue() * capturedQuan[seat];
    }

    // ── Mutations (package-private: only the resolver rewrites positions) ──

    void setStones(int pit, int value) {
        stones[pit] = value;
    }

    void addStones(int pit, int delta) {
        stones[pit] += delta;
    }

    void setQuanPieces(int pit, int value) {
        quanPieces[pit] = value;
    }

    void addCapturedDan(int seat, int delta) {
        capturedDan[seat] += delta;
    }

    void addCapturedQuan(int seat, int delta) {
        capturedQuan[seat] += delta;
    }

    void setCurrentSeat(int seat) {
        currentSeat = seat;
    }

    @Override
    public String toString() {
        return "Board{stones=" + Arrays.toString(stones)
                + ", quan=" + Arrays.toString(quanPieces)
                + ", capturedDan=" + Arrays.toString(capturedDan)
                + ", capturedQuan=" + Arrays.toString(capturedQuan)
                + ", currentSeat=" + currentSeat + '}';
    }
}
