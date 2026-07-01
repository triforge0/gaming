package com.triforge.engine.match;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

final class MatchConfigTest {

    @Test
    void withMethodsOverrideSingleField() {
        MatchConfig config = MatchConfig.defaults()
                .withCountdownSeconds(1)
                .withMatchDurationSeconds(5)
                .withScoreboardDelaySeconds(2)
                .withMinPlayers(1)
                .withRequireBalancedTeams(false);

        assertEquals(1, config.countdownSeconds());
        assertEquals(5, config.matchDurationSeconds());
        assertEquals(2, config.scoreboardDelaySeconds());
        assertEquals(1, config.minPlayers());
        assertEquals(false, config.requireBalancedTeams());
    }

    @Test
    void compactConstructorRejectsInvalidValues() {
        assertThrows(IllegalArgumentException.class, () -> MatchConfig.defaults().withMinPlayers(0));
        assertThrows(IllegalArgumentException.class, () -> MatchConfig.defaults().withMatchDurationSeconds(0));
    }
}
