package com.triforge.games.tankarena.map;

public record MapConfig(
        boolean coverBlocksMovement,
        float visionRadiusWorld,
        float coverRevealRadiusWorld,
        float defaultFovDegrees
) {
    public static final MapConfig DEFAULT = new MapConfig(
            false,
            220f,
            64f,
            360f
    );

    public int visionRadiusTiles(int tileSize) {
        return Math.max(1, (int) Math.ceil(visionRadiusWorld / tileSize));
    }

    public int coverRevealRadiusTiles(int tileSize) {
        return Math.max(1, (int) Math.ceil(coverRevealRadiusWorld / tileSize));
    }
}
