package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import java.util.List;

public class HookPhysics {
    public static final float HOOK_ANGLE_MAX = 1.309f; // 75 degrees in radians
    public static final float HOOK_ANGLE_MIN = -1.309f;
    public static final float HOOK_EXTEND_SPEED = 200f;
    public static final float HOOK_SWING_SPEED = 1.0f;
    public static final float HOOK_MIN_LENGTH = 20f;
    public static final float HOOK_MAX_LENGTH = 600f;

    public static class HookData {
        public float angle = 0;
        public float length = HOOK_MIN_LENGTH;
        public BugMinerHookState state = BugMinerHookState.BM_HOOK_SWINGING; // swinging, extending, retracting
        public String attachedItemId = null;
        public int swingDirection = 1;
        
        public void reset() {
            angle = 0;
            length = HOOK_MIN_LENGTH;
            state = BugMinerHookState.BM_HOOK_SWINGING;
            attachedItemId = null;
            swingDirection = 1;
        }
    }

    public static Vec2 getHookTip(HookData hook) {
        return new Vec2(
            (float)(Math.sin(hook.angle) * hook.length),
            (float)(-Math.cos(hook.angle) * hook.length)
        );
    }

    public static void updateSwing(HookData hook, float deltaSec) {
        hook.angle += hook.swingDirection * HOOK_SWING_SPEED * deltaSec;
        if (hook.angle >= HOOK_ANGLE_MAX) {
            hook.angle = HOOK_ANGLE_MAX;
            hook.swingDirection = -1;
        } else if (hook.angle <= HOOK_ANGLE_MIN) {
            hook.angle = HOOK_ANGLE_MIN;
            hook.swingDirection = 1;
        }
    }

    public static void updateExtend(HookData hook, float deltaSec) {
        hook.length = Math.min(hook.length + HOOK_EXTEND_SPEED * deltaSec, HOOK_MAX_LENGTH);
    }

    public static void updateRetract(HookData hook, float deltaSec, float attachedWeight, float strengthMultiplier) {
        float speed = (320f / Math.max(attachedWeight, 0.5f)) * strengthMultiplier;
        hook.length = Math.max(hook.length - speed * deltaSec, HOOK_MIN_LENGTH);
        
        if (hook.length <= HOOK_MIN_LENGTH + 1f) {
            hook.state = BugMinerHookState.BM_HOOK_SWINGING;
            hook.attachedItemId = null;
        } else {
            hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
        }
    }

    public static PlacedItem checkCollision(HookData hook, List<PlacedItem> items) {
        Vec2 tip = getHookTip(hook);
        float tipY = -tip.y; // Match TS logic

        for (PlacedItem item : items) {
            if (item.collected) continue;
            ItemDefinition def = ItemDefinitions.get(item.type);
            float dx = tip.x - item.x;
            float dy = tipY - item.y;
            float dist = (float)Math.sqrt(dx * dx + dy * dy);
            
            if (dist < def.radius + 8) {
                return item;
            }
        }
        return null;
    }

    public static boolean checkBounds(HookData hook) {
        Vec2 tip = getHookTip(hook);
        float tipY = -tip.y;
        // Map bounds from TS
        return tip.x < -400 || tip.x > 400 || tipY < 0 || tipY > 600; 
    }
}
