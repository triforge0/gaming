package com.triforge.games.f1racing.ai;

import com.triforge.games.f1racing.physics.VehicleInput;
import com.triforge.games.f1racing.physics.VehicleState;
import com.triforge.games.f1racing.track.TrackSpline;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/** Centerline-following bot driver with corner braking and per-bot pace noise. */
public final class BotDriverAI {

    private static final float LOOK_AHEAD_BASE = 14f;
    private static final float LOOK_AHEAD_SPEED_FACTOR = 0.32f;
    private static final float MAX_SPEED = 85f;

    private final TrackSpline spline;
    private final float halfWidth;
    private final Map<Long, BotProfile> profiles = new HashMap<>();

    public BotDriverAI(TrackSpline spline, float trackWidth) {
        this.spline = spline;
        this.halfWidth = Math.max(1f, trackWidth * 0.5f);
    }

    public void reset() {
        profiles.clear();
    }

    public VehicleInput compute(long botId, VehicleState state) {
        BotProfile profile = profiles.computeIfAbsent(botId, BotProfile::fromId);
        profile.tickNoise();

        TrackSpline.Projection projection = spline.project(state.x(), state.y());
        float along = spline.normalizeAlong(projection.alongDistance());
        float lookAhead = LOOK_AHEAD_BASE + state.speed() * LOOK_AHEAD_SPEED_FACTOR;

        float curvature = estimateCurvature(along, 10f);
        float targetSpeed = MAX_SPEED * (1f - Math.min(0.72f, curvature * 2.8f)) * profile.pace();
        targetSpeed = Math.max(18f, targetSpeed);

        float targetHeading = spline.headingAt(along + lookAhead);
        float headingError = angleDiff(state.yaw(), targetHeading);
        float lateralNorm = projection.lateralDistance() / halfWidth;
        float grip = state.gripFactor();
        float steer = clamp(
                headingError * 2.4f * grip - lateralNorm * 0.85f + profile.lateralNoise(),
                -1f,
                1f);

        float speed = state.speed();
        float throttle = 0f;
        float brake = 0f;
        if (speed > targetSpeed + 2.5f) {
            brake = clamp((speed - targetSpeed) / 28f, 0.15f, 1f);
        } else {
            throttle = profile.pace() * clamp(0.45f + (targetSpeed - speed) / 35f, 0.35f, 1f);
        }

        if (Math.abs(lateralNorm) > 0.75f) {
            throttle *= 0.55f;
            brake = Math.max(brake, 0.35f);
            steer = clamp(steer - lateralNorm * 0.5f, -1f, 1f);
        }

        if (grip < 0.9f) {
            throttle *= 0.5f;
            brake = Math.max(brake, 0.25f);
        }

        boolean nitro = curvature < 0.07f
                && speed > 30f
                && state.nitro() > 0.35f
                && throttle > 0.75f
                && profile.consumeNitroWindow(curvature);

        return new VehicleInput(steer, throttle, brake, false, nitro, false);
    }

    private float estimateCurvature(float along, float sampleDistance) {
        float h0 = spline.headingAt(along);
        float h1 = spline.headingAt(along + sampleDistance);
        float h2 = spline.headingAt(along + sampleDistance * 2f);
        return (Math.abs(angleDiff(h0, h1)) + Math.abs(angleDiff(h1, h2))) * 0.5f;
    }

    private static float angleDiff(float from, float to) {
        return normalizeAngle(to - from);
    }

    private static float normalizeAngle(float radians) {
        float angle = radians;
        while (angle > Math.PI) {
            angle -= (float) (2 * Math.PI);
        }
        while (angle < -Math.PI) {
            angle += (float) (2 * Math.PI);
        }
        return angle;
    }

    private static float clamp(float value, float min, float max) {
        return Math.max(min, Math.min(max, value));
    }

    private static final class BotProfile {
        private final float pace;
        private final float noiseAmplitude;
        private float noisePhase;
        private int straightTicks;

        private BotProfile(float pace, float noiseAmplitude) {
            this.pace = pace;
            this.noiseAmplitude = noiseAmplitude;
        }

        static BotProfile fromId(long botId) {
            Random random = new Random(botId);
            float pace = 0.9f + random.nextFloat() * 0.08f;
            float noise = (random.nextFloat() - 0.5f) * 0.12f;
            return new BotProfile(pace, noise);
        }

        float pace() {
            return pace;
        }

        float lateralNoise() {
            return (float) Math.sin(noisePhase) * noiseAmplitude;
        }

        void tickNoise() {
            noisePhase += 0.035f;
        }

        boolean consumeNitroWindow(float curvature) {
            if (curvature >= 0.07f) {
                straightTicks = 0;
                return false;
            }
            straightTicks++;
            return straightTicks > 90 && straightTicks % 150 < 25;
        }
    }
}
