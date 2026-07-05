package com.triforge.games.bugminer;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class HookAttachedPositionTest {

    @Test
    void attachedItemUsesGameYNotInternalHookTipY() {
        HookPhysics.HookData hook = HookPhysics.createInitialHook();
        hook.angle = 0.4f;
        hook.length = 150f;

        Vec2 tip = HookPhysics.getHookTip(hook);
        float attachedX = tip.x;
        float attachedY = -tip.y;

        assertEquals((float) (Math.sin(hook.angle) * hook.length), attachedX, 0.01f);
        assertEquals((float) (Math.cos(hook.angle) * hook.length), attachedY, 0.01f);
        assertTrue(attachedY > 0f, "attached item should stay underground (positive game Y)");
    }
}
