package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;

/** Maps a corner choice to a 1×1 HQ tile rectangle on the arena. */
public final class HqPlacement {
    private HqPlacement() {
    }

    public static HeadquartersDefinition forCorner(GameMap map, Team team, SpawnRegion corner) {
        if (!corner.isChosen()) {
            throw new IllegalArgumentException("HQ corner must be chosen");
        }
        int width = map.width();
        int height = map.height();
        return switch (corner) {
            case TOP_LEFT -> HeadquartersDefinition.rect(team, 2, 1, 1, 1);
            case BOTTOM_LEFT -> HeadquartersDefinition.rect(team, 2, height - 2, 1, 1);
            case TOP_RIGHT -> HeadquartersDefinition.rect(team, width - 3, 1, 1, 1);
            case BOTTOM_RIGHT -> HeadquartersDefinition.rect(team, width - 3, height - 2, 1, 1);
            case UNSPECIFIED -> throw new IllegalArgumentException("HQ corner must be chosen");
        };
    }
}
