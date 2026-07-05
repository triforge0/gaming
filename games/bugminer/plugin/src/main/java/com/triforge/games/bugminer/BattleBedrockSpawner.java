package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** Injects strategic bedrock obstacles into battle maps only. */
final class BattleBedrockSpawner {
    private BattleBedrockSpawner() {}

    static void injectIntoLayout(List<PlacedItem> items, String roomSeed, String levelId) {
        SeededRng rng = new SeededRng("bedrock:" + roomSeed + ":" + levelId);
        int count = 2 + (int) (rng.next() * 2f); // 2-3 bedrock
        float midY = (GameConstants.SETUP_MIN_Y + GameConstants.SETUP_MAX_Y) / 2f;

        List<PlacedItem> bedrocks = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            PlacedItem bedrock = new PlacedItem("bedrock-" + UUID.randomUUID(), BugMinerItemType.BM_ITEM_BEDROCK);
            bedrock.scale = 2.2f;
            items.add(bedrock);
            bedrocks.add(bedrock);
        }

        for (PlacedItem bedrock : bedrocks) {
            boolean placed = false;
            for (int attempt = 0; attempt < 80 && !placed; attempt++) {
                float x = (rng.next() - 0.5f) * 200f;
                float y = midY + (rng.next() - 0.5f) * 80f;
                if (MapLayoutEngine.isValidPlacement(bedrock.id, x, y, items)) {
                    bedrock.x = x;
                    bedrock.y = y;
                    placed = true;
                }
            }
            if (!placed) {
                bedrock.x = (rng.next() - 0.5f) * 100f;
                bedrock.y = midY;
            }
        }
    }
}
