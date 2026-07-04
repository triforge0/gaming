package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerItemType;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** Placement validation and fair/battle map generation (mirrors shared placement + fair/battle map). */
final class MapLayoutEngine {
    private static final float ITEM_GAP = 2f;

    private MapLayoutEngine() {}

    static boolean isValidPlacement(String itemId, float x, float y, List<PlacedItem> items) {
        if (x < GameConstants.SETUP_MIN_X || x > GameConstants.SETUP_MAX_X
                || y < GameConstants.SETUP_MIN_Y || y > GameConstants.SETUP_MAX_Y) {
            return false;
        }
        PlacedItem item = findItem(itemId, items);
        if (item == null) return false;
        float radius = ItemDefinitions.get(item.type).radius;
        for (PlacedItem other : items) {
            if (other.id.equals(itemId) || other.collected) continue;
            if (other.x == 0f && other.y == 0f) continue;
            float otherRadius = ItemDefinitions.get(other.type).radius;
            float dx = x - other.x;
            float dy = y - other.y;
            if (Math.hypot(dx, dy) < radius + otherRadius + ITEM_GAP) return false;
        }
        return true;
    }

    static List<PlacedItem> buildFairLayout(String levelId, String roomSeed) {
        for (int attempt = 0; attempt < 16; attempt++) {
            SeededRng rng = new SeededRng("fair:" + roomSeed + ":" + levelId + ":" + attempt);
            ChallengeInstance temp = new ChallengeInstance(1, 2, levelId);
            List<PlacedItem> items = new ArrayList<>(temp.copyItemsLayout());
            if (arrangeFairInPlace(items, rng)) {
                return copyLayout(items);
            }
        }
        return new ChallengeInstance(1, 2, levelId).copyItemsLayout();
    }

    static List<PlacedItem> buildBattleLayout(String levelId, String roomSeed) {
        for (int attempt = 0; attempt < 12; attempt++) {
            SeededRng rng = new SeededRng("battle:" + roomSeed + ":" + levelId + ":" + attempt);
            ChallengeInstance temp = new ChallengeInstance(1, 2, levelId);
            List<PlacedItem> items = new ArrayList<>(temp.copyItemsLayout());
            if (arrangeBattleInPlace(items, rng)) {
                return copyLayout(items);
            }
        }
        return new ChallengeInstance(1, 2, levelId).copyItemsLayout();
    }

    private static boolean arrangeFairInPlace(List<PlacedItem> items, SeededRng rng) {
        resetPositions(items);
        List<PlacedItem> jackpots = new ArrayList<>();
        List<PlacedItem> guards = new ArrayList<>();
        List<PlacedItem> rest = new ArrayList<>();
        for (PlacedItem item : items) {
            if (isJackpot(item.type)) jackpots.add(item);
            else if (isGuard(item.type)) guards.add(item);
            else rest.add(item);
        }
        jackpots.sort(Comparator.comparingInt(MapLayoutEngine::jackpotPriority).reversed());

        List<Vec2> anchors = new ArrayList<>();
        List<Vec2> deepCandidates = deepJackpotCandidates();
        for (PlacedItem jackpot : jackpots) {
            if (!tryCandidates(jackpot, deepCandidates, items)) {
                System.out.println("Failed to place jackpot: " + jackpot.type);
                return false;
            }
            anchors.add(new Vec2(jackpot.x, jackpot.y));
        }

        shuffle(guards, rng);
        placeGuardsNearAnchors(guards, anchors, items, rng);
        rest.addAll(guards);

        return placeInterleaved(rest, items, rng, 0);
    }

    private static boolean arrangeBattleInPlace(List<PlacedItem> items, SeededRng rng) {
        resetPositions(items);
        List<PlacedItem> jackpots = new ArrayList<>();
        List<PlacedItem> rest = new ArrayList<>();
        for (PlacedItem item : items) {
            if (isJackpot(item.type)) jackpots.add(item);
            else rest.add(item);
        }
        jackpots.sort(Comparator.comparingInt(MapLayoutEngine::jackpotPriority).reversed());

        float midY = (GameConstants.SETUP_MIN_Y + GameConstants.SETUP_MAX_Y) / 2f;
        List<Vec2> centerCandidates = centerJackpotCandidates(midY);
        for (PlacedItem jackpot : jackpots) {
            if (!tryCandidates(jackpot, centerCandidates, items)
                    && !tryRandomInBand(jackpot, midY - 55f, midY + 55f, items, rng)) {
                return false;
            }
        }
        return placeInterleaved(rest, items, rng, 3);
    }

