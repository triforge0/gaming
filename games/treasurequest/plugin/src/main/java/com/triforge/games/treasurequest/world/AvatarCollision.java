package com.triforge.games.treasurequest.world;

import com.triforge.games.treasurequest.content.QuestMap;

public final class AvatarCollision {

    private AvatarCollision() {
    }

    public static boolean avatarOverlapsSolidTile(QuestMap map, float centerX, float centerY) {
        float half = WorldBounds.AVATAR_HALF_SIZE;
        int minTileX = map.worldToTileX(centerX - half);
        int maxTileX = map.worldToTileX(centerX + half);
        int minTileY = map.worldToTileY(centerY - half);
        int maxTileY = map.worldToTileY(centerY + half);

        for (int tileY = minTileY; tileY <= maxTileY; tileY++) {
            for (int tileX = minTileX; tileX <= maxTileX; tileX++) {
                if (map.tileAt(tileX, tileY).blocksMovement()) {
                    return true;
                }
            }
        }
        return false;
    }
}
