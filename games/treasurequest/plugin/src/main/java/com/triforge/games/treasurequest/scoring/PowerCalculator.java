package com.triforge.games.treasurequest.scoring;

import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.items.Inventory;
import com.triforge.protocol.proto.ItemType;

/** Computes live Power: weighted knowledge + equipment bonus + combo streak. */
public final class PowerCalculator {

    public static final double MIN_KNOWLEDGE_WEIGHT = 0.50;
    public static final double MAX_KNOWLEDGE_WEIGHT = 0.60;
    public static final int COMBO_POINTS_PER_STREAK = 10;

    private PowerCalculator() {
    }

    public static double knowledgeWeight(ExpeditionConfig config) {
        return Math.clamp(config.powerKnowledgeWeight(), MIN_KNOWLEDGE_WEIGHT, MAX_KNOWLEDGE_WEIGHT);
    }

    public static int knowledgeScore(int rawScore, ExpeditionConfig config) {
        return (int) Math.round(rawScore * knowledgeWeight(config));
    }

    public static int equipmentBonus(Inventory inventory) {
        if (inventory == null) {
            return 0;
        }
        int total = 0;
        total += inventory.count(ItemType.ITEM_SHIELD) * 25;
        total += inventory.count(ItemType.ITEM_SPEED) * 15;
        total += inventory.count(ItemType.ITEM_FAKE_MAP) * 20;
        total += inventory.count(ItemType.ITEM_TREASURE_LOCK) * 30;
        return total;
    }

    public static int comboBonus(int comboStreak) {
        return Math.max(0, comboStreak) * COMBO_POINTS_PER_STREAK;
    }

    public static int compute(int rawScore, Inventory inventory, int comboStreak, ExpeditionConfig config) {
        return knowledgeScore(rawScore, config)
                + equipmentBonus(inventory)
                + comboBonus(comboStreak);
    }
}
