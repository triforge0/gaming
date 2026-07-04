package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;

public class PlacedItem {
    public String id;
    public BugMinerItemType type;
    public float x = 0;
    public float y = 0;
    public boolean collected = false;
    
    public float vx = 0;
    public float vy = 0;
    public boolean moving = false;
    
    public PlacedItem(String id, BugMinerItemType type) {
        this.id = id;
        this.type = type;
        
        // Set moving items
        if (type == BugMinerItemType.BM_ITEM_MOUSE || type == BugMinerItemType.BM_ITEM_PIG) {
            this.moving = true;
            double seed = Math.random() * 1000;
            double speed = 45.0 + (seed % 35.0);
            double angle = ((seed * 47.0) % 360.0) * (Math.PI / 180.0);
            this.vx = (float)(Math.cos(angle) * speed);
            this.vy = (float)(Math.sin(angle) * speed * 0.55);
        }
    }
}
