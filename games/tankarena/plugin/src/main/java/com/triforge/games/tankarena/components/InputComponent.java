package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;
import com.triforge.protocol.proto.InputCommand;

public final class InputComponent implements Component {
    private boolean moveUp;
    private boolean moveDown;
    private boolean moveLeft;
    private boolean moveRight;
    private boolean shoot;

    // 3D keyboard intent (server accumulates yaw/pitch).
    private boolean moveForward;
    private boolean moveBackward;
    private boolean turnLeft;
    private boolean turnRight;
    private boolean aimUp;
    private boolean aimDown;
    private boolean lockTarget;

    public void apply(InputCommand command) {
        moveUp = command.getMoveUp();
        moveDown = command.getMoveDown();
        moveLeft = command.getMoveLeft();
        moveRight = command.getMoveRight();
        shoot = command.getShoot();
        moveForward = command.getMoveForward();
        moveBackward = command.getMoveBackward();
        turnLeft = command.getTurnLeft();
        turnRight = command.getTurnRight();
        aimUp = command.getAimUp();
        aimDown = command.getAimDown();
        lockTarget = command.getLockTarget();
    }

    public boolean moveForward() {
        return moveForward;
    }

    public boolean moveBackward() {
        return moveBackward;
    }

    public boolean turnLeft() {
        return turnLeft;
    }

    public boolean turnRight() {
        return turnRight;
    }

    public boolean aimUp() {
        return aimUp;
    }

    public boolean aimDown() {
        return aimDown;
    }

    /** Hold to auto-steer the hull toward the nearest visible enemy (aim assist). */
    public boolean lockTarget() {
        return lockTarget;
    }

    /** True when any legacy 4-way key is pressed (Phaser client during the parity window). */
    public boolean hasLegacyMove() {
        return moveUp || moveDown || moveLeft || moveRight;
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
