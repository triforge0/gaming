package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;
import com.triforge.engine.ecs.math.Vec3;

/**
 * World position. Convention: {@code x,y} is the ground plane, {@code z} is elevation.
 * The legacy 2-arg constructor and {@code set(x,y)} / {@code add(dx,dy)} keep {@code z}
 * untouched so 2D call-sites compile unchanged during the 3D migration.
 */
public final class PositionComponent implements Component {
    private float x;
    private float y;
    private float z;
    private float previousX;
    private float previousY;
    private float previousZ;

    public PositionComponent(float x, float y) {
        this(x, y, 0f);
    }

    public PositionComponent(float x, float y, float z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.previousX = x;
        this.previousY = y;
        this.previousZ = z;
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

    /** Ground-plane position before the current tick's move (set by {@link #savePrevious()}). */
    public float previousX() {
        return previousX;
    }

    public float previousY() {
        return previousY;
    }

    public Vec3 asVec3() {
        return new Vec3(x, y, z);
    }

    public void savePrevious() {
        previousX = x;
        previousY = y;
        previousZ = z;
    }

    public void revertToPrevious() {
        x = previousX;
        y = previousY;
        z = previousZ;
    }

    /** Sets the ground-plane position, leaving elevation unchanged (2D call-sites). */
    public void set(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public void set(float x, float y, float z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /** Sets only the elevation. */
    public void setZ(float z) {
        this.z = z;
    }

    /** Adds to the ground-plane position, leaving elevation unchanged (2D call-sites). */
    public void add(float dx, float dy) {
        this.x += dx;
        this.y += dy;
    }

    public void add(float dx, float dy, float dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    }
}
