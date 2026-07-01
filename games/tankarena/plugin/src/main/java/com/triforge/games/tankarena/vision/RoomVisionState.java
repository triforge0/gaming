package com.triforge.games.tankarena.vision;

import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.VisibilityMap;

import java.util.HashMap;
import java.util.Map;

public final class RoomVisionState {
    private final GameMap map;
    private final Map<Long, VisibilityMap> playerVisibility = new HashMap<>();

    public RoomVisionState(GameMap map) {
        this.map = map;
    }

    public VisibilityMap visibilityFor(long playerId) {
        return playerVisibility.computeIfAbsent(
                playerId,
                ignored -> new VisibilityMap(map.width(), map.height())
        );
    }

    public VisibilityMap visibilityOrNull(long playerId) {
        return playerVisibility.get(playerId);
    }

    public void removePlayer(long playerId) {
        playerVisibility.remove(playerId);
    }

    public void clear() {
        playerVisibility.clear();
    }
}
