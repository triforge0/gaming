package com.triforge.games.f1racing.race;

import com.triforge.games.f1racing.track.CheckpointDefinition;
import com.triforge.games.f1racing.track.TrackDefinition;

/** Detects ordered checkpoint crossings for lap counting. */
public final class CheckpointDetector {

    private final TrackDefinition track;

    public CheckpointDetector(TrackDefinition track) {
        this.track = track;
    }

    public boolean insideCheckpoint(float x, float y, CheckpointDefinition checkpoint) {
        float dx = x - checkpoint.x();
        float dy = y - checkpoint.y();
        float radius = checkpoint.radius();
        return dx * dx + dy * dy <= radius * radius;
    }

    public int tryAdvance(int expectedNext, float x, float y) {
        if (expectedNext < 0 || expectedNext >= track.checkpoints().size()) {
            return expectedNext;
        }
        CheckpointDefinition cp = track.checkpoints().get(expectedNext);
        if (insideCheckpoint(x, y, cp)) {
            return expectedNext + 1;
        }
        return expectedNext;
    }
}
