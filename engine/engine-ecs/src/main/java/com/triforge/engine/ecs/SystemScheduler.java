package com.triforge.engine.ecs;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public final class SystemScheduler {
    private final List<System> systems = new ArrayList<>();

    public SystemScheduler add(System system) {
        systems.add(Objects.requireNonNull(system, "system"));
        return this;
    }

    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        for (System system : systems) {
            system.update(tick, entityManager, componentManager);
        }
    }

    public int size() {
        return systems.size();
    }

    public void clear() {
        systems.clear();
    }
}
