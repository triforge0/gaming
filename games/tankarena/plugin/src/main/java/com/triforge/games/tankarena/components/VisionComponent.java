package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

public final class VisionComponent implements Component {
    private final float radiusWorld;
    private final float fovDegrees;
    private final int radiusTiles;

    public VisionComponent(float radiusWorld, float fovDegrees, int radiusTiles) {
        this.radiusWorld = radiusWorld;
        this.fovDegrees = fovDegrees;
        this.radiusTiles = radiusTiles;
    }

    public float radiusWorld() {
        return radiusWorld;
    }

    public float fovDegrees() {
        return fovDegrees;
    }

    public int radiusTiles() {
        return radiusTiles;
    }
}
