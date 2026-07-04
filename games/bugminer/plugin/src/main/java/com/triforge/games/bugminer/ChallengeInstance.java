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
    
    // We can store events to broadcast them later
    public List<GameEvent> pendingEvents = new ArrayList<>();

    public ChallengeInstance(long designerId, long playerId, String levelId) {
        this.designerId = designerId;
        this.playerId = playerId;
        setLevel(levelId);
    }
    
    public boolean setLevel(String levelId) {
        if (setupLocked) return false;
        this.levelId = levelId;
        this.timeLimit = 60; // Assuming easy-mine default
        this.timeRemaining = this.timeLimit;
        
        items.clear();
        // Generate some default items
        items.add(new PlacedItem(UUID.randomUUID().toString(), BugMinerItemType.BM_ITEM_BIG_GOLD));
        items.add(new PlacedItem(UUID.randomUUID().toString(), BugMinerItemType.BM_ITEM_GOLD));
        items.add(new PlacedItem(UUID.randomUUID().toString(), BugMinerItemType.BM_ITEM_ROCK));
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
        item.x = x;
        item.y = y;
        return true;
    }
    
    public boolean autoArrange(long socketId) {
        if (socketId != designerId || setupLocked) return false;
        float currX = -100;
        for (PlacedItem item : items) {
            item.x = currX;
            item.y = 200;
            currX += 100;
        }
        return true;
    }
    
    public boolean lockSetup(long socketId) {
        if (socketId != designerId || setupLocked) return false;
        setupLocked = true;
        return true;
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
        
        updateHook(deltaSec);
        
        if (score >= targetScore) {
            markFinished("target");
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
                float weight = attached != null ? ItemDefinitions.get(attached.type).weight : 1f;
                
                HookPhysics.updateRetract(hook, deltaSec, weight);
                
                if (attached != null && !attached.collected) {
                    attached.x = (float)(Math.sin(hook.angle) * hook.length);
                    attached.y = (float)(Math.cos(hook.angle) * hook.length);
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
            markFinished("poison");
            return;
        }
        
        int value = ItemDefinitions.get(item.type).value;
        score += value;
        // Broadcast item collection event if needed
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
            .setFinished(finished);
            
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
                .setCollected(item.collected));
        }
        
        return builder.build();
    }
}
