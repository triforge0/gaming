package com.triforge.engine.ecs;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Sparse structure-of-arrays component storage. Each component type gets its own column array,
 * registered on first use — no hard-coded game-specific types.
 */
public final class ComponentManager {
    private EntityManager entityManager;
    private final Map<Class<? extends Component>, ComponentColumn> columns = new HashMap<>();
    private int capacity = EntityManager.INITIAL_CAPACITY;

    public void bind(EntityManager entityManager) {
        this.entityManager = Objects.requireNonNull(entityManager, "entityManager");
    }

    public void add(Entity entity, Component component) {
        add(entity.id(), component);
    }

    public void add(long entityId, Component component) {
        Objects.requireNonNull(component, "component");
        int slot = requireSlot(entityId);
        ensureCapacity(slot + 1);
        columnFor(component.getClass()).set(slot, component);
    }

    public <T extends Component> T get(Entity entity, Class<T> type) {
        return get(entity.id(), type);
    }

    public <T extends Component> T get(long entityId, Class<T> type) {
        Objects.requireNonNull(type, "type");
        int slot = slotOrAbsent(entityId);
        if (slot < 0) {
            return null;
        }
        return getAt(slot, type);
    }

    public <T extends Component> T getAt(int entityIndex, Class<T> type) {
        Objects.requireNonNull(type, "type");
        if (entityIndex < 0 || entityIndex >= capacity) {
            return null;
        }
        ComponentColumn column = columns.get(type);
        if (column == null) {
            return null;
        }
        return type.cast(column.get(entityIndex));
    }

    public <T extends Component> boolean has(Entity entity, Class<T> type) {
        return has(entity.id(), type);
    }

    public <T extends Component> boolean has(long entityId, Class<T> type) {
        return get(entityId, type) != null;
    }

    public <T extends Component> boolean hasAt(int entityIndex, Class<T> type) {
        return getAt(entityIndex, type) != null;
    }

    public <T extends Component> T remove(Entity entity, Class<T> type) {
        return remove(entity.id(), type);
    }

    public <T extends Component> T remove(long entityId, Class<T> type) {
        Objects.requireNonNull(type, "type");
        int slot = slotOrAbsent(entityId);
        if (slot < 0) {
            return null;
        }
        ComponentColumn column = columns.get(type);
        if (column == null) {
            return null;
        }
        @SuppressWarnings("unchecked")
        T removed = (T) column.get(slot);
        column.set(slot, null);
        return removed;
    }

    public void removeAll(Entity entity) {
        removeAll(entity.id());
    }

    public void removeAll(long entityId) {
        int slot = slotOrAbsent(entityId);
        if (slot >= 0) {
            clearSlot(slot);
        }
    }

    public int slotOf(long entityId) {
        return slotOrAbsent(entityId);
    }

    void swapSlots(int toIndex, int fromIndex) {
        for (ComponentColumn column : columns.values()) {
            column.swap(toIndex, fromIndex);
        }
    }

    void clearSlot(int index) {
        if (index < 0 || index >= capacity) {
            return;
        }
        for (ComponentColumn column : columns.values()) {
            column.set(index, null);
        }
    }

    public void clear() {
        for (ComponentColumn column : columns.values()) {
            column.clear(capacity);
        }
    }

    private int requireSlot(long entityId) {
        int slot = slotOrAbsent(entityId);
        if (slot < 0) {
            throw new IllegalStateException("Unknown entity id: " + entityId);
        }
        return slot;
    }

    private int slotOrAbsent(long entityId) {
        if (entityManager == null) {
            throw new IllegalStateException("ComponentManager is not bound to an EntityManager");
        }
        return entityManager.indexOf(entityId);
    }

    private void ensureCapacity(int minCapacity) {
        if (minCapacity <= capacity) {
            return;
        }
        int newCapacity = Math.max(minCapacity, capacity * 2);
        for (ComponentColumn column : columns.values()) {
            column.grow(newCapacity);
        }
        capacity = newCapacity;
    }

    private ComponentColumn columnFor(Class<? extends Component> type) {
        return columns.computeIfAbsent(type, ignored -> new ComponentColumn(capacity));
    }

    private static final class ComponentColumn {
        private Component[] values;

        ComponentColumn(int initialCapacity) {
            this.values = new Component[initialCapacity];
        }

        Component get(int index) {
            return values[index];
        }

        void set(int index, Component value) {
            values[index] = value;
        }

        void swap(int left, int right) {
            Component temporary = values[left];
            values[left] = values[right];
            values[right] = temporary;
        }

        void grow(int newCapacity) {
            if (newCapacity <= values.length) {
                return;
            }
            values = Arrays.copyOf(values, newCapacity);
        }

        void clear(int upTo) {
            Arrays.fill(values, 0, Math.min(upTo, values.length), null);
        }
    }
}
