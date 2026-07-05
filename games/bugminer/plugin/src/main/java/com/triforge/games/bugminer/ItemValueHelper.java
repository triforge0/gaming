package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;

/** Item value/weight/scale rules (mirrors shared/items.ts + LUAT-CHOI-IN). */
final class ItemValueHelper {
    private static final float[] SIZE_SCALES = {0.75f, 1.0f, 1.35f};

    private ItemValueHelper() {}

    static float pickScale(BugMinerItemType type, String seed) {
        if (type == BugMinerItemType.BM_ITEM_BEDROCK) return 2.2f;
        if (!hasVariableSize(type)) return 1f;
        SeededRng rng = new SeededRng("scale:" + seed);
        float roll = rng.next();
        if (roll < 0.34f) return SIZE_SCALES[0];
        if (roll < 0.67f) return SIZE_SCALES[1];
        return SIZE_SCALES[2];
    }

    static int getValue(BugMinerItemType type, float scale) {
        if (type == BugMinerItemType.BM_ITEM_MOUSE) return -10;
        int base = ItemDefinitions.get(type).value;
        if (!hasVariableSize(type)) return base;
        return Math.round(base * scale * scale);
    }

    static float getWeight(BugMinerItemType type, float scale) {
        float base = ItemDefinitions.get(type).weight;
        if (!hasVariableSize(type)) return base;
        return base * scale * scale * scale;
    }

    static float getRadius(BugMinerItemType type, float scale) {
        return ItemDefinitions.get(type).radius * scale;
    }

    static int resolveMysteryValue() {
        double roll = Math.random();
        if (roll < 0.1) return 500;
        if (roll < 0.3) return 200;
        if (roll < 0.6) return 100;
        return 50;
    }

    private static boolean hasVariableSize(BugMinerItemType type) {
        return type == BugMinerItemType.BM_ITEM_GOLD
                || type == BugMinerItemType.BM_ITEM_BIG_GOLD
                || type == BugMinerItemType.BM_ITEM_DIAMOND
                || type == BugMinerItemType.BM_ITEM_ROCK;
    }
}
