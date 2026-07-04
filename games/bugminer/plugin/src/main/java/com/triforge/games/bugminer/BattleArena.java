package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import com.triforge.protocol.proto.BugMinerItemType;
import java.util.ArrayList;
import java.util.List;

public class BattleArena {
    public final long playerAId;
    public final long playerBId;

    private final String levelId;
    private final int timeLimit;
    private float timeRemaining;
    private final List<PlacedItem> items = new ArrayList<>();
    private HookPhysics.HookData hookA = HookPhysics.createInitialHook();
    private HookPhysics.HookData hookB = HookPhysics.createInitialHook();
    private int scoreA = 0;
    private int scoreB = 0;
    private float strengthBuffA = 0f;
    private float strengthBuffB = 0f;
    private boolean finished = false;
    private Long winnerId = null;
    private String endReason = null;
    private final List<BugMinerClientEvent> pendingEvents = new ArrayList<>();

    private static final BattleHookAnchor ANCHOR_A =
            new BattleHookAnchor(GameConstants.BATTLE_MINER_A, false);
    private static final BattleHookAnchor ANCHOR_B =
            new BattleHookAnchor(GameConstants.BATTLE_MINER_B, true);

    public BattleArena(long playerAId, long playerBId, String levelId, int timeLimit, List<PlacedItem> layout) {
        this.playerAId = playerAId;
        this.playerBId = playerBId;
        this.levelId = levelId;
        this.timeLimit = timeLimit;
        this.timeRemaining = timeLimit;
        for (PlacedItem src : layout) {
            PlacedItem copy = new PlacedItem(src.id, src.type);
            copy.x = src.x;
            copy.y = src.y;
            copy.collected = false;
            copy.moving = src.moving;
            copy.vx = src.vx;
            copy.vy = src.vy;
            items.add(copy);
        }
    }

    public boolean fireHook(long playerId) {
        if (finished) return false;
        if (playerId == playerAId && hookA.state == BugMinerHookState.BM_HOOK_SWINGING) {
            hookA.state = BugMinerHookState.BM_HOOK_EXTENDING;
            return true;
        }
        if (playerId == playerBId && hookB.state == BugMinerHookState.BM_HOOK_SWINGING) {
            hookB.state = BugMinerHookState.BM_HOOK_EXTENDING;
            return true;
        }
        return false;
    }

    public void tick(float deltaSec, boolean isPlaying) {
        if (!isPlaying || finished) return;

        strengthBuffA = Math.max(0f, strengthBuffA - deltaSec);
        strengthBuffB = Math.max(0f, strengthBuffB - deltaSec);

        timeRemaining -= deltaSec;
        if (timeRemaining <= 0) {
            timeRemaining = 0;
            finishByTimeout();
            return;
        }

        updateMovingItems(deltaSec);
        hookA = stepHook(hookA, ANCHOR_A, 'A', deltaSec);
        hookB = stepHook(hookB, ANCHOR_B, 'B', deltaSec);
        resolveHookClash();

        int target = LevelCatalog.targetScore(levelId);
        if (scoreA >= target) finish(playerAId, "target");
        else if (scoreB >= target) finish(playerBId, "target");
    }

    private void updateMovingItems(float deltaSec) {
        for (PlacedItem item : items) {
            if (item.collected || !item.moving) continue;
            if (item.x == 0 && item.y == 0) continue;

            ItemDefinition def = ItemDefinitions.get(item.type);
            float radius = ItemValueHelper.getRadius(item.type, item.scale);
            item.x += item.vx * deltaSec;
            item.y += item.vy * deltaSec;

            float minX = GameConstants.SETUP_MIN_X + radius;
            float maxX = GameConstants.SETUP_MAX_X - radius;
            float minY = GameConstants.SETUP_MIN_Y + radius;
            float maxY = GameConstants.SETUP_MAX_Y - radius;

            if (item.x < minX) { item.x = minX; item.vx = Math.abs(item.vx); }
            else if (item.x > maxX) { item.x = maxX; item.vx = -Math.abs(item.vx); }
            if (item.y < minY) { item.y = minY; item.vy = Math.abs(item.vy); }
            else if (item.y > maxY) { item.y = maxY; item.vy = -Math.abs(item.vy); }
        }
    }

