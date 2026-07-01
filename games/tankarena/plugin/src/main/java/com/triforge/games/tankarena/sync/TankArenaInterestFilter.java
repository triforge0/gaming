package com.triforge.games.tankarena.sync;

import com.triforge.engine.sync.InterestFilter;
import com.triforge.engine.sync.ViewerContext;
import com.triforge.games.tankarena.map.CoverDetector;
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

    public TankArenaInterestFilter(RoomVisionState visionState, GameMap map, MapConfig config) {
        this.visionState = visionState;
        this.map = map;
        this.config = config;
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
        return builder.build();
    }

    @Override
    public DeltaSnapshot filterDelta(DeltaSnapshot delta, ViewerContext viewer) {
        DeltaSnapshot.Builder builder = DeltaSnapshot.newBuilder()
                .setTick(delta.getTick());

        VisibilityMap viewerFog = visionState.visibilityOrNull(viewer.playerId());
        int filteredOut = 0;
        for (EntityProto entity : delta.getUpdatedEntitiesList()) {
            if (isEntityVisible(entity, viewer, viewerFog)) {
                builder.addUpdatedEntities(entity);
            } else {
                filteredOut++;
            }
        }

        for (long removedEntityId : delta.getRemovedEntityIdsList()) {
            builder.addRemovedEntityIds(removedEntityId);
        }

        for (TileChange tileChange : delta.getTileChangesList()) {
            if (isTileVisible(tileChange, viewerFog, viewer)) {
                builder.addTileChanges(tileChange);
            }
        }

        if (viewerFog != null && viewerFog.hasChangedSinceLastSent()) {
            builder.setFog(TankArenaFogSnapshotService.toProto(viewerFog));
            viewerFog.markSent();
        } else if (delta.hasFog()) {
            builder.setFog(delta.getFog());
        }

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
        if (entity.getEntityId() == viewer.entityId()) {
            return true;
        }
        if (!entity.hasPosition()) {
            return true;
        }
        float entityX = entity.getPosition().getX();
        float entityY = entity.getPosition().getY();

        if (viewerFog == null) {
            return isVisibleByRadius(entity, viewer.x(), viewer.y());
        }

        return !CoverDetector.isEntityHiddenByCover(
                viewerFog,
                map,
                config,
                viewer.x(),
                viewer.y(),
                entityX,
                entityY
        );
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
