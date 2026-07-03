package com.triforge.games.treasurequest.world;

import com.triforge.games.treasurequest.content.QuestMap;

/** Playable world rectangle in world pixels; dimensions follow the loaded map. */
public record WorldBounds(float width, float height) {
    public static final float AVATAR_HALF_SIZE = 14f;

    public WorldBounds {
        if (width <= 0f || height <= 0f) {
            throw new IllegalArgumentException("World bounds must be positive: " + width + "x" + height);
        }
    }

    public static WorldBounds fromMap(QuestMap map) {
        return new WorldBounds(map.worldWidth(), map.worldHeight());
    }

    /** True when the avatar's axis-aligned hitbox is fully inside the world. */
    public boolean isAvatarInside(float centerX, float centerY) {
        return centerX - AVATAR_HALF_SIZE >= 0f
                && centerX + AVATAR_HALF_SIZE <= width
                && centerY - AVATAR_HALF_SIZE >= 0f
                && centerY + AVATAR_HALF_SIZE <= height;
    }
}
