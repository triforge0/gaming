package com.triforge.engine.ecs.math;

/**
 * Immutable 3D vector. Generic engine math — no game knowledge.
 * Used for positions, velocities and directions in the 3D simulation.
 */
public record Vec3(float x, float y, float z) {

    public static final Vec3 ZERO = new Vec3(0f, 0f, 0f);

    public Vec3 add(Vec3 other) {
        return new Vec3(x + other.x, y + other.y, z + other.z);
    }

    public Vec3 add(float dx, float dy, float dz) {
        return new Vec3(x + dx, y + dy, z + dz);
    }

    public Vec3 sub(Vec3 other) {
        return new Vec3(x - other.x, y - other.y, z - other.z);
    }

    public Vec3 scale(float factor) {
        return new Vec3(x * factor, y * factor, z * factor);
    }

    public float dot(Vec3 other) {
        return x * other.x + y * other.y + z * other.z;
    }

    public float lengthSquared() {
        return x * x + y * y + z * z;
    }

    public float length() {
        return (float) Math.sqrt(lengthSquared());
    }

    /** Returns a unit-length copy, or {@link #ZERO} when this vector has no length. */
    public Vec3 normalized() {
        float len = length();
        if (len <= 1e-6f) {
            return ZERO;
        }
        return scale(1f / len);
    }

    /**
     * Ground-plane distance ignoring elevation. Server convention is z = elevation,
     * so the ground plane is XY (the frontend re-maps to Three.js Y-up at render time).
     */
    public float groundDistanceTo(Vec3 other) {
        float dx = x - other.x;
        float dy = y - other.y;
        return (float) Math.sqrt(dx * dx + dy * dy);
    }
}
