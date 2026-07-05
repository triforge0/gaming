package com.triforge.games.f1racing.race;

/** Per-car lap progression state. */
public final class LapCounter {

    private final int totalCheckpoints;
    private final long sessionStartTick;
    private int nextCheckpointIndex;
    private int lap;
    private int targetLaps;
    private boolean finished;
    private long lapStartTick;
    private long bestLapMs = Long.MAX_VALUE;
    private long lastLapMs;
    private long finishTick = -1L;

    public LapCounter(int totalCheckpoints, int targetLaps, long startTick) {
        this.totalCheckpoints = totalCheckpoints;
        this.targetLaps = Math.max(1, targetLaps);
        this.lapStartTick = startTick;
        this.sessionStartTick = startTick;
    }

    public int lap() {
        return lap;
    }

    public int nextCheckpointIndex() {
        return nextCheckpointIndex;
    }

    public boolean finished() {
        return finished;
    }

    public long bestLapMs() {
        return bestLapMs == Long.MAX_VALUE ? 0L : bestLapMs;
    }

    public long lastLapMs() {
        return lastLapMs;
    }

    /**
     * Total elapsed time from session start to the tick this car finished, or {@code -1} if the car
     * has not finished. Frozen at finish so classification is not affected by post-finish driving.
     */
    public long finishTimeMs(int ticksPerSecond) {
        if (finishTick < 0L) {
            return -1L;
        }
        return Math.max(0L, (finishTick - sessionStartTick) * 1000L / ticksPerSecond);
    }

    public void updatePosition(float x, float y, CheckpointDetector detector, long tick, int ticksPerSecond) {
        if (finished) {
            return;
        }
        int advanced = detector.tryAdvance(nextCheckpointIndex, x, y);
        if (advanced == nextCheckpointIndex) {
            return;
        }
        nextCheckpointIndex = advanced;
        if (nextCheckpointIndex >= totalCheckpoints) {
            completeLap(tick, ticksPerSecond);
        }
    }

    private void completeLap(long tick, int ticksPerSecond) {
        long elapsedMs = Math.max(0L, (tick - lapStartTick) * 1000L / ticksPerSecond);
        lastLapMs = elapsedMs;
        if (elapsedMs > 0 && elapsedMs < bestLapMs) {
            bestLapMs = elapsedMs;
        }
        nextCheckpointIndex = 0;
        lap++;
        lapStartTick = tick;
        if (lap >= targetLaps) {
            finished = true;
            finishTick = tick;
        }
    }
}
