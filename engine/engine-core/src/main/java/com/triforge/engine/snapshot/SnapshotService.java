package com.triforge.engine.snapshot;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.protocol.proto.FullSnapshot;

import java.util.ArrayList;
import java.util.List;

/** Generic full-state snapshot assembly; entity encoding is delegated to the active game plugin. */
public final class SnapshotService {

    private SnapshotService() {
    }

    public static FullSnapshot buildFullSnapshot(
            EntitySnapshotWriter writer,
            EntityManager entityManager,
            ComponentManager componentManager,
            long tick
    ) {
        List<com.triforge.protocol.proto.EntityProto> protos =
                new ArrayList<>(entityManager.count());
        for (int index = 0; index < entityManager.count(); index++) {
            protos.add(writer.writeEntity(entityManager.idAt(index), index, componentManager));
        }

        return FullSnapshot.newBuilder()
                .setTick(tick)
                .addAllEntities(protos)
                .build();
    }
}
