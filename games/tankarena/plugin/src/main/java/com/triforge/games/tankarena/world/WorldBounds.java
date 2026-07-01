package com.triforge.games.tankarena.world;

import com.triforge.games.tankarena.map.GameMap;

/** Playable world rectangle in world pixels; dimensions follow the loaded map. */
public record WorldBounds(float width, float height) {
    public static final float TANK_HALF_SIZE = 14f;

    public WorldBounds {
        if (width <= 0f || height <= 0f) {
            throw new IllegalArgumentException("World bounds must be positive: " + width + "x" + height);
        }
    }

    public static WorldBounds fromMap(GameMap map) {
        return new WorldBounds(map.worldWidth(), map.worldHeight());
    }

    public float clampX(float x) {
        return Math.clamp(x, TANK_HALF_SIZE, width - TANK_HALF_SIZE);
    }

    public float clampY(float y) {
        return Math.clamp(y, TANK_HALF_SIZE, height - TANK_HALF_SIZE);
    }

    public boolean isInside(float x, float y) {
        return x >= 0f && x <= width && y >= 0f && y <= height;
    }

    /** True when the tank's axis-aligned hitbox is fully inside the world. */
    public boolean isTankInside(float centerX, float centerY) {
        return centerX - TANK_HALF_SIZE >= 0f
                && centerX + TANK_HALF_SIZE <= width
                && centerY - TANK_HALF_SIZE >= 0f
                && centerY + TANK_HALF_SIZE <= height;
    }
}
