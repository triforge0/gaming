package com.triforge.games.treasurequest.pvp;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class DuelScorerTest {

    @Test
    void stealMathAtTwentyPercent() {
        DuelScorer.Outcome outcome = DuelScorer.resolve(1L, 2L, 5, 2, 500, 400, 0, 0, 0.20);
        assertEquals(1L, outcome.winnerPlayerId());
        assertEquals(80, outcome.stealAmount());
        assertEquals(80, outcome.lowerScoreDelta());
        assertEquals(-80, outcome.higherScoreDelta());
    }

    @Test
    void equalCorrectCountsIsTieWithNoTransfer() {
        DuelScorer.Outcome outcome = DuelScorer.resolve(1L, 2L, 3, 3, 500, 400, 100, 100, 0.20);
        assertTrue(outcome.tie());
        assertEquals(0L, outcome.winnerPlayerId());
        assertEquals(0, outcome.lowerScoreDelta());
        assertEquals(0, outcome.higherScoreDelta());
    }

    @Test
    void equalCorrectCountsUsesHigherPowerAsTieBreak() {
        DuelScorer.Outcome outcome = DuelScorer.resolve(1L, 2L, 3, 3, 500, 400, 150, 100, 0.20);
        assertEquals(1L, outcome.winnerPlayerId());
        assertFalse(outcome.tie());
        assertEquals(80, outcome.stealAmount());
    }
}
