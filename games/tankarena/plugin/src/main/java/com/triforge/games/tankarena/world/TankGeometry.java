package com.triforge.games.tankarena.world;

import com.triforge.protocol.proto.Direction;

public final class TankGeometry {
    public static final float MUZZLE_OFFSET = 21f;

    private TankGeometry() {
    }

    public static float[] muzzlePosition(float x, float y, Direction direction) {
        return switch (direction) {
            case UP -> new float[]{x, y - MUZZLE_OFFSET};
            case DOWN -> new float[]{x, y + MUZZLE_OFFSET};
            case LEFT -> new float[]{x - MUZZLE_OFFSET, y};
            case RIGHT -> new float[]{x + MUZZLE_OFFSET, y};
            default -> new float[]{x, y};
        };
    }

    public static float[] directionVector(Direction direction) {
        return switch (direction) {
            case UP -> new float[]{0f, -1f};
            case DOWN -> new float[]{0f, 1f};
            case LEFT -> new float[]{-1f, 0f};
            case RIGHT -> new float[]{1f, 0f};
            default -> new float[]{0f, -1f};
        };
    }
}
