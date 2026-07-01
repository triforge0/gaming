package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;

/**
 * Server-side gate for whether a tank accepts movement input this tick.
 * Used for respawn invulnerability, stun/freeze, and other control locks.
 */
public final class CanControlComponent implements Component {
    private boolean controllable;

    public CanControlComponent() {
        this(true);
    }

    public CanControlComponent(boolean controllable) {
        this.controllable = controllable;
    }

    public boolean canControl() {
        return controllable;
    }

    public void setControllable(boolean controllable) {
        this.controllable = controllable;
    }
}
