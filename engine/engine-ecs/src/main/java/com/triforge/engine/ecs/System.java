package com.triforge.engine.ecs;

public interface System {
    void update(long tick, EntityManager entityManager, ComponentManager componentManager);
}
