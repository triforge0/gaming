package com.triforge.games.bugminer;

import java.util.List;

/** Builds one shared fair-mode layout (deterministic seed from room + level). */
final class FairLayoutBuilder {
    private FairLayoutBuilder() {}

    static List<PlacedItem> build(String levelId, String roomSeed) {
        String seedBase = roomSeed == null ? "" : roomSeed;
        for (int attempt = 0; attempt < 16; attempt++) {
            long seed = ("fair:" + seedBase + ":" + levelId + ":" + attempt).hashCode();
            ChallengeInstance temp = new ChallengeInstance(1, 2, levelId);
            if (!temp.autoArrangeSeeded(1, seed)) continue;
            List<PlacedItem> layout = temp.copyItemsLayout();
            if (allPlaced(layout)) return layout;
        }
        throw new IllegalStateException("Cannot build fair layout for level " + levelId);
    }

    private static boolean allPlaced(List<PlacedItem> layout) {
        if (layout.isEmpty()) return false;
        for (PlacedItem item : layout) {
            if (item.x == 0f && item.y == 0f) return false;
        }
        return true;
    }
}
