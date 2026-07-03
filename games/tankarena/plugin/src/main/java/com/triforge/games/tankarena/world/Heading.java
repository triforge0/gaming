package com.triforge.games.tankarena.world;

import com.triforge.protocol.proto.Direction;

/**
 * Converts between the 3D hull yaw (radians) and the legacy 4-way {@link Direction}.
 *
 * <p>Yaw convention (ground plane is XY, y increases "down" as in the 2D world):
 * <ul>
 *   <li>{@code 0}      → +X (RIGHT)</li>
 *   <li>{@code +π/2}   → +Y (DOWN)</li>
 *   <li>{@code ±π}     → -X (LEFT)</li>
 *   <li>{@code -π/2}   → -Y (UP)</li>
 * </ul>
 * so a hull moving forward advances by {@code (cos yaw, sin yaw)}.
 */
public final class Heading {
    private static final float HALF_PI = (float) (Math.PI / 2.0);
    private static final float QUARTER_PI = (float) (Math.PI / 4.0);

    private Heading() {
    }

    /** Yaw pointing along a cardinal direction. */
    public static float yawForDirection(Direction direction) {
        return switch (direction) {
            case RIGHT -> 0f;
            case DOWN -> HALF_PI;
            case LEFT -> (float) Math.PI;
            case UP -> -HALF_PI;
            default -> 0f;
        };
    }

    /** Nearest cardinal direction for a hull yaw — used to fill the legacy DirectionComponent. */
    public static Direction nearestCardinal(float yaw) {
        // Normalize into (-π, π].
        double y = yaw;
        if (y <= -Math.PI) {
            y += 2 * Math.PI;
        } else if (y > Math.PI) {
            y -= 2 * Math.PI;
        }
        if (y >= -QUARTER_PI && y < QUARTER_PI) {
            return Direction.RIGHT;
        }
        if (y >= QUARTER_PI && y < 3 * QUARTER_PI) {
            return Direction.DOWN;
        }
        if (y >= -3 * QUARTER_PI && y < -QUARTER_PI) {
            return Direction.UP;
        }
        return Direction.LEFT;
    }
}
