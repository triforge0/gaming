package com.triforge.games.tankarena.sync;

import com.triforge.engine.sync.InterestFilter;
import com.triforge.engine.sync.ViewerContext;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.VisibilityMap;
import com.triforge.games.tankarena.vision.RoomVisionState;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.FullSnapshot;
import com.triforge.protocol.proto.TileChange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Tank Arena fog-of-war and proximity interest filtering for snapshots. */
public final class TankArenaInterestFilter implements InterestFilter {
    private static final Logger logger = LoggerFactory.getLogger(TankArenaInterestFilter.class);

    public static final float VIEW_RADIUS = 300f;

    private final RoomVisionState visionState;
    private final GameMap map;
    private final MapConfig config;
    private final PlayerVisibilityTracker visibilityTracker = new PlayerVisibilityTracker();
    private final PlayerVisibilityTracker.EntityVisibility entityVisibility;

    public TankArenaInterestFilter(RoomVisionState visionState, GameMap map, MapConfig config) {
        this.visionState = visionState;
        this.map = map;
        this.config = config;
        this.entityVisibility = PlayerVisibilityTracker.coverVisibility(map, config);
    }

    @Override
    public FullSnapshot filterFull(FullSnapshot snapshot, ViewerContext viewer) {
        FullSnapshot.Builder builder = FullSnapshot.newBuilder()
                .setTick(snapshot.getTick());

        VisibilityMap viewerFog = visionState.visibilityOrNull(viewer.playerId());
        for (EntityProto entity : snapshot.getEntitiesList()) {
            if (isEntityVisible(entity, viewer, viewerFog)) {
                builder.addEntities(entity);
            }
        }

        if (viewerFog != null) {
            builder.setFog(TankArenaFogSnapshotService.toProto(viewerFog));
            viewerFog.markSent();
        } else if (snapshot.hasFog()) {
            builder.setFog(snapshot.getFog());
        }

        FullSnapshot filtered = builder.build();
        visibilityTracker.onFullSnapshot(viewer.playerId(), filtered);
        return filtered;
    }

    @Override
    public DeltaSnapshot filterDelta(DeltaSnapshot delta, ViewerContext viewer) {
        DeltaSnapshot.Builder builder = DeltaSnapshot.newBuilder()
                .setTick(delta.getTick());

        VisibilityMap viewerFog = visionState.visibilityOrNull(viewer.playerId());
        if (viewerFog == null) {
            return filterDeltaByRadius(delta, viewer.x(), viewer.y(), viewer.entityId());
        }

        visibilityTracker.applyDeltaVisibility(
                viewer.playerId(),
                viewer,
                delta,
                builder,
                viewerFog,
                map,
                config,
                entityVisibility
        );

        for (TileChange tileChange : delta.getTileChangesList()) {
            if (isTileVisible(tileChange, viewerFog, viewer)) {
                builder.addTileChanges(tileChange);
            }
        }

        if (viewerFog.hasChangedSinceLastSent()) {
            builder.setFog(TankArenaFogSnapshotService.toProto(viewerFog));
            viewerFog.markSent();
        } else if (delta.hasFog()) {
            builder.setFog(delta.getFog());
        }

        int filteredOut = delta.getUpdatedEntitiesCount() - builder.getUpdatedEntitiesCount();
        if (filteredOut > 0) {
            logger.debug("Interest filter removed {} entity updates outside vision", filteredOut);
        }

        return builder.build();
    }

    /** Radius-only filter used when fog state is unavailable (tests / fallback). */
    public DeltaSnapshot filterDeltaByRadius(DeltaSnapshot delta, float viewerX, float viewerY, long viewerEntityId) {
        DeltaSnapshot.Builder builder = DeltaSnapshot.newBuilder()
                .setTick(delta.getTick());

        for (EntityProto entity : delta.getUpdatedEntitiesList()) {
            if (entity.getEntityId() == viewerEntityId || isVisibleByRadius(entity, viewerX, viewerY)) {
                builder.addUpdatedEntities(entity);
            }
        }

        for (long removedEntityId : delta.getRemovedEntityIdsList()) {
            builder.addRemovedEntityIds(removedEntityId);
        }

        for (TileChange tileChange : delta.getTileChangesList()) {
            if (isTileVisibleByRadius(tileChange, viewerX, viewerY)) {
                builder.addTileChanges(tileChange);
            }
        }

        return builder.build();
    }

    private boolean isEntityVisible(EntityProto entity, ViewerContext viewer, VisibilityMap viewerFog) {
        return entityVisibility.isVisible(entity, viewer, viewerFog);
    }

    private static boolean isVisibleByRadius(EntityProto entity, float viewerX, float viewerY) {
        if (!entity.hasPosition()) {
            return true;
        }
        float dx = entity.getPosition().getX() - viewerX;
        float dy = entity.getPosition().getY() - viewerY;
        return dx * dx + dy * dy <= VIEW_RADIUS * VIEW_RADIUS;
    }

    private boolean isTileVisible(TileChange tileChange, VisibilityMap viewerFog, ViewerContext viewer) {
        if (viewerFog != null) {
            return viewerFog.isVisible(tileChange.getX(), tileChange.getY())
                    || viewerFog.isSeen(tileChange.getX(), tileChange.getY());
        }
        return isTileVisibleByRadius(tileChange, viewer.x(), viewer.y());
    }

    private boolean isTileVisibleByRadius(TileChange tileChange, float viewerX, float viewerY) {
        float tileCenterX = map.tileCenterX(tileChange.getX());
        float tileCenterY = map.tileCenterY(tileChange.getY());
        float dx = tileCenterX - viewerX;
        float dy = tileCenterY - viewerY;
        return dx * dx + dy * dy <= VIEW_RADIUS * VIEW_RADIUS;
    }
}