    private HookPhysics.HookData stepHook(
            HookPhysics.HookData hook, BattleHookAnchor anchor, char side, float deltaSec) {
        if (hook.state == BugMinerHookState.BM_HOOK_SWINGING) {
            HookPhysics.updateSwing(hook, deltaSec);
            return hook;
        }

        if (hook.state == BugMinerHookState.BM_HOOK_EXTENDING) {
            HookPhysics.updateExtend(hook, deltaSec);
            PlacedItem hit = HookPhysics.checkCollisionAt(anchor, hook, items);
            if (hit != null) {
                HookPhysics.HookData other = side == 'A' ? hookB : hookA;
                if (hit.id.equals(other.attachedItemId)
                        && other.state == BugMinerHookState.BM_HOOK_RETRACTING) {
                    other.attachedItemId = null;
                    hook.attachedItemId = hit.id;
                    hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
                    BugMinerClientEvent steal = new BugMinerClientEvent("battle:steal");
                    steal.itemId = hit.id;
                    steal.thiefId = side == 'A' ? playerAId : playerBId;
                    steal.victimId = side == 'A' ? playerBId : playerAId;
                    pendingEvents.add(steal);
                } else if (!isItemAttached(hit.id, side)) {
                    hook.attachedItemId = hit.id;
                    hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
                } else {
                    hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
                }
            } else if (HookPhysics.checkBoundsAt(anchor, hook)) {
                hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
            }
            return hook;
        }

        if (hook.state == BugMinerHookState.BM_HOOK_RETRACTING) {
            PlacedItem attached = hook.attachedItemId == null ? null : findItem(hook.attachedItemId);
            float weight = attached != null ? ItemValueHelper.getWeight(attached.type, attached.scale) : 1f;
            float strength = getStrength(side);
            HookPhysics.updateRetract(hook, deltaSec, weight, strength);

            if (attached != null && !attached.collected) {
                float angle = HookPhysics.resolveHookAngle(anchor, hook);
                attached.x = anchor.origin.x + (float) Math.sin(angle) * hook.length;
                attached.y = anchor.origin.y + (float) Math.cos(angle) * hook.length;
            }

            if (hook.state == BugMinerHookState.BM_HOOK_SWINGING && attached != null) {
                collectItem(attached, side);
            }
            return hook;
        }

        return hook;
    }

    private boolean isItemAttached(String itemId, char excludeSide) {
        if (excludeSide != 'A' && itemId.equals(hookA.attachedItemId)) return true;
        if (excludeSide != 'B' && itemId.equals(hookB.attachedItemId)) return true;
        return false;
    }

    private float getStrength(char side) {
        float buff = side == 'A' ? strengthBuffA : strengthBuffB;
        return buff > 0 ? GameConstants.STRENGTH_BUFF_MULTIPLIER : 1f;
    }

    private void resolveHookClash() {
        boolean activeA = hookA.state != BugMinerHookState.BM_HOOK_SWINGING;
        boolean activeB = hookB.state != BugMinerHookState.BM_HOOK_SWINGING;
        if (!activeA && !activeB) return;

        Vec2 tipA = HookPhysics.getHookTipAt(ANCHOR_A, hookA);
        Vec2 tipB = HookPhysics.getHookTipAt(ANCHOR_B, hookB);
        if (!HookPhysics.checkHookClash(tipA, tipB)) return;

        if (activeA) hookA = HookPhysics.bounceHook(hookA);
        if (activeB) hookB = HookPhysics.bounceHook(hookB);

        BugMinerClientEvent clash = new BugMinerClientEvent("battle:clash");
        clash.playerAId = playerAId;
        clash.playerBId = playerBId;
        pendingEvents.add(clash);
    }

