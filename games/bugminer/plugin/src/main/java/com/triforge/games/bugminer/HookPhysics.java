package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import java.util.List;

public class HookPhysics {
    public static class HookData {
        public float angle = 0;
        public float length = GameConstants.HOOK_MIN_LENGTH;
        public BugMinerHookState state = BugMinerHookState.BM_HOOK_SWINGING;
        public String attachedItemId = null;
        public int swingDirection = 1;
    }

    public static HookData createInitialHook() {
        HookData hook = new HookData();
        hook.length = GameConstants.HOOK_MIN_LENGTH;
        hook.state = BugMinerHookState.BM_HOOK_SWINGING;
        return hook;
    }

    public static float resolveHookAngle(BattleHookAnchor anchor, HookData hook) {
        return anchor.mirror ? (float) Math.PI - hook.angle : hook.angle;
    }

    public static Vec2 getHookTipAt(BattleHookAnchor anchor, HookData hook) {
        float angle = resolveHookAngle(anchor, hook);
        return new Vec2(
                anchor.origin.x + (float) Math.sin(angle) * hook.length,
                anchor.origin.y + (float) Math.cos(angle) * hook.length);
    }

    public static Vec2 getHookTip(HookData hook) {
        return new Vec2(
                (float) (Math.sin(hook.angle) * hook.length),
                (float) (-Math.cos(hook.angle) * hook.length));
    }

    public static void updateSwing(HookData hook, float deltaSec) {
        hook.angle += hook.swingDirection * GameConstants.HOOK_SWING_SPEED * deltaSec;
        if (hook.angle >= GameConstants.HOOK_ANGLE_MAX) {
            hook.angle = GameConstants.HOOK_ANGLE_MAX;
            hook.swingDirection = -1;
        } else if (hook.angle <= GameConstants.HOOK_ANGLE_MIN) {
            hook.angle = GameConstants.HOOK_ANGLE_MIN;
            hook.swingDirection = 1;
        }
    }

    public static void updateExtend(HookData hook, float deltaSec) {
        hook.length = Math.min(hook.length + GameConstants.HOOK_EXTEND_SPEED * deltaSec, GameConstants.HOOK_MAX_LENGTH);
    }

    public static void updateRetract(HookData hook, float deltaSec, float attachedWeight, float strengthMultiplier) {
        float speed = (320f / Math.max(attachedWeight, 0.5f)) * strengthMultiplier;
        hook.length = Math.max(hook.length - speed * deltaSec, GameConstants.HOOK_MIN_LENGTH);

        if (hook.length <= GameConstants.HOOK_MIN_LENGTH + 1f) {
            hook.state = BugMinerHookState.BM_HOOK_SWINGING;
            hook.attachedItemId = null;
        } else {
            hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
        }
    }

    public static PlacedItem checkCollisionAt(BattleHookAnchor anchor, HookData hook, List<PlacedItem> items) {
        Vec2 tip = getHookTipAt(anchor, hook);
        for (PlacedItem item : items) {
            if (item.collected) continue;
            float radius = ItemValueHelper.getRadius(item.type, item.scale);
            float dx = tip.x - item.x;
            float dy = tip.y - item.y;
            float dist = (float) Math.sqrt(dx * dx + dy * dy);
            if (dist < radius + 8) return item;
        }
        return null;
    }

    public static PlacedItem checkCollision(HookData hook, List<PlacedItem> items) {
        Vec2 tip = getHookTip(hook);
        float tipY = -tip.y;
        for (PlacedItem item : items) {
            if (item.collected) continue;
            float radius = ItemValueHelper.getRadius(item.type, item.scale);
            float dx = tip.x - item.x;
            float dy = tipY - item.y;
            float dist = (float) Math.sqrt(dx * dx + dy * dy);
            if (dist < radius + 8) return item;
        }
        return null;
    }

    public static boolean checkBoundsAt(BattleHookAnchor anchor, HookData hook) {
        Vec2 tip = getHookTipAt(anchor, hook);
        return tip.x < GameConstants.MAP_MIN_X || tip.x > GameConstants.MAP_MAX_X
                || tip.y < GameConstants.MAP_MIN_Y || tip.y > GameConstants.MAP_MAX_Y;
    }

    public static boolean checkBounds(HookData hook) {
        Vec2 tip = getHookTip(hook);
        float tipY = -tip.y;
        return tip.x < GameConstants.MAP_MIN_X || tip.x > GameConstants.MAP_MAX_X
                || tipY < GameConstants.MAP_MIN_Y || tipY > GameConstants.MAP_MAX_Y;
    }

    public static HookData bounceHook(HookData hook) {
        HookData bounced = createInitialHook();
        bounced.angle = hook.angle;
        bounced.swingDirection = hook.swingDirection;
        return bounced;
    }

    public static boolean checkHookClash(Vec2 tipA, Vec2 tipB) {
        float dx = tipA.x - tipB.x;
        float dy = tipA.y - tipB.y;
        return Math.hypot(dx, dy) < GameConstants.HOOK_CLASH_RADIUS;
    }
}
