package com.triforge.games.treasurequest.components;

import com.triforge.engine.ecs.Component;
import com.triforge.protocol.proto.Direction;

import java.util.Objects;

public final class DirectionComponent implements Component {
    private Direction direction;

    public DirectionComponent(Direction direction) {
        this.direction = Objects.requireNonNull(direction, "direction");
    }

    public Direction direction() {
        return direction;
    }

    public void set(Direction direction) {
        this.direction = Objects.requireNonNull(direction, "direction");
    }
}
