package com.triforge.games.bugminer;

import java.util.List;

/** Builds a shared battle layout (deterministic grid from room seed). */
final class BattleLayoutBuilder {
    private BattleLayoutBuilder() {}

    static List<PlacedItem> build(String levelId, String roomSeed) {
        return MapLayoutEngine.buildBattleLayout(levelId, roomSeed);
    }
}
