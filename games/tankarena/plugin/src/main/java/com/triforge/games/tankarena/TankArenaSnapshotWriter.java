package com.triforge.games.tankarena;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.OrientationComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.match.MatchProtoMapper;
import com.triforge.protocol.proto.BulletComponentProto;
import com.triforge.protocol.proto.DirectionComponentProto;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.OrientationComponentProto;
import com.triforge.protocol.proto.PlayerComponentProto;
import com.triforge.protocol.proto.PositionComponentProto;
import com.triforge.protocol.proto.TankComponentProto;

/** Tank Arena entity → protobuf mapping for full/delta snapshots. */
public final class TankArenaSnapshotWriter implements EntitySnapshotWriter {

    public static final TankArenaSnapshotWriter INSTANCE = new TankArenaSnapshotWriter();

    private TankArenaSnapshotWriter() {
    }

    @Override
    public EntityProto writeEntity(long entityId, int entityIndex, ComponentManager componentManager) {
        EntityProto.Builder builder = EntityProto.newBuilder().setEntityId(entityId);

        PlayerComponent player = componentManager.getAt(entityIndex, PlayerComponent.class);
        if (player != null) {
            builder.setPlayer(toPlayerProto(player));
        }

        PositionComponent position = componentManager.getAt(entityIndex, PositionComponent.class);
        if (position != null) {
            builder.setPosition(toPositionProto(position));
        }

        DirectionComponent direction = componentManager.getAt(entityIndex, DirectionComponent.class);
        if (direction != null) {
            builder.setDirection(toDirectionProto(direction));
        }

        OrientationComponent orientation = componentManager.getAt(entityIndex, OrientationComponent.class);
        if (orientation != null) {
            builder.setOrientation(toOrientationProto(orientation));
        }

        TankComponent tank = componentManager.getAt(entityIndex, TankComponent.class);
        if (tank != null) {
            builder.setTank(toTankProto(tank));
        }

        BulletComponent bullet = componentManager.getAt(entityIndex, BulletComponent.class);
        if (bullet != null) {
            builder.setBullet(toBulletProto(bullet));
        }

        return builder.build();
    }

    private static PlayerComponentProto toPlayerProto(PlayerComponent player) {
        return PlayerComponentProto.newBuilder()
                .setPlayerId(player.playerId())
                .setName(player.name())
                .setScore(player.score())
                .setLives(player.lives())
                .setTeam(MatchProtoMapper.toProto(player.team()))
                .build();
    }

    private static PositionComponentProto toPositionProto(PositionComponent position) {
        return PositionComponentProto.newBuilder()
                .setX(position.x())
                .setY(position.y())
                .setZ(position.z())
                .build();
    }

    private static DirectionComponentProto toDirectionProto(DirectionComponent direction) {
        return DirectionComponentProto.newBuilder()
                .setDirection(direction.direction())
                .build();
    }

    private static OrientationComponentProto toOrientationProto(OrientationComponent orientation) {
        return OrientationComponentProto.newBuilder()
                .setYaw(orientation.yaw())
                .setPitch(orientation.pitch())
                .build();
    }

    private static TankComponentProto toTankProto(TankComponent tank) {
        return TankComponentProto.newBuilder()
                .setSpeed(tank.speed())
                .setShootCooldownTicks(tank.shootCooldownTicks())
                .setCooldownRemainingTicks(tank.cooldownRemainingTicks())
                .build();
    }

    private static BulletComponentProto toBulletProto(BulletComponent bullet) {
        return BulletComponentProto.newBuilder()
                .setOwnerEntityId(bullet.ownerEntityId())
                .setSpeed(bullet.speed())
                .setDx(bullet.directionX())
                .setDy(bullet.directionY())
                .setDz(bullet.directionZ())
                .build();
    }
}
