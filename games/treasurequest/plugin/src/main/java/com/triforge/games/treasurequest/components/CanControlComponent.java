package com.triforge.games.treasurequest.components;

import com.triforge.engine.ecs.Component;

/** Server-side gate for whether an avatar accepts movement input this tick. */
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
