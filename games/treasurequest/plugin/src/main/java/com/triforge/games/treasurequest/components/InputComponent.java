package com.triforge.games.treasurequest.components;

import com.triforge.engine.ecs.Component;
import com.triforge.protocol.proto.InputCommand;

public final class InputComponent implements Component {
    private boolean moveUp;
    private boolean moveDown;
    private boolean moveLeft;
    private boolean moveRight;

    public void apply(InputCommand command) {
        moveUp = command.getMoveUp();
        moveDown = command.getMoveDown();
        moveLeft = command.getMoveLeft();
        moveRight = command.getMoveRight();
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
}
