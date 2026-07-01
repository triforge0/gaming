package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

public final class BulletComponent implements Component {
    public static final float DEFAULT_SPEED = 240f;
    public static final float DEFAULT_MAX_RANGE = 400f;

    private final long ownerEntityId;
    private final float speed;
    private final float directionX;
    private final float directionY;
    private final float maxRange;
    private float distanceTraveled;

    public BulletComponent(long ownerEntityId, float speed, float directionX, float directionY, float maxRange) {
        this.ownerEntityId = ownerEntityId;
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;
        this.maxRange = maxRange;
    }

    public BulletComponent(long ownerEntityId, float directionX, float directionY) {
        this(ownerEntityId, DEFAULT_SPEED, directionX, directionY, DEFAULT_MAX_RANGE);
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
