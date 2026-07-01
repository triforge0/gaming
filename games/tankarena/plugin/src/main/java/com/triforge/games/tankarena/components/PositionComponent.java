package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

public final class PositionComponent implements Component {
    private float x;
    private float y;
    private float previousX;
    private float previousY;

    public PositionComponent(float x, float y) {
        this.x = x;
        this.y = y;
        this.previousX = x;
        this.previousY = y;
    }

    public float x() {
        return x;
    }

    public float y() {
        return y;
    }

    public void savePrevious() {
        previousX = x;
        previousY = y;
    }

    public void revertToPrevious() {
        x = previousX;
        y = previousY;
    }

    public void set(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public void add(float dx, float dy) {
        this.x += dx;
        this.y += dy;
    }
}