    private static <T> void shuffle(List<T> list, SeededRng rng) {
        for (int i = list.size() - 1; i > 0; i--) {
            int j = (int) (rng.next() * (i + 1));
            T temp = list.get(i);
            list.set(i, list.get(j));
            list.set(j, temp);
        }
    }

    private static void placeGuardsNearAnchors(
            List<PlacedItem> guards, List<Vec2> anchors, List<PlacedItem> items, SeededRng rng) {
        int placed = 0;
        int budget = Math.min(guards.size(), Math.max(2, anchors.size() * 3));
        for (Vec2 anchor : anchors) {
            if (placed >= budget || guards.isEmpty()) break;
            for (int attempt = 0; attempt < 12 && placed < budget && !guards.isEmpty(); attempt++) {
                float angle = rng.next() * (float) (Math.PI * 2);
                float radius = 42f + rng.next() * 50f;
                PlacedItem guard = guards.get(0);
                float x = anchor.x + (float) Math.cos(angle) * radius;
                float y = anchor.y + (float) Math.sin(angle) * radius;
                if (isValidPlacement(guard.id, x, y, items)) {
                    guard.x = x;
                    guard.y = y;
                    guards.remove(0);
                    placed++;
                }
            }
        }
    }

    private static boolean placeInterleaved(
            List<PlacedItem> pool, List<PlacedItem> items, SeededRng rng, int gridOffset) {
        if (pool.isEmpty()) return true;
        for (PlacedItem item : pool) {
            item.x = 0;
            item.y = 0;
        }
        shuffle(pool, rng);
        List<Vec2> grid = mixedGridCandidates(rng);
        int slot = gridOffset % grid.size();
        for (PlacedItem item : pool) {
            if (!tryPlaceInGrid(item, grid, slot, items, rng)) {
                System.out.println("Failed to place item: " + item.type + " (id=" + item.id + ") after all attempts.");
                return false;
            }
            slot = (slot + 2) % grid.size();
        }
        return true;
    }

    private static boolean tryPlaceInGrid(
            PlacedItem item, List<Vec2> grid, int startSlot, List<PlacedItem> items, SeededRng rng) {
        for (int i = 0; i < grid.size(); i++) {
            Vec2 pos = grid.get((startSlot + i) % grid.size());
            if (isValidPlacement(item.id, pos.x, pos.y, items)) {
                item.x = pos.x;
                item.y = pos.y;
                return true;
            }
        }
        float[] band = depthBand(depthFor(item.type));
        return tryRandomInBand(item, band[0], band[1], items, rng);
    }

    private static boolean tryCandidates(PlacedItem item, List<Vec2> candidates, List<PlacedItem> items) {
        for (Vec2 pos : candidates) {
            if (isValidPlacement(item.id, pos.x, pos.y, items)) {
                item.x = pos.x;
                item.y = pos.y;
                return true;
            }
        }
        return false;
    }

    private static boolean tryRandomInBand(
            PlacedItem item, float minY, float maxY, List<PlacedItem> items, SeededRng rng) {
        for (int i = 0; i < 300; i++) {
            float x = GameConstants.SETUP_MIN_X + rng.next() * (GameConstants.SETUP_MAX_X - GameConstants.SETUP_MIN_X);
            float y = minY + rng.next() * (maxY - minY);
            if (isValidPlacement(item.id, x, y, items)) {
                item.x = x;
                item.y = y;
                return true;
            }
        }
        return false;
    }

    private static List<Vec2> deepJackpotCandidates() {
        float deepMin = GameConstants.SETUP_MIN_Y + (GameConstants.SETUP_MAX_Y - GameConstants.SETUP_MIN_Y) * 0.62f;
        float deepMax = GameConstants.SETUP_MAX_Y - 12f;
        List<Vec2> candidates = new ArrayList<>();
        for (int row = 0; row < 5; row++) {
            for (int col = 0; col < 15; col++) {
                float tx = col / 14f;
                float ty = 0.5f + (row / 4f) * 0.5f;
                candidates.add(new Vec2(
                        GameConstants.SETUP_MIN_X + 32f + tx * (GameConstants.SETUP_MAX_X - GameConstants.SETUP_MIN_X - 64f),
                        deepMin + ty * (deepMax - deepMin - 12f)));
            }
        }
        candidates.sort((a, b) -> {
            if (b.y != a.y) return Float.compare(b.y, a.y);
            return Float.compare(Math.abs(a.x), Math.abs(b.x));
        });
        return candidates;
    }

