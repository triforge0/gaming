package com.triforge.engine.snapshot;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.protocol.proto.EntityProto;

/** Writes entity ids only — useful for lobby-only or placeholder game plugins. */
public final class EmptyEntitySnapshotWriter implements EntitySnapshotWriter {

    public static final EmptyEntitySnapshotWriter INSTANCE = new EmptyEntitySnapshotWriter();

    private EmptyEntitySnapshotWriter() {
    }

    @Override
    public EntityProto writeEntity(long entityId, int entityIndex, ComponentManager componentManager) {
        return EntityProto.newBuilder().setEntityId(entityId).build();
    }
}
