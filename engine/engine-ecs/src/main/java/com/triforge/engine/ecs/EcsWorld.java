package com.triforge.engine.ecs;

public final class EcsWorld {
    private final EntityManager entityManager = new EntityManager();
    private final ComponentManager componentManager = new ComponentManager();

    public EcsWorld() {
        entityManager.bind(componentManager);
        componentManager.bind(entityManager);
    }

    public EntityManager entityManager() {
        return entityManager;
    }

    public ComponentManager componentManager() {
        return componentManager;
    }
}
