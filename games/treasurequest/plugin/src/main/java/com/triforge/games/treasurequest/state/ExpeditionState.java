package com.triforge.games.treasurequest.state;

import com.triforge.games.treasurequest.content.Checkpoint;

import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/** Per-player expedition progress: unlocked/cleared checkpoints and boss gate for treasure. */
public final class ExpeditionState {

    private final Set<String> unlocked = new HashSet<>();
    private final Set<String> cleared = new HashSet<>();
    private boolean bossCleared;
    private long accessLockUntilTick;

    private ExpeditionState() {
    }

    public static ExpeditionState start(String startCheckpointId) {
        Objects.requireNonNull(startCheckpointId, "startCheckpointId");
        ExpeditionState state = new ExpeditionState();
        state.unlocked.add(startCheckpointId);
        return state;
    }

    public void onCheckpointPassed(Checkpoint checkpoint) {
        Objects.requireNonNull(checkpoint, "checkpoint");
        cleared.add(checkpoint.id());
        unlocked.addAll(checkpoint.next());
        if (checkpoint.boss()) {
            bossCleared = true;
        }
    }

    public boolean isUnlocked(String checkpointId) {
        return unlocked.contains(checkpointId);
    }

    public boolean isCleared(String checkpointId) {
        return cleared.contains(checkpointId);
    }

    public boolean canAttempt(String checkpointId) {
        return isUnlocked(checkpointId) && !isCleared(checkpointId);
    }

    public boolean canAttempt(String checkpointId, Checkpoint checkpoint, long tick) {
        if (!canAttempt(checkpointId)) {
            return false;
        }
        return !accessLocked(tick) || !checkpoint.boss();
    }

    public boolean bossCleared() {
        return bossCleared;
    }

    public boolean treasureAccessible() {
        return bossCleared;
    }

    public boolean treasureAccessible(long tick) {
        return bossCleared && !accessLocked(tick);
    }

    public boolean accessLocked(long tick) {
        return accessLockUntilTick > 0 && tick <= accessLockUntilTick;
    }

    public void grantAccessLockUntil(long untilTick) {
        if (untilTick <= 0) {
            accessLockUntilTick = 0;
            return;
        }
        accessLockUntilTick = Math.max(accessLockUntilTick, untilTick);
    }

    public void refreshAccessLock(long tick) {
        if (accessLockUntilTick > 0 && tick > accessLockUntilTick) {
            accessLockUntilTick = 0;
        }
    }

    long accessLockUntilTick() {
        return accessLockUntilTick;
    }

    public Set<String> unlockedTargets() {
        Set<String> targets = new HashSet<>();
        for (String checkpointId : unlocked) {
            if (!cleared.contains(checkpointId)) {
                targets.add(checkpointId);
            }
        }
        return Collections.unmodifiableSet(targets);
    }
}
