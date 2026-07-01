package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;
import com.triforge.protocol.proto.InputCommand;

public final class InputComponent implements Component {
    private boolean moveUp;
    private boolean moveDown;
    private boolean moveLeft;
    private boolean moveRight;
    private boolean shoot;

    public void apply(InputCommand command) {
        moveUp = command.getMoveUp();
        moveDown = command.getMoveDown();
        moveLeft = command.getMoveLeft();
        moveRight = command.getMoveRight();
        shoot = command.getShoot();
    }

    public boolean moveUp() {
        return moveUp;
    }

    public boolean moveDown() {
        return moveDown;
    }

    public boolean moveLeft() {
        return moveLeft;
    }

    public boolean moveRight() {
        return moveRight;
    }

    public boolean shoot() {
        return shoot;
    }
}
