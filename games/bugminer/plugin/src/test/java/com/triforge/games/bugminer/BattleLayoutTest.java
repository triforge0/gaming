package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

final class BattleLayoutTest {

    @Test
    void battleLayoutIncludesCenterBedrock() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "LAYOUT1");
        long bedrockCount = layout.stream()
                .filter(i -> i.type == BugMinerItemType.BM_ITEM_BEDROCK)
                .count();
        assertTrue(bedrockCount >= 2 && bedrockCount <= 3);

        float midY = (GameConstants.SETUP_MIN_Y + GameConstants.SETUP_MAX_Y) / 2f;
        for (PlacedItem bedrock : layout) {
            if (bedrock.type != BugMinerItemType.BM_ITEM_BEDROCK) continue;
            assertTrue(Math.abs(bedrock.x) <= 120f, "bedrock should be near center x");
            assertTrue(Math.abs(bedrock.y - midY) <= 60f, "bedrock should be near center y");
            assertEquals(2.2f, bedrock.scale, 0.01f);
            assertTrue(bedrock.y >= GameConstants.SETUP_MIN_Y);
            assertTrue(bedrock.y <= GameConstants.SETUP_MAX_Y);
        }
    }

    @Test
    void battleLayoutDriftsCenterGoldAndDiamond() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("chaos-mine", "DRIFT1");
        boolean hasDriftingGold = layout.stream()
                .anyMatch(i -> i.type == BugMinerItemType.BM_ITEM_GOLD && i.moving);
        boolean hasDriftingDiamond = layout.stream()
                .anyMatch(i -> i.type == BugMinerItemType.BM_ITEM_DIAMOND && i.moving);
        assertTrue(hasDriftingGold, "expected drifting gold in center");
        assertTrue(hasDriftingDiamond, "expected drifting diamond in center");
    }
}
