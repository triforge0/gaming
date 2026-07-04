package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import java.util.HashMap;
import java.util.Map;

public class ItemDefinitions {
    private static final Map<BugMinerItemType, ItemDefinition> DEFINITIONS = new HashMap<>();

    static {
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_BIG_GOLD, new ItemDefinition(500, 3.0f, 40f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_GOLD, new ItemDefinition(250, 2.0f, 25f));
        // We can use diamond as well if you want
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_ROCK, new ItemDefinition(20, 5.0f, 40f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_MYSTERY_BAG, new ItemDefinition(0, 1.0f, 20f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_POISON, new ItemDefinition(-100, 1.0f, 20f));
    }

    public static ItemDefinition get(BugMinerItemType type) {
        return DEFINITIONS.getOrDefault(type, new ItemDefinition(0, 1.0f, 10f));
    }
}
