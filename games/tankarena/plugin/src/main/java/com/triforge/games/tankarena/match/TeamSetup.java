package com.triforge.games.tankarena.match;

import java.util.Objects;

/** Captain-chosen spawn and HQ corners for one playable team. */
public record TeamSetup(
        Team team,
        long captainPlayerId,
        SpawnRegion spawnRegion,
        SpawnRegion hqRegion
) {
    public TeamSetup {
        Objects.requireNonNull(team, "team");
        spawnRegion = Objects.requireNonNullElse(spawnRegion, SpawnRegion.UNSPECIFIED);
        hqRegion = Objects.requireNonNullElse(hqRegion, SpawnRegion.UNSPECIFIED);
        if (!team.isPlayable()) {
            throw new IllegalArgumentException("Team setup requires RED or BLUE");
        }
    }

    public boolean isComplete() {
        return spawnRegion.isChosen() && hqRegion.isChosen();
    }
}
