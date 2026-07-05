package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import java.util.HashMap;
import java.util.Map;

public class ItemDefinitions {
    private static final Map<BugMinerItemType, ItemDefinition> DEFINITIONS = new HashMap<>();

    static {
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_GOLD, new ItemDefinition(50, 1.0f, 18f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_BIG_GOLD, new ItemDefinition(150, 2.5f, 28f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_DIAMOND, new ItemDefinition(300, 0.8f, 16f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_ROCK, new ItemDefinition(10, 4.0f, 26f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_MYSTERY_BAG, new ItemDefinition(0, 1.5f, 20f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_POISON, new ItemDefinition(0, 1.0f, 20f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_MOUSE, new ItemDefinition(40, 0.6f, 14f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_PIG, new ItemDefinition(120, 2.2f, 22f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_STRENGTH_DRINK, new ItemDefinition(0, 0.5f, 16f));
        DEFINITIONS.put(BugMinerItemType.BM_ITEM_BEDROCK, new ItemDefinition(0, 14.0f, 38f));
    }

    public static ItemDefinition get(BugMinerItemType type) {
        return DEFINITIONS.getOrDefault(type, new ItemDefinition(0, 1.0f, 10f));
    }
}
