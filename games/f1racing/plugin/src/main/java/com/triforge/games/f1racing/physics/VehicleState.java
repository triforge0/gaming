package com.triforge.games.f1racing.physics;

/** Authoritative car kinematics for one tick of simulation. */
public final class VehicleState {

    public static final float HULL_RADIUS = 2.2f;

    private float x;
    private float y;
    private float z;
    private float yaw;
    private float speed;
    private float nitro = 1f;
    private int controlLossTicks;
    private int gear = 1;
    private float rpm = 3000f;

    public VehicleState(float x, float y, float z, float yaw) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.yaw = yaw;
    }

    public float x() {
        return x;
    }

    public float y() {
        return y;
    }

    public float z() {
        return z;
    }

    public float yaw() {
        return yaw;
    }

    public float speed() {
        return speed;
    }

    public float nitro() {
        return nitro;
    }

    public int controlLossTicks() {
        return controlLossTicks;
    }

    public int gear() {
        return gear;
    }

    public float rpm() {
        return rpm;
    }

    public void setPosition(float x, float y, float z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public void setYaw(float yaw) {
        this.yaw = yaw;
    }

    public void setSpeed(float speed) {
        this.speed = Math.max(0f, speed);
    }

    public void setNitro(float nitro) {
        this.nitro = Math.max(0f, Math.min(1f, nitro));
    }

    public void setGear(int gear) {
        this.gear = Math.max(1, Math.min(8, gear));
    }

    public void setRpm(float rpm) {
        this.rpm = rpm;
    }

    public void applyControlLoss(int ticks) {
        controlLossTicks = Math.max(controlLossTicks, ticks);
    }

    public void tickControlLoss() {
        if (controlLossTicks > 0) {
            controlLossTicks--;
        }
    }

    public float gripFactor() {
        if (controlLossTicks <= 0) {
            return 1f;
        }
        return 0.35f;
    }
}
