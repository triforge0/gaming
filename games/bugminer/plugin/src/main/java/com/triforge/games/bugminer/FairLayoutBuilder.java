package com.triforge.games.bugminer;

import java.util.List;

/** Builds one shared fair-mode layout (deterministic seed from room + level). */
final class FairLayoutBuilder {
    private FairLayoutBuilder() {}

    static List<PlacedItem> build(String levelId, String roomSeed) {
        return MapLayoutEngine.buildFairLayout(levelId, roomSeed);
    }
}
