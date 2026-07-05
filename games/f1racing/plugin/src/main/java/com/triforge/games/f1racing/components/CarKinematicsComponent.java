package com.triforge.games.f1racing.components;

import com.triforge.engine.ecs.Component;

public final class CarKinematicsComponent implements Component {
    private float x;
    private float y;
    private float z;
    private float yaw;
    private float speed;
    private float nitro = 1f;
    private int gear = 1;
    private float rpm = 3000f;
    private int currentLap;
    private int racePosition = 1;

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

    public int gear() {
        return gear;
    }

    public float rpm() {
        return rpm;
    }

    public int currentLap() {
        return currentLap;
    }

    public int racePosition() {
        return racePosition;
    }

    public void syncFrom(com.triforge.games.f1racing.physics.VehicleState state) {
        x = state.x();
        y = state.y();
        z = state.z();
        yaw = state.yaw();
        speed = state.speed();
        nitro = state.nitro();
        gear = state.gear();
        rpm = state.rpm();
    }

    public void setCurrentLap(int currentLap) {
        this.currentLap = currentLap;
    }

    public void setRacePosition(int racePosition) {
        this.racePosition = racePosition;
    }
}
