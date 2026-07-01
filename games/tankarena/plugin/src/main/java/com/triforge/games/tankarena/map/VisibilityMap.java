package com.triforge.games.tankarena.map;

import java.util.Arrays;

public final class VisibilityMap {
    private final int width;
    private final int height;
    private final byte[] cells;
    private byte[] lastSent;
    private boolean dirty;

    public VisibilityMap(int width, int height) {
        this.width = width;
        this.height = height;
        this.cells = new byte[width * height];
    }

    public int width() {
        return width;
    }

    public int height() {
        return height;
    }

    public byte[] cells() {
        return cells;
    }

    public boolean isDirty() {
        return dirty;
    }

    public void clearDirty() {
        dirty = false;
    }

    /**
     * Net-change check against the last mask actually sent to the client. Unlike {@link #isDirty()},
     * this ignores per-tick churn (VISIBLE→SEEN→VISIBLE on a stationary player) and only reports
     * true when the resulting mask differs from what the client already has.
     */
    public boolean hasChangedSinceLastSent() {
        return lastSent == null || !Arrays.equals(cells, lastSent);
    }

    /** Records the current mask as the client's known state. Call only when the fog is actually sent. */
    public void markSent() {
        if (lastSent == null) {
            lastSent = cells.clone();
        } else {
            System.arraycopy(cells, 0, lastSent, 0, cells.length);
        }
    }

    public void resetUnknown() {
        Arrays.fill(cells, FogVisibility.UNKNOWN);
        dirty = true;
    }

    public void beginFrame() {
        for (int index = 0; index < cells.length; index++) {
            if (cells[index] == FogVisibility.VISIBLE) {
                cells[index] = FogVisibility.SEEN;
                dirty = true;
            }
        }
    }

    public void setVisible(int x, int y) {
        if (!inBounds(x, y)) {
            return;
        }
        int index = cellIndex(x, y);
        if (cells[index] != FogVisibility.VISIBLE) {
            cells[index] = FogVisibility.VISIBLE;
            dirty = true;
        }
    }

    public byte cellAt(int x, int y) {
        if (!inBounds(x, y)) {
            return FogVisibility.UNKNOWN;
        }
        return cells[cellIndex(x, y)];
    }

    public boolean isVisible(int x, int y) {
        return cellAt(x, y) == FogVisibility.VISIBLE;
    }

    public boolean isSeen(int x, int y) {
        byte state = cellAt(x, y);
        return state == FogVisibility.SEEN || state == FogVisibility.VISIBLE;
    }

    public boolean copyStateFrom(VisibilityMap other) {
        if (other.width != width || other.height != height) {
            throw new IllegalArgumentException("Visibility map dimensions must match");
        }
        boolean changed = !Arrays.equals(cells, other.cells);
        if (changed) {
            System.arraycopy(other.cells, 0, cells, 0, cells.length);
            dirty = true;
        }
        return changed;
    }

    private boolean inBounds(int x, int y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    private int cellIndex(int x, int y) {
        return y * width + x;
    }
}
