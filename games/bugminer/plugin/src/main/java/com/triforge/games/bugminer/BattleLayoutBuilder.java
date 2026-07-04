package com.triforge.games.bugminer;

import java.util.List;

/** Builds a shared battle layout (deterministic grid from room seed). */
final class BattleLayoutBuilder {
    private BattleLayoutBuilder() {}

    static List<PlacedItem> build(String levelId, String roomSeed) {
        ChallengeInstance temp = new ChallengeInstance(1, 2, levelId);
        long seed = roomSeed == null ? 0L : roomSeed.hashCode();
        temp.autoArrangeSeeded(1, seed);
        return temp.copyItemsLayout();
    }
}
