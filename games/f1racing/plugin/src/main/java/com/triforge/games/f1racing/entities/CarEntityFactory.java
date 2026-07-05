package com.triforge.games.f1racing.entities;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.f1racing.components.CarKinematicsComponent;
import com.triforge.games.f1racing.components.DriverComponent;
import com.triforge.games.f1racing.physics.VehicleState;
import com.triforge.games.f1racing.track.StartGridSlot;
import com.triforge.protocol.proto.F1GarageLoadout;

public final class CarEntityFactory {

    private CarEntityFactory() {
    }

    public static long spawn(
            EntityManager entities,
            ComponentManager components,
            long playerId,
            String name,
            boolean bot,
            F1GarageLoadout loadout,
            StartGridSlot grid
    ) {
        long entityId = entities.create().id();
        String carId = loadout == null ? "formula-modern" : loadout.getCarId();
        String color = loadout == null ? "#e10600" : loadout.getPrimaryColor();
        components.add(entityId, new DriverComponent(playerId, name, bot, carId, color));
        CarKinematicsComponent kinematics = new CarKinematicsComponent();
        kinematics.syncFrom(new VehicleState(grid.x(), grid.y(), grid.z(), grid.yaw()));
        components.add(entityId, kinematics);
        return entityId;
    }
}
