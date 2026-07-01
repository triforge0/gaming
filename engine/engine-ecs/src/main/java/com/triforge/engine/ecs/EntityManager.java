package com.triforge.engine.ecs;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;

public final class EntityManager {
    static final int INITIAL_CAPACITY = 32;

    private final AtomicLong nextId = new AtomicLong(1L);
    private final Map<Long, Integer> idToSlot = new HashMap<>();
    private long[] ids = new long[INITIAL_CAPACITY];
    private int size;
    private ComponentManager componentManager;

    public void bind(ComponentManager componentManager) {
        this.componentManager = Objects.requireNonNull(componentManager, "componentManager");
    }

    public Entity create() {
        long id = nextId.getAndIncrement();
        if (size == ids.length) {
            ids = Arrays.copyOf(ids, ids.length * 2);
        }
        int slot = size++;
        ids[slot] = id;
        idToSlot.put(id, slot);
        return new Entity(id);
    }

    public boolean destroy(Entity entity) {
        Objects.requireNonNull(entity, "entity");
        return destroyId(entity.id());
    }

    public boolean destroyId(long entityId) {
        Integer slotValue = idToSlot.remove(entityId);
        if (slotValue == null) {
            return false;
        }

        int slot = slotValue;
        int lastIndex = size - 1;
        if (slot < lastIndex) {
            long movedEntityId = ids[lastIndex];
            ids[slot] = movedEntityId;
            idToSlot.put(movedEntityId, slot);
            if (componentManager != null) {
                componentManager.swapSlots(slot, lastIndex);
            }
        }

        if (componentManager != null) {
            componentManager.clearSlot(lastIndex);
        }
        size--;
        return true;
    }

    public boolean exists(Entity entity) {
        Objects.requireNonNull(entity, "entity");
        return contains(entity.id());
    }

    public boolean contains(long entityId) {
        return idToSlot.containsKey(entityId);
    }

    public int indexOf(long entityId) {
        return idToSlot.getOrDefault(entityId, -1);
    }

    public int count() {
        return size;
    }

    public int capacity() {
        return ids.length;
    }

    public long idAt(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException(index);
        }
        return ids[index];
    }

    public void clear() {
        if (componentManager != null) {
            for (int index = 0; index < size; index++) {
                componentManager.clearSlot(index);
            }
        }
        idToSlot.clear();
        size = 0;
    }
}
