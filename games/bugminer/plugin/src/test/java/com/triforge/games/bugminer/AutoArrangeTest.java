package com.triforge.games.bugminer;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

final class AutoArrangeTest {

    @Test
    void freeModeAutoArrangeKeepsItemsInsideSetupZone() {
        ChallengeInstance challenge = new ChallengeInstance(1L, 2L, "chaos-mine");
        assertTrue(challenge.autoArrange(2L));

        for (PlacedItem item : challenge.copyItemsLayout()) {
            assertTrue(item.x >= GameConstants.SETUP_MIN_X && item.x <= GameConstants.SETUP_MAX_X,
                    "item x out of bounds: " + item.x);
            assertTrue(item.y >= GameConstants.SETUP_MIN_Y && item.y <= GameConstants.SETUP_MAX_Y,
                    "item y out of bounds: " + item.y);
            assertTrue(item.y >= GameConstants.SETUP_MIN_Y + 4f,
                    "item too close to hook: " + item.y);
        }
    }
}
