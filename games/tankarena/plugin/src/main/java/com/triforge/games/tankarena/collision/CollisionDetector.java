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

    private CollisionDetector() {
    }

    public static boolean tankOverlapsSolidTile(GameMap map, float centerX, float centerY) {
        return tankOverlapsSolidTile(map, MapConfig.DEFAULT, centerX, centerY);
    }

    public static boolean tankOverlapsSolidTile(GameMap map, MapConfig config, float centerX, float centerY) {
        float half = WorldBounds.TANK_HALF_SIZE;
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
        return dx <= WorldBounds.TANK_HALF_SIZE + BULLET_RADIUS
                && dy <= WorldBounds.TANK_HALF_SIZE + BULLET_RADIUS;
    }

    public static boolean tanksOverlap(PositionComponent a, PositionComponent b) {
        return tanksOverlap(a.x(), a.y(), b.x(), b.y());
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
