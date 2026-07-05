package com.triforge.games.bugminer;

import com.triforge.protocol.proto.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ChallengeInstance {
    public long designerId;
    public long playerId;
    
    private String levelId;
    private int timeLimit;
    private float timeRemaining;
    private int score = 0;
    private int targetScore = 1000;
    
    private HookPhysics.HookData hook = new HookPhysics.HookData();
    private List<PlacedItem> items = new ArrayList<>();
    
    private boolean setupLocked = false;
    private String endReason = null;
    private boolean finished = false;
    private float strengthBuffRemaining = 0f;
    
    // We can store events to broadcast them later
    private final List<BugMinerClientEvent> pendingEvents = new ArrayList<>();

    public ChallengeInstance(long designerId, long playerId, String levelId) {
        this.designerId = designerId;
        this.playerId = playerId;
        setLevel(levelId);
    }
    
    private void addItemsOfType(BugMinerItemType type, int count) {
        for (int i = 0; i < count; i++) {
            items.add(new PlacedItem(type.name() + "-" + UUID.randomUUID().toString(), type));
        }
    }
    
    public boolean setLevel(String levelId) {
        if (setupLocked) return false;
        this.levelId = levelId;
        
        int target = 800;
        int time = 90;
        
        items.clear();
        
        if (levelId.equals("easy-mine")) {
            target = 800;
            time = 90;
            addItemsOfType(BugMinerItemType.BM_ITEM_GOLD, 15);
            addItemsOfType(BugMinerItemType.BM_ITEM_BIG_GOLD, 9);
            addItemsOfType(BugMinerItemType.BM_ITEM_DIAMOND, 4);
            addItemsOfType(BugMinerItemType.BM_ITEM_ROCK, 13);
            addItemsOfType(BugMinerItemType.BM_ITEM_MYSTERY_BAG, 8);
            addItemsOfType(BugMinerItemType.BM_ITEM_POISON, 2);
        } else if (levelId.equals("rock-mine")) {
            target = 1000;
            time = 80;
            addItemsOfType(BugMinerItemType.BM_ITEM_GOLD, 13);
            addItemsOfType(BugMinerItemType.BM_ITEM_BIG_GOLD, 9);
            addItemsOfType(BugMinerItemType.BM_ITEM_DIAMOND, 3);
            addItemsOfType(BugMinerItemType.BM_ITEM_ROCK, 28);
            addItemsOfType(BugMinerItemType.BM_ITEM_MYSTERY_BAG, 8);
            addItemsOfType(BugMinerItemType.BM_ITEM_POISON, 3);
        } else if (levelId.equals("diamond-cave")) {
            target = 1200;
            time = 75;
            addItemsOfType(BugMinerItemType.BM_ITEM_GOLD, 13);
            addItemsOfType(BugMinerItemType.BM_ITEM_BIG_GOLD, 7);
            addItemsOfType(BugMinerItemType.BM_ITEM_DIAMOND, 3);
            addItemsOfType(BugMinerItemType.BM_ITEM_ROCK, 25);
            addItemsOfType(BugMinerItemType.BM_ITEM_MYSTERY_BAG, 8);
            addItemsOfType(BugMinerItemType.BM_ITEM_POISON, 4);
        } else if (levelId.equals("chaos-mine")) {
            target = 1500;
            time = 70;
            addItemsOfType(BugMinerItemType.BM_ITEM_GOLD, 18);
            addItemsOfType(BugMinerItemType.BM_ITEM_BIG_GOLD, 8);
            addItemsOfType(BugMinerItemType.BM_ITEM_DIAMOND, 4);
            addItemsOfType(BugMinerItemType.BM_ITEM_ROCK, 23);
            addItemsOfType(BugMinerItemType.BM_ITEM_MYSTERY_BAG, 9);
            addItemsOfType(BugMinerItemType.BM_ITEM_POISON, 4);
        } else if (levelId.equals("night-mine")) {
            target = 1800;
            time = 60;
            addItemsOfType(BugMinerItemType.BM_ITEM_GOLD, 15);
            addItemsOfType(BugMinerItemType.BM_ITEM_BIG_GOLD, 8);
            addItemsOfType(BugMinerItemType.BM_ITEM_DIAMOND, 3);
            addItemsOfType(BugMinerItemType.BM_ITEM_ROCK, 30);
            addItemsOfType(BugMinerItemType.BM_ITEM_MYSTERY_BAG, 8);
            addItemsOfType(BugMinerItemType.BM_ITEM_POISON, 5);
        }
        
        double rng = Math.random();
        int mouseCount = 4 + (int) (rng * 6);
        int pigCount = 5 + (int) (rng * 8);
        int strengthDrinkCount = 2 + (int) (rng * 3);
        
        addItemsOfType(BugMinerItemType.BM_ITEM_MOUSE, mouseCount);
        addItemsOfType(BugMinerItemType.BM_ITEM_PIG, pigCount);
        addItemsOfType(BugMinerItemType.BM_ITEM_STRENGTH_DRINK, strengthDrinkCount);

        this.timeLimit = time;
        this.timeRemaining = time;
        this.targetScore = target;
        
        return true;
    }
    
    public boolean setTimeLimit(int seconds) {
        if (setupLocked) return false;
        this.timeLimit = seconds;
        this.timeRemaining = seconds;
        return true;
    }
    
    public boolean placeItem(long socketId, String itemId, float x, float y) {
        if (socketId != designerId || setupLocked) return false;
        PlacedItem item = items.stream().filter(i -> i.id.equals(itemId)).findFirst().orElse(null);
        if (item == null) return false;
        if (!MapLayoutEngine.isValidPlacement(itemId, x, y, items)) return false;
        item.x = x;
        item.y = y;
        return true;
    }
    
    public boolean autoArrange(long socketId) {
        return autoArrangeSeeded(socketId, 0);
    }

    public boolean autoArrangeSeeded(long socketId, long seed) {
        if (socketId != designerId || setupLocked) return false;
        return MapLayoutEngine.autoArrangeInPlace(items, seed);
    }
    
    public boolean lockSetup(long socketId) {
        if (socketId != designerId || setupLocked) return false;
        for (PlacedItem item : items) {
            if (!item.collected && item.x == 0f && item.y == 0f) return false;
        }
        setupLocked = true;
        return true;
    }

    /** Fair mode: apply pre-built layout and skip manual setup. */
    public void applyFairLayout(String levelId, int timeLimitSeconds, List<PlacedItem> layout) {
        this.levelId = levelId;
        this.timeLimit = Math.max(30, Math.min(300, timeLimitSeconds));
        this.timeRemaining = this.timeLimit;
        this.targetScore = LevelCatalog.targetScore(levelId);
        items.clear();
        for (PlacedItem src : layout) {
            PlacedItem copy = new PlacedItem(src.id, src.type);
            copy.x = src.x;
            copy.y = src.y;
            copy.collected = false;
            copy.moving = src.moving;
            copy.vx = src.vx;
            copy.vy = src.vy;
            copy.scale = src.scale;
            items.add(copy);
        }
        setupLocked = true;
    }

    public List<PlacedItem> copyItemsLayout() {
        List<PlacedItem> copies = new ArrayList<>();
        for (PlacedItem item : items) {
            PlacedItem copy = new PlacedItem(item.id, item.type);
            copy.x = item.x;
            copy.y = item.y;
            copy.collected = item.collected;
            copy.moving = item.moving;
            copy.vx = item.vx;
            copy.vy = item.vy;
            copy.scale = item.scale;
            copies.add(copy);
        }
        return copies;
    }
    
    public boolean fireHook(long socketId) {
        if (socketId != playerId || finished) return false;
        if (hook.state != BugMinerHookState.BM_HOOK_SWINGING) return false;
        hook.state = BugMinerHookState.BM_HOOK_EXTENDING;
        return true;
    }
    
    public void tick(float deltaSec, boolean isPlaying) {
        if (!isPlaying || finished) return;
        
        timeRemaining -= deltaSec;
        if (timeRemaining <= 0) {
            timeRemaining = 0;
            markFinished("timeout");
            return;
        }
        
        if (strengthBuffRemaining > 0) {
            strengthBuffRemaining -= deltaSec;
            if (strengthBuffRemaining < 0) strengthBuffRemaining = 0;
        }
        
        updateMovingItems(deltaSec);
        updateHook(deltaSec);
        
        if (score >= targetScore) {
            markFinished("target");
        }
    }
    
    private void updateMovingItems(float deltaSec) {
        if (!setupLocked) return;
        
        for (PlacedItem item : items) {
            if (item.collected || !item.moving) continue;
            if (item.x == 0 && item.y == 0) continue;
            
            float radius = ItemValueHelper.getRadius(item.type, item.scale);
            item.x += item.vx * deltaSec;
            item.y += item.vy * deltaSec;
            
            float minX = -360f + radius;
            float maxX = 360f - radius;
            float minY = 20f + radius;
            float maxY = 300f - radius;
            
            if (item.x < minX) {
                item.x = minX;
                item.vx = Math.abs(item.vx);
            } else if (item.x > maxX) {
                item.x = maxX;
                item.vx = -Math.abs(item.vx);
            }
            
            if (item.y < minY) {
                item.y = minY;
                item.vy = Math.abs(item.vy);
            } else if (item.y > maxY) {
                item.y = maxY;
                item.vy = -Math.abs(item.vy);
            }
        }
    }
    
    private void updateHook(float deltaSec) {
        switch (hook.state) {
            case BM_HOOK_SWINGING:
                HookPhysics.updateSwing(hook, deltaSec);
                break;
            case BM_HOOK_EXTENDING:
                HookPhysics.updateExtend(hook, deltaSec);
                PlacedItem hit = HookPhysics.checkCollision(hook, items);
                if (hit != null) {
                    hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
                    hook.attachedItemId = hit.id;
                } else if (HookPhysics.checkBounds(hook)) {
                    hook.state = BugMinerHookState.BM_HOOK_RETRACTING;
                }
                break;
            case BM_HOOK_RETRACTING:
                PlacedItem attached = hook.attachedItemId != null 
                    ? items.stream().filter(i -> i.id.equals(hook.attachedItemId)).findFirst().orElse(null) 
                    : null;
                float weight = attached != null ? ItemValueHelper.getWeight(attached.type, attached.scale) : 1f;
                float strengthMultiplier = strengthBuffRemaining > 0 ? 2.0f : 1.0f;
                
                HookPhysics.updateRetract(hook, deltaSec, weight, strengthMultiplier);
                
                if (attached != null && !attached.collected) {
                    Vec2 tip = HookPhysics.getHookTip(hook);
                    attached.x = tip.x;
                    attached.y = -tip.y;
                }
                
                if (hook.state == BugMinerHookState.BM_HOOK_SWINGING && attached != null) {
                    collectItem(attached);
                }
                break;
        }
    }
    
    private void collectItem(PlacedItem item) {
        if (item.collected) return;
        item.collected = true;

        if (item.type == BugMinerItemType.BM_ITEM_POISON) {
            BugMinerClientEvent ev = new BugMinerClientEvent("poison:hit");
            ev.playerId = playerId;
            ev.itemId = item.id;
            pendingEvents.add(ev);
            markFinished("poison");
            return;
        }
        if (item.type == BugMinerItemType.BM_ITEM_STRENGTH_DRINK) {
            strengthBuffRemaining = GameConstants.STRENGTH_BUFF_DURATION;
            BugMinerClientEvent ev = new BugMinerClientEvent("strength:boost");
            ev.playerId = playerId;
            ev.itemId = item.id;
            pendingEvents.add(ev);
            return;
        }

        int value = ItemValueHelper.getValue(item.type, item.scale);
        if (item.type == BugMinerItemType.BM_ITEM_MYSTERY_BAG) {
            value = ItemValueHelper.resolveMysteryValue();
            BugMinerClientEvent reveal = new BugMinerClientEvent("mystery:reveal");
            reveal.playerId = playerId;
            reveal.itemId = item.id;
            reveal.value = value;
            pendingEvents.add(reveal);
        }

        score += value;
        BugMinerClientEvent collected = new BugMinerClientEvent("item:collected");
        collected.playerId = playerId;
        collected.itemId = item.id;
        collected.value = value;
        pendingEvents.add(collected);
    }

    List<BugMinerClientEvent> drainEvents() {
        List<BugMinerClientEvent> drained = new ArrayList<>(pendingEvents);
        pendingEvents.clear();
        return drained;
    }

    boolean isFinished() {
        return finished;
    }

    String endReason() {
        return endReason;
    }

    int score() {
        return score;
    }

    boolean setupLocked() {
        return setupLocked;
    }
    
    private void markFinished(String reason) {
        if (finished) return;
        finished = true;
        endReason = reason;
    }
    
    public BugMinerChallengeState toProto() {
        BugMinerChallengeState.Builder builder = BugMinerChallengeState.newBuilder()
            .setDesignerId(designerId)
            .setPlayerId(playerId)
            .setLevelId(levelId)
            .setTimeLimit(timeLimit)
            .setTimeRemaining((int)Math.ceil(timeRemaining))
            .setScore(score)
            .setTargetScore(targetScore)
            .setSetupLocked(setupLocked)
            .setFinished(finished)
            .setStrengthBuffRemaining((int) Math.ceil(strengthBuffRemaining));
            
        if (endReason != null) builder.setEndReason(endReason);
        
        builder.setHook(BugMinerHookData.newBuilder()
            .setAngle(hook.angle)
            .setLength(hook.length)
            .setState(hook.state));
        
        if (hook.attachedItemId != null) {
            builder.getHookBuilder().setAttachedItemId(hook.attachedItemId);
        }
            
        for (PlacedItem item : items) {
            builder.addItems(BugMinerPlacedItem.newBuilder()
                .setId(item.id)
                .setType(item.type)
                .setX(item.x)
                .setY(item.y)
                .setCollected(item.collected)
                .setScale(item.scale));
        }
        
        return builder.build();
    }
}
