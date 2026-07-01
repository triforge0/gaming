package com.triforge.games.tankarena.systems;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.System;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.vision.FogOfWarCalculator;
import com.triforge.games.tankarena.vision.RoomVisionState;

import java.util.Objects;

public final class FogOfWarSystem implements System {
    private final FogOfWarCalculator calculator;

    public FogOfWarSystem(FogOfWarCalculator calculator) {
        this.calculator = Objects.requireNonNull(calculator, "calculator");
    }

    public FogOfWarSystem(GameMap map, MapConfig config, RoomVisionState visionState) {
        this(new FogOfWarCalculator(map, config, visionState));
    }

    @Override
    public void update(long tick, EntityManager entityManager, ComponentManager componentManager) {
        calculator.recomputeAll(entityManager, componentManager);
    }

    public FogOfWarCalculator calculator() {
        return calculator;
    }
}
