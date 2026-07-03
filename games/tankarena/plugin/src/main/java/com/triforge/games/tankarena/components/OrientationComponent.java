package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

/**
 * 3D orientation: hull heading ({@code yaw}) and turret elevation ({@code pitch}),
 * in radians. The server is authoritative: it accumulates yaw/pitch from keyboard
 * rotation intent (see MovementSystem). Yaw is normalized to (-π, π]; pitch is clamped
 * to a fixed elevation range so the turret cannot flip over.
 */
public final class OrientationComponent implements Component {
    public static final float MAX_PITCH = (float) Math.toRadians(60.0);
    public static final float MIN_PITCH = (float) Math.toRadians(-20.0);

    private static final float TWO_PI = (float) (Math.PI * 2.0);

    private float yaw;
    private float pitch;

    public OrientationComponent() {
        this(0f, 0f);
    }

    public OrientationComponent(float yaw, float pitch) {
        this.yaw = normalizeYaw(yaw);
        this.pitch = clampPitch(pitch);
    }

    public float yaw() {
        return yaw;
    }

    public float pitch() {
        return pitch;
    }

    public void setYaw(float yaw) {
        this.yaw = normalizeYaw(yaw);
    }

    public void setPitch(float pitch) {
        this.pitch = clampPitch(pitch);
    }

    /** Rotates the hull heading by {@code delta} radians (positive = right/clockwise). */
    public void rotateYaw(float delta) {
        this.yaw = normalizeYaw(this.yaw + delta);
    }

    /** Adjusts turret pitch by {@code delta} radians, clamped to the elevation range. */
    public void adjustPitch(float delta) {
        this.pitch = clampPitch(this.pitch + delta);
    }

    private static float normalizeYaw(float value) {
        float y = value % TWO_PI;
        if (y <= -Math.PI) {
            y += TWO_PI;
        } else if (y > Math.PI) {
            y -= TWO_PI;
        }
        return y;
    }

    private static float clampPitch(float value) {
        if (value < MIN_PITCH) {
            return MIN_PITCH;
        }
        if (value > MAX_PITCH) {
            return MAX_PITCH;
        }
        return value;
    }
}
