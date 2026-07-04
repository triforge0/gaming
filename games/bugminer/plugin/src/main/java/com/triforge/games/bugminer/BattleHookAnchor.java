package com.triforge.games.bugminer;

/** Anchor for battle-mode hooks (left / right miners). */
final class BattleHookAnchor {
    final Vec2 origin;
    final boolean mirror;

    BattleHookAnchor(Vec2 origin, boolean mirror) {
        this.origin = origin;
        this.mirror = mirror;
    }
}
