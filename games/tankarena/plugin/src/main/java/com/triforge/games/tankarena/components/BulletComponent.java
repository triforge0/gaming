package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

public final class BulletComponent implements Component {
    public static final float DEFAULT_SPEED = 240f;
    public static final float DEFAULT_MAX_RANGE = 400f;

    private final long ownerEntityId;
    private final float speed;
    private final float directionX;
    private final float directionY;
    private final float directionZ;
    private final float maxRange;
    private float distanceTraveled;

    public BulletComponent(long ownerEntityId, float speed,
                           float directionX, float directionY, float directionZ, float maxRange) {
        this.ownerEntityId = ownerEntityId;
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;
        this.directionZ = directionZ;
        this.maxRange = maxRange;
    }

    /** 2D convenience (dz = 0) — kept for legacy call-sites and tests. */
    public BulletComponent(long ownerEntityId, float speed, float directionX, float directionY, float maxRange) {
        this(ownerEntityId, speed, directionX, directionY, 0f, maxRange);
    }

    public BulletComponent(long ownerEntityId, float directionX, float directionY) {
        this(ownerEntityId, DEFAULT_SPEED, directionX, directionY, 0f, DEFAULT_MAX_RANGE);
    }

    public long ownerEntityId() {
        return ownerEntityId;
    }

    public float speed() {
        return speed;
    }

    public float directionX() {
        return directionX;
    }

    public float directionY() {
        return directionY;
    }

    public float directionZ() {
        return directionZ;
    }

    public float maxRange() {
        return maxRange;
    }

    public float distanceTraveled() {
        return distanceTraveled;
    }

    public void addDistance(float distance) {
        distanceTraveled += distance;
    }

    public boolean exceededRange() {
        return distanceTraveled >= maxRange;
    }
}
