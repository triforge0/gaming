package com.triforge.games.tankarena.world;

import com.triforge.protocol.proto.Direction;

public final class TankGeometry {
    public static final float MUZZLE_OFFSET = 21f;
    /** Height of the turret muzzle above the tank's ground contact point. */
    public static final float TURRET_HEIGHT = WorldBounds.TANK_HALF_SIZE;

    private TankGeometry() {
    }

    /**
     * Unit fire direction from hull yaw + turret pitch (server convention: z = up).
     * Straight-line: horizontal magnitude is {@code cos(pitch)}, vertical is {@code sin(pitch)}.
     */
    public static float[] directionVector3D(float yaw, float pitch) {
        float cosPitch = (float) Math.cos(pitch);
        return new float[]{
                (float) Math.cos(yaw) * cosPitch,
                (float) Math.sin(yaw) * cosPitch,
                (float) Math.sin(pitch)
        };
    }

    /** Muzzle world position (x, y, z) for a tank at {@code (x,y,z)} aiming yaw/pitch. */
    public static float[] muzzlePosition3D(float x, float y, float z, float yaw, float pitch) {
        float[] dir = directionVector3D(yaw, pitch);
        return new float[]{
                x + dir[0] * MUZZLE_OFFSET,
                y + dir[1] * MUZZLE_OFFSET,
                z + TURRET_HEIGHT + dir[2] * MUZZLE_OFFSET
        };
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
