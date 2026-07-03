package com.triforge.games.tankarena.systems;

import com.triforge.games.tankarena.collision.CollisionDetector;
import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MatchHeadquarters;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.TileChange;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

public final class CollisionSystem implements System {
    private final GameMap gameMap;
    private final MatchHeadquarters matchHeadquarters;
    private final Consumer<TankHit> tankHitHandler;
    private final Consumer<HqHit> hqHitHandler;
    private final List<TileChange> tileChanges = new ArrayList<>();
    private final List<Integer> tankEntityIndexes = new ArrayList<>();
    private final List<Long> bulletsToDestroy = new ArrayList<>();
    private final List<TankHit> pendingTankHits = new ArrayList<>();
    private final List<HqHit> pendingHqHits = new ArrayList<>();
    private final List<Long> hitTankIds = new ArrayList<>();

    public record TankHit(long playerId, Entity tank, Entity bullet, int livesRemaining, long shooterEntityId) {
    }

    public record HqHit(Team victimTeam, Team shooterTeam, int hpRemaining, boolean destroyed) {
    }

    public CollisionSystem(
            GameMap gameMap,
            MatchHeadquarters matchHeadquarters,
            Consumer<TankHit> tankHitHandler,
            Consumer<HqHit> hqHitHandler
    ) {
        this.gameMap = Objects.requireNonNull(gameMap, "gameMap");
        this.matchHeadquarters = Objects.requireNonNull(matchHeadquarters, "matchHeadquarters");
        this.tankHitHandler = Objects.requireNonNull(tankHitHandler, "tankHitHandler");
        this.hqHitHandler = Objects.requireNonNull(hqHitHandler, "hqHitHandler");
    }

    public void drainTileChanges(List<TileChange> out) {
        out.addAll(tileChanges);
        tileChanges.clear();
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        resolveBulletCollisions(entityManager, componentManager);
    }

    private void resolveBulletCollisions(EntityManager entityManager, ComponentManager componentManager) {
        collectTankEntityIndexes(componentManager, entityManager.count());
        bulletsToDestroy.clear();
        pendingTankHits.clear();
        pendingHqHits.clear();
        hitTankIds.clear();

        for (int index = 0; index < entityManager.count(); index++) {
            BulletComponent bullet = componentManager.getAt(index, BulletComponent.class);
            PositionComponent bulletPosition = componentManager.getAt(index, PositionComponent.class);
            if (bullet == null || bulletPosition == null) {
                continue;
            }

            long bulletEntityId = entityManager.idAt(index);

            // Bullet-vs-terrain: a bullet that has dropped below ground level is spent. Strict
            // less-than so a level shot skimming flat ground (z == height) still flies.
            if (bulletPosition.z() < gameMap.heightAt(bulletPosition.x(), bulletPosition.y())) {
                bulletsToDestroy.add(bulletEntityId);
                continue;
            }

            TileType tileHit = CollisionDetector.bulletTileHit(
                    gameMap,
                    bulletPosition.x(),
                    bulletPosition.y()
            );
            if (tileHit != null) {
                if (tileHit.isHeadquarters()) {
                    bulletsToDestroy.add(bulletEntityId);
                    registerHeadquartersHit(bullet, bulletPosition, componentManager);
                    continue;
                }
                if (tileHit.destroyedByBullet()) {
                    destroyTileAt(bulletPosition.x(), bulletPosition.y());
                }
                bulletsToDestroy.add(bulletEntityId);
                continue;
            }

            int tankIndex = CollisionDetector.findFirstTankHitByBullet(
                    bulletEntityId,
                    bulletPosition,
                    bullet,
                    tankEntityIndexes,
                    entityManager,
                    componentManager
            );
            if (tankIndex < 0) {
                continue;
            }

            // The bullet is consumed regardless; the hit is recorded for deferred handling.
            long tankEntityId = entityManager.idAt(tankIndex);
            bulletsToDestroy.add(bulletEntityId);
            if (hitTankIds.contains(tankEntityId)) {
                continue; // Tank already hit this tick: consume the bullet, apply damage once.
            }

            PlayerComponent player = componentManager.getAt(tankIndex, PlayerComponent.class);
            if (player == null) {
                continue;
            }
            player.decrementLives();
            hitTankIds.add(tankEntityId);
            pendingTankHits.add(new TankHit(
                    player.playerId(),
                    new Entity(tankEntityId),
                    new Entity(bulletEntityId),
                    player.lives(),
                    bullet.ownerEntityId()
            ));
        }

        // Mutate the entity set only AFTER iteration finishes. Destroying entities mid-loop
        // would swap-remove slots and corrupt both the index walk and tankEntityIndexes.
        for (int index = 0; index < bulletsToDestroy.size(); index++) {
            entityManager.destroyId(bulletsToDestroy.get(index));
        }
        for (int index = 0; index < pendingTankHits.size(); index++) {
            tankHitHandler.accept(pendingTankHits.get(index));
        }
        for (int index = 0; index < pendingHqHits.size(); index++) {
            hqHitHandler.accept(pendingHqHits.get(index));
        }
    }

    private void registerHeadquartersHit(
            BulletComponent bullet,
            PositionComponent bulletPosition,
            ComponentManager componentManager
    ) {
        var victimTeam = gameMap.hqTeamAtWorld(bulletPosition.x(), bulletPosition.y());
        if (victimTeam.isEmpty()) {
            return;
        }

        Team shooterTeam = shooterTeam(bullet, componentManager);
        if (!shooterTeam.isPlayable() || shooterTeam == victimTeam.get()) {
            return;
        }
        if (matchHeadquarters.isDestroyed(victimTeam.get())) {
            return;
        }

        int remaining = matchHeadquarters.applyDamage(victimTeam.get());
        if (remaining < 0) {
            return;
        }
        pendingHqHits.add(new HqHit(
                victimTeam.get(),
                shooterTeam,
                remaining,
                remaining == 0
        ));
    }

    private Team shooterTeam(BulletComponent bullet, ComponentManager componentManager) {
        PlayerComponent player = componentManager.get(bullet.ownerEntityId(), PlayerComponent.class);
        if (player == null || player.team() == null) {
            return Team.NONE;
        }
        return player.team();
    }

    private void collectTankEntityIndexes(ComponentManager componentManager, int entityCount) {
        tankEntityIndexes.clear();
        for (int index = 0; index < entityCount; index++) {
            if (componentManager.getAt(index, TankComponent.class) == null) {
                continue;
            }
            if (componentManager.getAt(index, PlayerComponent.class) == null) {
                continue;
            }
            if (componentManager.getAt(index, PositionComponent.class) == null) {
                continue;
            }
            tankEntityIndexes.add(index);
        }
    }

    private void destroyTileAt(float worldX, float worldY) {
        int tileX = gameMap.worldToTileX(worldX);
        int tileY = gameMap.worldToTileY(worldY);
        if (gameMap.destroyTile(tileX, tileY)) {
            tileChanges.add(TileChange.newBuilder()
                    .setX(tileX)
                    .setY(tileY)
                    .setTile(com.triforge.protocol.proto.TileType.EMPTY)
                    .build());
        }
    }
}
