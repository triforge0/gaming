package com.triforge.games.treasurequest.state;

import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.CheckpointRisk;
import com.triforge.games.treasurequest.content.Rect;
import com.triforge.games.treasurequest.content.Reward;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ExpeditionStateTest {

    @Test
    void startUnlocksOnlyStartCheckpoint() {
        ExpeditionState state = ExpeditionState.start("cp1");

        assertTrue(state.canAttempt("cp1"));
        assertFalse(state.isUnlocked("cp2a"));
        assertFalse(state.treasureAccessible());
    }

    @Test
    void passingCheckpointUnlocksSuccessors() {
        ExpeditionState state = ExpeditionState.start("cp1");
        Checkpoint cp1 = checkpoint("cp1", List.of("cp2a", "cp2b"));

        state.onCheckpointPassed(cp1);

        assertTrue(state.isCleared("cp1"));
        assertFalse(state.canAttempt("cp1"));
        assertTrue(state.canAttempt("cp2a"));
        assertTrue(state.canAttempt("cp2b"));
    }

    @Test
    void passingBossUnlocksTreasure() {
        ExpeditionState state = ExpeditionState.start("cp1");
        Checkpoint boss = checkpoint("boss", List.of());

        state.onCheckpointPassed(boss);

        assertTrue(state.bossCleared());
        assertTrue(state.treasureAccessible());
    }

    private static Checkpoint checkpoint(String id, List<String> next) {
        return new Checkpoint(
                id,
                new Rect(1, 1, 1, 1),
                "quiz",
                next,
                "boss".equals(id),
                CheckpointRisk.NORMAL,
                "hint",
                Reward.NONE);
    }
}
