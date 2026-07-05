package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import java.util.List;

/** Slow drift for contested gold/diamond in battle center. */
final class BattleLootDrift {
    private static final float CENTER_X = 200f;

    private BattleLootDrift() {}

    static void applyToLayout(List<PlacedItem> items, SeededRng rng) {
        float midY = (GameConstants.SETUP_MIN_Y + GameConstants.SETUP_MAX_Y) / 2f;
        float midBandMin = GameConstants.SETUP_MIN_Y + (GameConstants.SETUP_MAX_Y - GameConstants.SETUP_MIN_Y) * 0.28f;
        float midBandMax = GameConstants.SETUP_MIN_Y + (GameConstants.SETUP_MAX_Y - GameConstants.SETUP_MIN_Y) * 0.72f;

        for (PlacedItem item : items) {
            if (item.collected || item.x == 0f && item.y == 0f) continue;
            if (!isDriftCandidate(item.type)) continue;
            if (Math.abs(item.x) > CENTER_X) continue;
            if (item.y < midBandMin || item.y > midBandMax) continue;

            boolean enable = item.type == BugMinerItemType.BM_ITEM_DIAMOND || rng.next() < 0.5f;
            if (enable) {
                enableDrift(item, rng);
            }
        }

        ensureMinimumDrift(items, midBandMin, midBandMax);
    }

    private static void ensureMinimumDrift(List<PlacedItem> items, float midBandMin, float midBandMax) {
        boolean hasGold = items.stream().anyMatch(i -> i.type == BugMinerItemType.BM_ITEM_GOLD && i.moving);
        boolean hasDiamond = items.stream().anyMatch(i -> i.type == BugMinerItemType.BM_ITEM_DIAMOND && i.moving);
        SeededRng rng = new SeededRng("drift-min");

        if (!hasGold) {
            for (PlacedItem item : items) {
                if (item.type != BugMinerItemType.BM_ITEM_GOLD || item.collected) continue;
                if (Math.abs(item.x) > CENTER_X || item.y < midBandMin || item.y > midBandMax) continue;
                enableDrift(item, rng);
                break;
            }
        }
        if (!hasDiamond) {
            for (PlacedItem item : items) {
                if (item.type != BugMinerItemType.BM_ITEM_DIAMOND || item.collected) continue;
                if (Math.abs(item.x) > CENTER_X || item.y < midBandMin || item.y > midBandMax) continue;
                enableDrift(item, rng);
                break;
            }
        }
    }

    static void enableDrift(PlacedItem item, SeededRng rng) {
        item.moving = true;
        float speed = 22f + rng.next() * 10f;
        float angle = rng.next() * (float) (Math.PI * 2);
        item.vx = (float) (Math.cos(angle) * speed);
        item.vy = (float) (Math.sin(angle) * speed * 0.45f);
    }

    private static boolean isDriftCandidate(BugMinerItemType type) {
        return type == BugMinerItemType.BM_ITEM_GOLD || type == BugMinerItemType.BM_ITEM_DIAMOND;
    }
}
