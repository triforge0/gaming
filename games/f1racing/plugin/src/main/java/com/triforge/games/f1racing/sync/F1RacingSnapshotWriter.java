package com.triforge.games.f1racing.sync;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.games.f1racing.components.CarKinematicsComponent;
import com.triforge.games.f1racing.components.DriverComponent;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.OrientationComponentProto;
import com.triforge.protocol.proto.PlayerComponentProto;
import com.triforge.protocol.proto.PositionComponentProto;
import com.triforge.protocol.proto.VehicleComponentProto;

public final class F1RacingSnapshotWriter implements EntitySnapshotWriter {

    public static final F1RacingSnapshotWriter INSTANCE = new F1RacingSnapshotWriter();

    private F1RacingSnapshotWriter() {
    }

    @Override
    public EntityProto writeEntity(long entityId, int entityIndex, ComponentManager componentManager) {
        EntityProto.Builder builder = EntityProto.newBuilder().setEntityId(entityId);

        DriverComponent driver = componentManager.getAt(entityIndex, DriverComponent.class);
        if (driver != null) {
            builder.setPlayer(PlayerComponentProto.newBuilder()
                    .setPlayerId(driver.playerId())
                    .setName(driver.name())
                    .build());
        }

        CarKinematicsComponent kinematics = componentManager.getAt(entityIndex, CarKinematicsComponent.class);
        if (kinematics != null) {
            builder.setPosition(PositionComponentProto.newBuilder()
                    .setX(kinematics.x())
                    .setY(kinematics.y())
                    .setZ(kinematics.z())
                    .build());
            builder.setOrientation(OrientationComponentProto.newBuilder()
                    .setYaw(kinematics.yaw())
                    .setPitch(0f)
                    .build());
            if (driver != null) {
                builder.setVehicle(VehicleComponentProto.newBuilder()
                        .setSpeed(kinematics.speed())
                        .setRpm(kinematics.rpm())
                        .setGear(kinematics.gear())
                        .setNitro(kinematics.nitro())
                        .setCurrentLap(kinematics.currentLap())
                        .setRacePosition(kinematics.racePosition())
                        .setCarId(driver.carId())
                        .setPrimaryColor(driver.primaryColor())
                        .build());
            }
        }

        return builder.build();
    }
}
