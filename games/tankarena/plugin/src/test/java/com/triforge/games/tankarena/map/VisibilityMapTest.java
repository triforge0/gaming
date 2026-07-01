package com.triforge.games.tankarena.map;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class VisibilityMapTest {

    @Test
    void beginFrameDemotesVisibleToSeen() {
        VisibilityMap map = new VisibilityMap(4, 4);
        map.setVisible(1, 1);
        map.setVisible(2, 2);
        map.beginFrame();

        assertEquals(FogVisibility.SEEN, map.cellAt(1, 1));
        assertEquals(FogVisibility.SEEN, map.cellAt(2, 2));
        assertTrue(map.isDirty());
    }

    @Test
    void netChangeIgnoresPerTickChurn() {
        VisibilityMap map = new VisibilityMap(4, 4);
        assertTrue(map.hasChangedSinceLastSent(), "never-sent map must be considered changed");

        map.setVisible(1, 1);
        map.markSent();
        assertFalse(map.hasChangedSinceLastSent(), "no change since the mask was sent");

        // Stationary player: VISIBLE -> SEEN -> VISIBLE leaves the mask identical to lastSent.
        map.beginFrame();
        map.setVisible(1, 1);
        assertFalse(map.hasChangedSinceLastSent(), "churn back to the same mask must not resend");

        // A genuinely new visible tile is a real change.
        map.setVisible(2, 2);
        assertTrue(map.hasChangedSinceLastSent());
    }
}
