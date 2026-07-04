package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;

public class PlacedItem {
    public String id;
    public BugMinerItemType type;
    public float x = 0;
    public float y = 0;
    public boolean collected = false;
    
    public PlacedItem(String id, BugMinerItemType type) {
        this.id = id;
        this.type = type;
    }
}
