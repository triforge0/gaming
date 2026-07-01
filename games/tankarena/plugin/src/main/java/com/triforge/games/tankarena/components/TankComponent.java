package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

public final class TankComponent implements Component {
    public static final float DEFAULT_SPEED = 120f;
    public static final long DEFAULT_SHOOT_COOLDOWN_TICKS = 20L;

    private final float speed;
    private final long shootCooldownTicks;
    private long cooldownRemainingTicks;

    public TankComponent(float speed, long shootCooldownTicks) {
        this.speed = speed;
        this.shootCooldownTicks = shootCooldownTicks;
    }

    public TankComponent() {
        this(DEFAULT_SPEED, DEFAULT_SHOOT_COOLDOWN_TICKS);
    }

    public float speed() {
        return speed;
    }

    public long shootCooldownTicks() {
        return shootCooldownTicks;
    }

    public long cooldownRemainingTicks() {
        return cooldownRemainingTicks;
    }

    public boolean canShoot() {
        return cooldownRemainingTicks <= 0;
    }

    public void startCooldown() {
        cooldownRemainingTicks = shootCooldownTicks;
    }

    public void tickCooldown() {
        if (cooldownRemainingTicks > 0) {
            cooldownRemainingTicks--;
        }
    }
}
