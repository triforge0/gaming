package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

final class ItemValueHelperTest {

    @Test
    void mousePenalizesTenPointsPerRules() {
        assertEquals(-10, ItemValueHelper.getValue(BugMinerItemType.BM_ITEM_MOUSE, 1f));
    }

    @Test
    void variableSizeScalesGoldValue() {
        int small = ItemValueHelper.getValue(BugMinerItemType.BM_ITEM_GOLD, 0.75f);
        int large = ItemValueHelper.getValue(BugMinerItemType.BM_ITEM_GOLD, 1.35f);
        assertTrue(large > small);
    }

    @Test
    void mysteryValueWithinRulesRange() {
        for (int i = 0; i < 20; i++) {
            int value = ItemValueHelper.resolveMysteryValue();
            assertTrue(value >= 50 && value <= 500);
        }
    }
}
