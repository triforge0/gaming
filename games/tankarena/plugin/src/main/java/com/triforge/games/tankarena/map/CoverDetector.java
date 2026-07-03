package com.triforge.games.tankarena.map;

public final class CoverDetector {
    private CoverDetector() {
    }

    public static boolean isOnCoverTile(GameMap map, int tileX, int tileY) {
        return map.tileAt(tileX, tileY).providesCover();
    }

    public static boolean isWithinRevealRange(
            float viewerX,
            float viewerY,
            float targetX,
            float targetY,
            MapConfig config
    ) {
        float dx = targetX - viewerX;
        float dy = targetY - viewerY;
        return dx * dx + dy * dy <= config.coverRevealRadiusWorld() * config.coverRevealRadiusWorld();
    }

    public static boolean isEntityHiddenByCover(
            VisibilityMap viewerFog,
            GameMap map,
            MapConfig config,
            float viewerX,
            float viewerY,
            float targetX,
            float targetY
    ) {
        int targetTileX = map.worldToTileX(targetX);
        int targetTileY = map.worldToTileY(targetY);

        if (viewerFog.isVisible(targetTileX, targetTileY)) {
            if (!isOnCoverTile(map, targetTileX, targetTileY)) {
                return false;
            }
            return !isWithinRevealRange(viewerX, viewerY, targetX, targetY, config);
        }

        if (isWithinRevealRange(viewerX, viewerY, targetX, targetY, config)) {
            return !LineOfSight.hasWorldLineOfSight(map, viewerX, viewerY, targetX, targetY);
        }
        return true;
    }
}
