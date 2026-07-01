package com.triforge.engine.ecs;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ComponentManagerTest {

    private record TestPosition(float x, float y) implements Component {
    }

    private record TestTag(int id) implements Component {
    }

    private record TestMarker() implements Component {
    }

    @Test
    void storesComponentsByEntitySlot() {
        EcsWorld world = new EcsWorld();
        EntityManager entities = world.entityManager();
        ComponentManager components = world.componentManager();

        Entity entity = entities.create();
        components.add(entity, new TestPosition(10f, 20f));
        components.add(entity, new TestMarker());

        int slot = components.slotOf(entity.id());
        assertEquals(10f, components.getAt(slot, TestPosition.class).x(), 0.001f);
        assertNotNull(components.getAt(slot, TestMarker.class));
    }

    @Test
    void swapsComponentColumnsWhenEntityRemovedWithSwap() {
        EcsWorld world = new EcsWorld();
        EntityManager entities = world.entityManager();
        ComponentManager components = world.componentManager();

        Entity first = entities.create();
        components.add(first, new TestPosition(1f, 1f));
        components.add(first, new TestTag(1));

        Entity second = entities.create();
        components.add(second, new TestPosition(2f, 2f));
        components.add(second, new TestTag(2));

        entities.destroyId(first.id());

        assertEquals(1, entities.count());
        assertTrue(entities.contains(second.id()));
        int slot = components.slotOf(second.id());
        assertEquals(2f, components.getAt(slot, TestPosition.class).x(), 0.001f);
        assertEquals(2, components.getAt(slot, TestTag.class).id());
        assertNull(components.getAt(1, TestPosition.class));
    }

    @Test
    void clearsSlotWhenLastEntityDestroyed() {
        EcsWorld world = new EcsWorld();
        EntityManager entities = world.entityManager();
        ComponentManager components = world.componentManager();

        Entity entity = entities.create();
        components.add(entity, new TestPosition(5f, 6f));

        entities.destroyId(entity.id());

        assertEquals(0, entities.count());
        assertNull(components.getAt(0, TestPosition.class));
    }

    @Test
    void registersComponentTypesOnFirstUse() {
        EcsWorld world = new EcsWorld();
        Entity entity = world.entityManager().create();
        ComponentManager components = world.componentManager();

        components.add(entity, new TestMarker());
        assertNotNull(components.get(entity, TestMarker.class));
        assertNull(components.get(entity, TestPosition.class));
    }
}
