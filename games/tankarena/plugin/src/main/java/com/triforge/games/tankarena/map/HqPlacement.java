package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;

/** Maps a corner choice to a 2×2 HQ footprint on the arena (was 1×1). */
public final class HqPlacement {
    private static final int HQ_WIDTH = 2;
    private static final int HQ_HEIGHT = 2;

    private HqPlacement() {
    }

    public static HeadquartersDefinition forCorner(GameMap map, Team team, SpawnRegion corner) {
        if (!corner.isChosen()) {
            throw new IllegalArgumentException("HQ corner must be chosen");
        }
        int width = map.width();
        int height = map.height();
        return switch (corner) {
            case TOP_LEFT -> HeadquartersDefinition.rect(team, 2, 1, HQ_WIDTH, HQ_HEIGHT);
            case BOTTOM_LEFT -> HeadquartersDefinition.rect(team, 2, height - 1 - HQ_HEIGHT, HQ_WIDTH, HQ_HEIGHT);
            case TOP_RIGHT -> HeadquartersDefinition.rect(team, width - 2 - HQ_WIDTH, 1, HQ_WIDTH, HQ_HEIGHT);
            case BOTTOM_RIGHT -> HeadquartersDefinition.rect(team, width - 2 - HQ_WIDTH, height - 1 - HQ_HEIGHT, HQ_WIDTH, HQ_HEIGHT);
            case UNSPECIFIED -> throw new IllegalArgumentException("HQ corner must be chosen");
        };
    }
}
