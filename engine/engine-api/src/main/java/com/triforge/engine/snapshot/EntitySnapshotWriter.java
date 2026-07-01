package com.triforge.engine.snapshot;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.Entity;
import com.triforge.protocol.proto.EntityProto;

/** Game plugin hook: serialize one ECS entity into the wire snapshot format. */
public interface EntitySnapshotWriter {

    EntityProto writeEntity(long entityId, int entityIndex, ComponentManager componentManager);

    default EntityProto writeEntity(Entity entity, ComponentManager componentManager) {
        return writeEntity(entity.id(), componentManager);
    }

    default EntityProto writeEntity(long entityId, ComponentManager componentManager) {
        int slot = componentManager.slotOf(entityId);
        if (slot < 0) {
            return EntityProto.newBuilder().setEntityId(entityId).build();
        }
        return writeEntity(entityId, slot, componentManager);
    }
}
