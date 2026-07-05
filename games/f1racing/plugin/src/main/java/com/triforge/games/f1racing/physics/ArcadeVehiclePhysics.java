package com.triforge.games.f1racing.physics;

import com.triforge.games.f1racing.track.TrackDefinition;
import com.triforge.games.f1racing.track.TrackSpline;
import com.triforge.protocol.proto.F1CollisionMode;

/** Deterministic arcade integrator constrained to a track centerline. */
public final class ArcadeVehiclePhysics {

    public static final float TICK_DT = 1f / 60f;
    private static final float MAX_SPEED = 85f;
    private static final float ACCEL = 42f;
    private static final float BRAKE = 65f;
    private static final float DRAG = 0.985f;
    private static final float STEER_RATE = 2.4f;
    private static final float OFF_TRACK_PENALTY = 0.92f;
    private static final float NITRO_BOOST = 1.35f;
    private static final float NITRO_DRAIN = 0.004f;

    private final TrackSpline spline;
    private final float halfWidth;

    public ArcadeVehiclePhysics(TrackDefinition track) {
        this.spline = new TrackSpline(track.centerline());
        this.halfWidth = track.trackWidth() * 0.5f;
    }

    public TrackSpline spline() {
        return spline;
    }

    public void tick(VehicleState state, VehicleInput input, F1CollisionMode carCollisionMode) {
        state.tickControlLoss();
        float grip = state.gripFactor();

        if (input.resetCar()) {
            resetToTrack(state);
            return;
        }

        float throttle = input.throttle();
        float brake = input.brake();
        float speed = state.speed();

        speed += throttle * ACCEL * TICK_DT;
        speed -= brake * BRAKE * TICK_DT;
        if (input.handbrake()) {
            speed *= 0.94f;
        }
        if (throttle < 0.05f && brake < 0.05f) {
            speed *= DRAG;
        }
        if (input.nitro() && state.nitro() > 0.01f) {
            speed *= NITRO_BOOST;
            state.setNitro(state.nitro() - NITRO_DRAIN);
        } else if (state.nitro() < 1f) {
            state.setNitro(Math.min(1f, state.nitro() + NITRO_DRAIN * 0.25f));
        }
        speed = Math.min(MAX_SPEED, Math.max(0f, speed));

        // Steering authority is high at low speed and tapers off as speed rises, so the car is
        // agile in hairpins and stable on straights. A move gate keeps a near-stationary car from
        // pivoting on the spot (you still need to be rolling to turn).
        float speedT = speed / MAX_SPEED;
        float turnAuthority = 1.25f - 0.7f * speedT;
        float moveGate = Math.min(1f, speed / 8f);
        float yaw = state.yaw() + input.steer() * STEER_RATE * grip * TICK_DT * turnAuthority * moveGate;
        state.setYaw(yaw);

        float nx = (float) Math.cos(yaw);
        float ny = (float) Math.sin(yaw);
        float x = state.x() + nx * speed * TICK_DT;
        float y = state.y() + ny * speed * TICK_DT;

        TrackSpline.Projection projection = spline.project(x, y);
        float lateral = projection.lateralDistance();
        if (Math.abs(lateral) > halfWidth) {
            float clampedLateral = Math.copySign(halfWidth, lateral);
            float px = projection.centerX() + (float) (-Math.sin(projection.heading())) * clampedLateral;
            float py = projection.centerY() + (float) Math.cos(projection.heading()) * clampedLateral;
            x = px;
            y = py;
            speed *= OFF_TRACK_PENALTY;
        }

        state.setPosition(x, y, state.z());
        state.setSpeed(speed);
        updateGearAndRpm(state, speed);
    }

    public void resetToTrack(VehicleState state) {
        TrackSpline.Projection projection = spline.project(state.x(), state.y());
        float lateral = Math.copySign(Math.min(Math.abs(projection.lateralDistance()), halfWidth - 0.5f),
                projection.lateralDistance());
        float px = projection.centerX() + (float) (-Math.sin(projection.heading())) * lateral;
        float py = projection.centerY() + (float) Math.cos(projection.heading()) * lateral;
        state.setPosition(px, py, state.z());
        state.setYaw(projection.heading());
        state.setSpeed(Math.min(state.speed(), 25f));
    }

    private static void updateGearAndRpm(VehicleState state, float speed) {
        int gear = speed < 12f ? 1 : speed < 25f ? 2 : speed < 40f ? 3 : speed < 55f ? 4 : speed < 68f ? 5 : 6;
        state.setGear(gear);
        state.setRpm(1200f + speed * 90f);
    }

    /** Car–car push + brief control loss when collision mode is ON. */
    public static void resolveCarCarCollision(
            VehicleState a,
            VehicleState b,
            F1CollisionMode mode
    ) {
        if (mode == F1CollisionMode.F1_COLLISION_OFF) {
            return;
        }
        float dx = b.x() - a.x();
        float dy = b.y() - a.y();
        float distSq = dx * dx + dy * dy;
        float minDist = VehicleState.HULL_RADIUS * 2f;
        if (distSq >= minDist * minDist || distSq < 1e-6f) {
            return;
        }
        float dist = (float) Math.sqrt(distSq);
        float overlap = minDist - dist;
        float nx = dx / dist;
        float ny = dy / dist;
        float push = overlap * 0.5f + 0.05f;
        a.setPosition(a.x() - nx * push, a.y() - ny * push, a.z());
        b.setPosition(b.x() + nx * push, b.y() + ny * push, b.z());
        a.setSpeed(a.speed() * 0.92f);
        b.setSpeed(b.speed() * 0.92f);
        int lossTicks = (int) (30 + overlap * 20);
        a.applyControlLoss(lossTicks);
        b.applyControlLoss(lossTicks);
        float perturb = overlap * 0.08f;
        a.setYaw(a.yaw() + perturb);
        b.setYaw(b.yaw() - perturb);
    }
}
