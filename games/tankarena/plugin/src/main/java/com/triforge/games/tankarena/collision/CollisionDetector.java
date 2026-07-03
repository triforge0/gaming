package com.triforge.games.tankarena.collision;

import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.world.WorldBounds;
import com.triforge.games.tankarena.match.Team;

import java.util.List;

public final class CollisionDetector {
    public static final float BULLET_RADIUS = 4f;
    /** Half the tank's vertical extent; used to gate collisions by elevation in 3D. */
    public static final float TANK_HALF_HEIGHT = WorldBounds.TANK_HALF_SIZE;
    /**
     * Half-extent used for tank-vs-tile overlap. Slightly tighter than {@link
     * WorldBounds#TANK_HALF_SIZE} (which also drives bullet/tank spacing) so the hull matches
     * its visual footprint and can actually fit through the map's one-tile-wide gaps instead
     * of clipping a neighbouring block and jamming.
     */
    public static final float TANK_TILE_HALF = 12f;

    private CollisionDetector() {
    }

    public static boolean tankOverlapsSolidTile(GameMap map, float centerX, float centerY) {
        return tankOverlapsSolidTile(map, MapConfig.DEFAULT, centerX, centerY);
    }

    public static boolean tankOverlapsSolidTile(GameMap map, MapConfig config, float centerX, float centerY) {
        float half = TANK_TILE_HALF;
        int minTileX = map.worldToTileX(centerX - half);
        int maxTileX = map.worldToTileX(centerX + half);
        int minTileY = map.worldToTileY(centerY - half);
        int maxTileY = map.worldToTileY(centerY + half);

        for (int tileY = minTileY; tileY <= maxTileY; tileY++) {
            for (int tileX = minTileX; tileX <= maxTileX; tileX++) {
                if (map.tileAt(tileX, tileY).blocksTank(config)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static TileType bulletTileHit(GameMap map, float x, float y) {
        TileType tile = map.tileAtWorld(x, y);
        if (tile.blocksBullet()) {
            return tile;
        }
        return null;
    }

    public static boolean bulletHitsTank(
            PositionComponent tankPosition,
            PositionComponent bulletPosition
    ) {
        float dx = Math.abs(tankPosition.x() - bulletPosition.x());
        float dy = Math.abs(tankPosition.y() - bulletPosition.y());
        if (dx > WorldBounds.TANK_HALF_SIZE + BULLET_RADIUS
                || dy > WorldBounds.TANK_HALF_SIZE + BULLET_RADIUS) {
            return false;
        }
        // 3D: bullet must also be within the tank's vertical extent. The hull base sits at
        // the tank's z; its centre is one half-height up.
        float tankCenterZ = tankPosition.z() + TANK_HALF_HEIGHT;
        float dz = Math.abs(bulletPosition.z() - tankCenterZ);
        return dz <= TANK_HALF_HEIGHT + BULLET_RADIUS;
    }

    public static boolean tanksOverlap(PositionComponent a, PositionComponent b) {
        // 3D: tanks must overlap on the ground plane AND at a similar elevation. Tanks on
        // ledges well above/below one another pass without colliding.
        if (!tanksOverlap(a.x(), a.y(), b.x(), b.y())) {
            return false;
        }
        return Math.abs(a.z() - b.z()) <= TANK_HALF_HEIGHT * 2f;
    }

    public static boolean tanksOverlap(float x1, float y1, float x2, float y2) {
        float maxSpan = WorldBounds.TANK_HALF_SIZE * 2f;
        return Math.abs(x1 - x2) <= maxSpan && Math.abs(y1 - y2) <= maxSpan;
    }

    public static int findFirstTankHitByBullet(
            long bulletEntityId,
            PositionComponent bulletPosition,
            BulletComponent bullet,
            List<Integer> tankEntityIndexes,
            EntityManager entityManager,
            ComponentManager componentManager
    ) {
        Team shooterTeam = shooterTeam(bullet, componentManager);
        for (int index = 0; index < tankEntityIndexes.size(); index++) {
            int tankIndex = tankEntityIndexes.get(index);
            long tankEntityId = entityManager.idAt(tankIndex);
            if (tankEntityId == bulletEntityId || tankEntityId == bullet.ownerEntityId()) {
                continue;
            }

            PlayerComponent tankPlayer = componentManager.getAt(tankIndex, PlayerComponent.class);
            if (tankPlayer != null
                    && shooterTeam.isPlayable()
                    && tankPlayer.team() == shooterTeam) {
                continue;
            }

            PositionComponent tankPosition = componentManager.getAt(tankIndex, PositionComponent.class);
            if (tankPosition == null) {
                continue;
            }
            if (bulletHitsTank(tankPosition, bulletPosition)) {
                return tankIndex;
            }
        }
        return -1;
    }

    private static Team shooterTeam(BulletComponent bullet, ComponentManager componentManager) {
        PlayerComponent player = componentManager.get(bullet.ownerEntityId(), PlayerComponent.class);
        if (player == null || player.team() == null) {
            return Team.NONE;
        }
        return player.team();
    }
}
