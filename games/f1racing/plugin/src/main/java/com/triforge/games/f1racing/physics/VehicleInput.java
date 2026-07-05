package com.triforge.games.f1racing.physics;

/** Last authoritative driver input (normalized). */
public record VehicleInput(
        float steer,
        float throttle,
        float brake,
        boolean handbrake,
        boolean nitro,
        boolean resetCar
) {
    public static final VehicleInput NEUTRAL = new VehicleInput(0f, 0f, 0f, false, false, false);

    public VehicleInput {
        steer = clamp(steer, -1f, 1f);
        throttle = clamp(throttle, 0f, 1f);
        brake = clamp(brake, 0f, 1f);
    }

    private static float clamp(float value, float min, float max) {
        return Math.max(min, Math.min(max, value));
    }
}