    private void collectItem(PlacedItem item, char side) {
        if (item.collected) return;
        item.collected = true;

        if (item.type == BugMinerItemType.BM_ITEM_POISON) {
            BugMinerClientEvent poison = new BugMinerClientEvent("poison:hit");
            poison.playerId = side == 'A' ? playerAId : playerBId;
            poison.itemId = item.id;
            pendingEvents.add(poison);
            long winner = side == 'A' ? playerBId : playerAId;
            finish(winner, "poison");
            return;
        }

        if (item.type == BugMinerItemType.BM_ITEM_STRENGTH_DRINK) {
            if (side == 'A') strengthBuffA = GameConstants.STRENGTH_BUFF_DURATION;
            else strengthBuffB = GameConstants.STRENGTH_BUFF_DURATION;
            BugMinerClientEvent boost = new BugMinerClientEvent("strength:boost");
            boost.playerId = side == 'A' ? playerAId : playerBId;
            boost.itemId = item.id;
            pendingEvents.add(boost);
            return;
        }

        int value = ItemValueHelper.getValue(item.type, item.scale);
        if (item.type == BugMinerItemType.BM_ITEM_MYSTERY_BAG) {
            value = ItemValueHelper.resolveMysteryValue();
            BugMinerClientEvent reveal = new BugMinerClientEvent("mystery:reveal");
            reveal.playerId = side == 'A' ? playerAId : playerBId;
            reveal.itemId = item.id;
            reveal.value = value;
            pendingEvents.add(reveal);
        }

        if (side == 'A') scoreA += value;
        else scoreB += value;

        BugMinerClientEvent collected = new BugMinerClientEvent("item:collected");
        collected.playerId = side == 'A' ? playerAId : playerBId;
        collected.itemId = item.id;
        collected.value = value;
        pendingEvents.add(collected);
    }

    List<BugMinerClientEvent> drainEvents() {
        List<BugMinerClientEvent> drained = new ArrayList<>(pendingEvents);
        pendingEvents.clear();
        return drained;
    }

    private PlacedItem findItem(String id) {
        for (PlacedItem item : items) {
            if (item.id.equals(id)) return item;
        }
        return null;
    }

    private void finishByTimeout() {
        if (scoreA > scoreB) finish(playerAId, "timeout");
        else if (scoreB > scoreA) finish(playerBId, "timeout");
        else finish(null, "timeout");
    }

    private void finish(Long winner, String reason) {
        if (finished) return;
        finished = true;
        winnerId = winner;
        endReason = reason;
    }

    public boolean isFinished() {
        return finished;
    }

    public Long winnerId() {
        return winnerId;
    }

    public com.triforge.protocol.proto.BugMinerBattleState toProto() {
        com.triforge.protocol.proto.BugMinerBattleState.Builder b =
                com.triforge.protocol.proto.BugMinerBattleState.newBuilder()
                        .setLevelId(levelId)
                        .setTimeLimit(timeLimit)
                        .setTimeRemaining((int) Math.ceil(timeRemaining))
                        .setTargetScore(LevelCatalog.targetScore(levelId))
                        .setPlayerAId(playerAId)
                        .setPlayerBId(playerBId)
                        .setHookA(hookToProto(hookA))
                        .setHookB(hookToProto(hookB))
                        .setScoreA(scoreA)
                        .setScoreB(scoreB)
                        .setFinished(finished)
                        .setStrengthBuffA((int) Math.ceil(strengthBuffA))
                        .setStrengthBuffB((int) Math.ceil(strengthBuffB));
        if (winnerId != null) b.setWinnerId(winnerId);
        if (endReason != null) b.setEndReason(endReason);
        for (PlacedItem item : items) {
            b.addItems(com.triforge.protocol.proto.BugMinerPlacedItem.newBuilder()
                    .setId(item.id)
                    .setType(item.type)
                    .setX(item.x)
                    .setY(item.y)
                    .setCollected(item.collected)
                    .setScale(item.scale));
        }
        return b.build();
    }

    private static com.triforge.protocol.proto.BugMinerHookData hookToProto(HookPhysics.HookData hook) {
        com.triforge.protocol.proto.BugMinerHookData.Builder b =
                com.triforge.protocol.proto.BugMinerHookData.newBuilder()
                        .setAngle(hook.angle)
                        .setLength(hook.length)
                        .setState(hook.state)
                        .setSwingDirection(hook.swingDirection);
        if (hook.attachedItemId != null) b.setAttachedItemId(hook.attachedItemId);
        return b.build();
    }
}
