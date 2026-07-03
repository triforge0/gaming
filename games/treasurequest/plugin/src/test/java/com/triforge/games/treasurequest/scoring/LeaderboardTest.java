package com.triforge.games.treasurequest.scoring;

import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.items.Inventory;
import com.triforge.protocol.proto.ItemType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LeaderboardTest {

    private static final ExpeditionConfig CONFIG = ExpeditionConfig.defaults();

    @Test
    void ranksByPowerThenCheckpointsThenScore() {
        Inventory shield = Inventory.empty();
        shield.grant(ItemType.ITEM_SHIELD, 1);

        int powerHighKnowledge = PowerCalculator.compute(500, Inventory.empty(), 2, CONFIG);
        int powerMidEquipment = PowerCalculator.compute(400, shield, 0, CONFIG);

        List<Leaderboard.Entry> ranked = Leaderboard.rank(List.of(
                new Leaderboard.PlayerStanding(2L, "Bob", powerMidEquipment, 400, 3),
                new Leaderboard.PlayerStanding(1L, "Alice", powerHighKnowledge, 500, 2)));

        assertEquals(1L, ranked.get(0).playerId());
        assertEquals(1, ranked.get(0).rank());
        assertEquals(2L, ranked.get(1).playerId());
        assertEquals(2, ranked.get(1).rank());
        assertTrue(ranked.get(0).power() > ranked.get(1).power());
    }

    @Test
    void equalPowerUsesCheckpointProgressTieBreak() {
        int sharedPower = PowerCalculator.compute(400, Inventory.empty(), 0, CONFIG);

        List<Leaderboard.Entry> ranked = Leaderboard.rank(List.of(
                new Leaderboard.PlayerStanding(2L, "Bob", sharedPower, 400, 1),
                new Leaderboard.PlayerStanding(1L, "Alice", sharedPower, 400, 3)));

        assertEquals(1L, ranked.get(0).playerId());
        assertEquals(3, ranked.get(0).checkpointsCleared());
        assertEquals(2L, ranked.get(1).playerId());
    }

    @Test
    void orderChangedDetectsRankShifts() {
        List<Leaderboard.Entry> before = Leaderboard.rank(List.of(
                new Leaderboard.PlayerStanding(1L, "Alice", 300, 500, 2),
                new Leaderboard.PlayerStanding(2L, "Bob", 200, 400, 1)));
        List<Leaderboard.Entry> after = Leaderboard.rank(List.of(
                new Leaderboard.PlayerStanding(1L, "Alice", 250, 450, 2),
                new Leaderboard.PlayerStanding(2L, "Bob", 260, 410, 1)));

        assertFalse(Leaderboard.orderChanged(before, before));
        assertTrue(Leaderboard.orderChanged(before, after));
    }
}