    private static List<Vec2> centerJackpotCandidates(float midY) {
        List<Vec2> candidates = new ArrayList<>();
        for (int row = 0; row < 4; row++) {
            for (int col = 0; col < 7; col++) {
                float tx = (col / 6f) * 2f - 1f;
                float ty = (row / 3f) * 2f - 1f;
                candidates.add(new Vec2(tx * 140f, midY + ty * 48f));
            }
        }
        candidates.sort(Comparator.comparingDouble(
                p -> p.x * p.x + (p.y - midY) * (p.y - midY)));
        return candidates;
    }

    private static List<Vec2> mixedGridCandidates(SeededRng rng) {
        List<Vec2> candidates = new ArrayList<>();
        int cols = 16;
        float colSpacing = 72f;
        float rowSpacing = 44f;
        float startX = GameConstants.SETUP_MIN_X + 24f;
        float startY = GameConstants.SETUP_MIN_Y + 6f;
        for (int row = 0; row < 12; row++) {
            for (int col = 0; col < cols; col++) {
                float x = startX + col * colSpacing;
                float y = startY + row * rowSpacing;
                if (x <= GameConstants.SETUP_MAX_X - 20f && y <= GameConstants.SETUP_MAX_Y - 20f) {
                    candidates.add(new Vec2(x, y));
                }
            }
        }
        shuffle(candidates, rng);
        return candidates;
    }

    private static float[] depthBand(String depth) {
        float span = GameConstants.SETUP_MAX_Y - GameConstants.SETUP_MIN_Y;
        float shallowEnd = GameConstants.SETUP_MIN_Y + span * 0.3f;
        float midEnd = GameConstants.SETUP_MIN_Y + span * 0.62f;
        return switch (depth) {
            case "shallow" -> new float[] { GameConstants.SETUP_MIN_Y, shallowEnd };
            case "mid" -> new float[] { shallowEnd, midEnd };
            default -> new float[] { midEnd, GameConstants.SETUP_MAX_Y };
        };
    }

    private static String depthFor(BugMinerItemType type) {
        return switch (type) {
            case BM_ITEM_DIAMOND, BM_ITEM_STRENGTH_DRINK -> "shallow";
            case BM_ITEM_GOLD, BM_ITEM_MYSTERY_BAG, BM_ITEM_POISON, BM_ITEM_MOUSE, BM_ITEM_PIG -> "mid";
            default -> "deep";
        };
    }

    private static boolean isJackpot(BugMinerItemType type) {
        return type == BugMinerItemType.BM_ITEM_BIG_GOLD
                || type == BugMinerItemType.BM_ITEM_DIAMOND
                || type == BugMinerItemType.BM_ITEM_MYSTERY_BAG;
    }

    private static boolean isGuard(BugMinerItemType type) {
        return type == BugMinerItemType.BM_ITEM_POISON
                || type == BugMinerItemType.BM_ITEM_ROCK;
    }

    private static int jackpotPriority(PlacedItem item) {
        ItemDefinition def = ItemDefinitions.get(item.type);
        int typeRank = switch (item.type) {
            case BM_ITEM_BIG_GOLD -> 300;
            case BM_ITEM_DIAMOND -> 200;
            case BM_ITEM_MYSTERY_BAG -> 150;
            default -> 0;
        };
        return typeRank + def.value;
    }

    private static void resetPositions(List<PlacedItem> items) {
        for (PlacedItem item : items) {
            item.x = 0;
            item.y = 0;
        }
    }

    private static PlacedItem findItem(String id, List<PlacedItem> items) {
        for (PlacedItem item : items) {
            if (item.id.equals(id)) return item;
        }
        return null;
    }

    private static List<PlacedItem> copyLayout(List<PlacedItem> items) {
        List<PlacedItem> copies = new ArrayList<>();
        for (PlacedItem src : items) {
            PlacedItem copy = new PlacedItem(src.id, src.type);
            copy.x = src.x;
            copy.y = src.y;
            copy.moving = src.moving;
            copy.vx = src.vx;
            copy.vy = src.vy;
            copy.scale = src.scale;
            copies.add(copy);
        }
        return copies;
    }
}
