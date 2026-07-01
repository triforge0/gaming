package com.triforge.engine.sync;

import com.triforge.engine.game.Game;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.TileChange;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Default entity delta tracking; tile baselines are delegated to {@link TileBaselineSync}. */
public final class StandardDeltaService implements DeltaService {
    private static final class EntityState {
        private float x;
        private float y;
        private Direction direction = Direction.UP;
        private boolean hasDirection;

        static EntityState from(EntityProto proto) {
            EntityState state = new EntityState();
            if (proto.hasPosition()) {
                state.x = proto.getPosition().getX();
                state.y = proto.getPosition().getY();
            }
            if (proto.hasDirection()) {
                state.direction = proto.getDirection().getDirection();
                state.hasDirection = true;
            }
            return state;
        }
    }

    private final Map<Long, EntityState> baseline = new HashMap<>();
    private final Map<Integer, Object> tileBaseline = new HashMap<>();
    private final List<Long> removedEntityIds = new ArrayList<>();
    private TileBaselineSync tileSync = TileBaselineSync.noop();

    @Override
    public void bindTileSync(TileBaselineSync tileSync) {
        this.tileSync = tileSync != null ? tileSync : TileBaselineSync.noop();
    }

    @Override
    public Optional<DeltaSnapshot> buildDelta(Game game, long tick, List<TileChange> tileChanges) {
        EntityManager entityManager = game.entityManager();
        List<EntityProto> updatedEntities = new ArrayList<>();
        removedEntityIds.clear();

        for (int index = 0; index < entityManager.count(); index++) {
            long entityId = entityManager.idAt(index);
            EntityProto current = game.snapshotWriter().writeEntity(entityId, index, game.componentManager());
            if (hasEntityChanged(entityId, current)) {
                updatedEntities.add(current);
            }
        }

        for (Long entityId : baseline.keySet()) {
            if (!entityManager.contains(entityId)) {
                removedEntityIds.add(entityId);
            }
        }

        if (updatedEntities.isEmpty() && removedEntityIds.isEmpty() && tileChanges.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(DeltaSnapshot.newBuilder()
                .setTick(tick)
                .addAllUpdatedEntities(updatedEntities)
                .addAllRemovedEntityIds(removedEntityIds)
                .addAllTileChanges(tileChanges)
                .build());
    }

    @Override
    public void applyDelta(DeltaSnapshot delta, List<TileChange> tileChanges) {
        for (EntityProto entity : delta.getUpdatedEntitiesList()) {
            baseline.put(entity.getEntityId(), EntityState.from(entity));
        }
        for (long entityId : delta.getRemovedEntityIdsList()) {
            baseline.remove(entityId);
        }
        recordTileChanges(tileChanges);
    }

    @Override
    public void syncBaseline(Game game) {
        baseline.clear();
        tileBaseline.clear();
        for (int index = 0; index < game.entityManager().count(); index++) {
            long entityId = game.entityManager().idAt(index);
            EntityProto proto = game.snapshotWriter().writeEntity(entityId, index, game.componentManager());
            baseline.put(entityId, EntityState.from(proto));
        }
        tileSync.syncBaseline(game, tileBaseline);
    }

    @Override
    public void removeEntity(long entityId) {
        baseline.remove(entityId);
    }

    @Override
    public void recordTileChanges(List<TileChange> tileChanges) {
        for (TileChange change : tileChanges) {
            tileSync.recordTileChange(change, tileBaseline);
        }
    }

    private boolean hasEntityChanged(long entityId, EntityProto current) {
        EntityState previous = baseline.get(entityId);
        if (previous == null) {
            return true;
        }
        if (!current.hasPosition()) {
            return true;
        }

        float x = current.getPosition().getX();
        float y = current.getPosition().getY();

        if (!previous.hasDirection || !current.hasDirection()) {
            return previous.x != x || previous.y != y;
        }

        return previous.x != x
                || previous.y != y
                || previous.direction != current.getDirection().getDirection();
    }
}
