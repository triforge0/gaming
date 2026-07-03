package com.triforge.games.treasurequest.content;

import java.util.List;
import java.util.Objects;

/**
 * A checkpoint node on the map: a zone the avatar walks into to open {@code quizId}. On pass it
 * reveals hints for its {@code next} successors (branching graph). {@code boss} flags the final gate.
 */
public record Checkpoint(
        String id,
        Rect zone,
        String quizId,
        List<String> next,
        boolean boss,
        CheckpointRisk risk,
        String hint,
        Reward reward
) {

    public Checkpoint {
        id = Objects.requireNonNull(id, "id");
        zone = Objects.requireNonNull(zone, "zone");
        quizId = Objects.requireNonNull(quizId, "quizId");
        next = next == null ? List.of() : List.copyOf(next);
        risk = risk == null ? CheckpointRisk.NORMAL : risk;
        hint = hint == null ? "" : hint;
        reward = reward == null ? Reward.NONE : reward;
    }

    public boolean isTerminal() {
        return next.isEmpty();
    }
}
