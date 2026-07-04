package com.triforge.games.bugminer;

final class GameConstants {
    static final float HOOK_SWING_SPEED = 1.2f;
    static final float HOOK_EXTEND_SPEED = 280f;
    static final float HOOK_MIN_LENGTH = 40f;
    static final float HOOK_MAX_LENGTH = 640f;
    static final float HOOK_ANGLE_MIN = (float) (-Math.PI * 0.85);
    static final float HOOK_ANGLE_MAX = (float) (Math.PI * 0.85);
    static final float HOOK_CLASH_RADIUS = 32f;
    static final float STRENGTH_BUFF_DURATION = 15f;
    static final float STRENGTH_BUFF_MULTIPLIER = 2.5f;

    static final float MAP_MIN_X = -600f;
    static final float MAP_MAX_X = 600f;
    static final float MAP_MIN_Y = -60f;
    static final float MAP_MAX_Y = 400f;

    static final float SETUP_MIN_X = -560f;
    static final float SETUP_MAX_X = 560f;
    static final float SETUP_MIN_Y = 102f;
    static final float SETUP_MAX_Y = 368f;

    static final Vec2 BATTLE_MINER_A = new Vec2(-480f, 0f);
    static final Vec2 BATTLE_MINER_B = new Vec2(480f, 0f);

    private GameConstants() {}
}
