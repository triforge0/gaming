package com.triforge.games.oanquan.core;

/**
 * One atomic event in a move's resolution, in animation order. {@code toSeat} is the
 * destination tray for CAPTURE/SWEEP and the source tray for BORROW; -1 when unused.
 */
public record Step(Type type, int pitIndex, int stones, int quanPieces, int toSeat) {

    public enum Type {
        /** Lift all dân stones from {@code pitIndex} into the mover's hand. */
        PICKUP,
        /** Drop one stone from hand into {@code pitIndex}. */
        SOW,
        /** Empty {@code pitIndex} (dân + quan pieces) into seat {@code toSeat}'s tray. */
        CAPTURE,
        /** Move one stone from seat {@code toSeat}'s tray into {@code pitIndex} (vay quân). */
        BORROW,
        /** Endgame: empty {@code pitIndex} dân into seat {@code toSeat}'s tray. */
        SWEEP
    }

    public static Step pickup(int pit, int stones) {
        return new Step(Type.PICKUP, pit, stones, 0, -1);
    }

    public static Step sow(int pit) {
        return new Step(Type.SOW, pit, 1, 0, -1);
    }

    public static Step capture(int pit, int stones, int quanPieces, int toSeat) {
        return new Step(Type.CAPTURE, pit, stones, quanPieces, toSeat);
    }

    public static Step borrow(int pit, int fromSeat) {
        return new Step(Type.BORROW, pit, 1, 0, fromSeat);
    }

    public static Step sweep(int pit, int stones, int toSeat) {
        return new Step(Type.SWEEP, pit, stones, 0, toSeat);
    }
}
