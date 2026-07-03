package com.triforge.games.treasurequest.scoring;

import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.items.Inventory;
import com.triforge.protocol.proto.ItemType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class PowerCalculatorTest {

    @Test
    void knowledgeWeightClampedToFiftyToSixtyPercent() {
        ExpeditionConfig low = withWeight(0.10);
        ExpeditionConfig high = withWeight(0.90);
        ExpeditionConfig mid = withWeight(0.55);

        assertEquals(0.50, PowerCalculator.knowledgeWeight(low));
        assertEquals(0.60, PowerCalculator.knowledgeWeight(high));
        assertEquals(0.55, PowerCalculator.knowledgeWeight(mid));
    }

    @Test
    void equipmentAndComboIncreasePower() {
        ExpeditionConfig config = ExpeditionConfig.defaults();
        Inventory inventory = Inventory.empty();
        inventory.grant(ItemType.ITEM_SHIELD, 1);

        int base = PowerCalculator.compute(200, Inventory.empty(), 0, config);
        int boosted = PowerCalculator.compute(200, inventory, 2, config);

        assertEquals(PowerCalculator.knowledgeScore(200, config), base);
        assertEquals(base + 25 + 20, boosted);
    }

    @Test
    void comboResetsDoNotAddNegativeBonus() {
        assertEquals(0, PowerCalculator.comboBonus(0));
        assertEquals(10, PowerCalculator.comboBonus(1));
    }

    private static ExpeditionConfig withWeight(double weight) {
        ExpeditionConfig d = ExpeditionConfig.defaults();
        return new ExpeditionConfig(
                d.encounterRadiusTiles(),
                d.stealPct(),
                d.pvpCooldownSecs(),
                d.stealImmunitySecs(),
                d.shieldSecs(),
                d.duelQuestionCount(),
                d.duelTimeLimitSecs(),
                d.treasureLockSecs(),
                weight);
    }
}
