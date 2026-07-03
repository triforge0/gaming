package com.triforge.games.tankarena.sync;

import com.triforge.engine.sync.ViewerContext;
import com.triforge.games.tankarena.map.CoverDetector;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.VisibilityMap;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.FullSnapshot;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Tracks which entities each viewer last saw so interest filtering can emit
 * {@code removedEntityIds} when a target becomes hidden (e.g. enters bush cover).
 */
final class PlayerVisibilityTracker {
    private final Map<Long, Set<Long>> visibleEntityIds = new HashMap<>();
    private final Map<Long, Map<Long, float[]>> lastKnownPositions = new HashMap<>();

    void onFullSnapshot(long viewerPlayerId, FullSnapshot filtered) {
        Set<Long> visible = new HashSet<>();
        Map<Long, float[]> positions = new HashMap<>();
        for (EntityProto entity : filtered.getEntitiesList()) {
            long id = entity.getEntityId();
            visible.add(id);
            recordPosition(positions, entity);
        }
        visibleEntityIds.put(viewerPlayerId, visible);
        lastKnownPositions.put(viewerPlayerId, positions);
    }

    void applyDeltaVisibility(
            long viewerPlayerId,
            ViewerContext viewer,
            DeltaSnapshot source,
            DeltaSnapshot.Builder filtered,
            VisibilityMap viewerFog,
            GameMap map,
            MapConfig config,
            EntityVisibility visibility
    ) {
        Set<Long> previouslyVisible = new HashSet<>(visibleEntityIds.getOrDefault(viewerPlayerId, Set.of()));
        Set<Long> nowVisible = new HashSet<>();
        Map<Long, float[]> positions = lastKnownPositions.computeIfAbsent(viewerPlayerId, ignored -> new HashMap<>());

        for (long removedId : source.getRemovedEntityIdsList()) {
            filtered.addRemovedEntityIds(removedId);
            previouslyVisible.remove(removedId);
            positions.remove(removedId);
        }

        for (EntityProto entity : source.getUpdatedEntitiesList()) {
            long entityId = entity.getEntityId();
            recordPosition(positions, entity);

            if (visibility.isVisible(entity, viewer, viewerFog)) {
                filtered.addUpdatedEntities(entity);
                nowVisible.add(entityId);
            } else if (previouslyVisible.contains(entityId)) {
                filtered.addRemovedEntityIds(entityId);
            }
        }

        for (long entityId : previouslyVisible) {
            if (entityId == viewer.entityId() || nowVisible.contains(entityId)) {
                nowVisible.add(entityId);
                continue;
            }
            float[] pos = positions.get(entityId);
            if (pos == null) {
                continue;
            }
            if (visibility.isVisibleAt(entityId, pos[0], pos[1], viewer, viewerFog)) {
                nowVisible.add(entityId);
            } else {
                filtered.addRemovedEntityIds(entityId);
            }
        }

        nowVisible.add(viewer.entityId());
        visibleEntityIds.put(viewerPlayerId, nowVisible);
    }

    void forgetPlayer(long viewerPlayerId) {
        visibleEntityIds.remove(viewerPlayerId);
        lastKnownPositions.remove(viewerPlayerId);
    }

    private static void recordPosition(Map<Long, float[]> positions, EntityProto entity) {
        if (!entity.hasPosition()) {
            return;
        }
        positions.put(entity.getEntityId(), new float[]{
                entity.getPosition().getX(),
                entity.getPosition().getY(),
        });
    }

    interface EntityVisibility {
        boolean isVisible(EntityProto entity, ViewerContext viewer, VisibilityMap viewerFog);

        boolean isVisibleAt(long entityId, float x, float y, ViewerContext viewer, VisibilityMap viewerFog);
    }

    static EntityVisibility coverVisibility(GameMap map, MapConfig config) {
        return new EntityVisibility() {
            @Override
            public boolean isVisible(EntityProto entity, ViewerContext viewer, VisibilityMap viewerFog) {
                if (entity.getEntityId() == viewer.entityId()) {
                    return true;
                }
                if (!entity.hasPosition()) {
                    return true;
                }
                return isVisibleAt(entity.getEntityId(), entity.getPosition().getX(), entity.getPosition().getY(),
                        viewer, viewerFog);
            }

            @Override
            public boolean isVisibleAt(long entityId, float x, float y, ViewerContext viewer, VisibilityMap viewerFog) {
                if (entityId == viewer.entityId()) {
                    return true;
                }
                if (viewerFog == null) {
                    return true;
                }
                return !CoverDetector.isEntityHiddenByCover(
                        viewerFog, map, config, viewer.x(), viewer.y(), x, y);
            }
        };
    }
}
