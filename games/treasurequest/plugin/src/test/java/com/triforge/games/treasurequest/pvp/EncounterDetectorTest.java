package com.triforge.games.treasurequest.pvp;

import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.ExpeditionConfig;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class EncounterDetectorTest {

    private static final int TILE_SIZE = 32;

    @Test
    void withinRadiusUsesTileScaledDistance() {
        EncounterDetector detector = new EncounterDetector(ExpeditionConfig.defaults(), TILE_SIZE);
        float x = 100f;
        float y = 100f;
        assertTrue(detector.withinRadius(x, y, x + 60f, y));
        assertFalse(detector.withinRadius(x, y, x + 70f, y));
    }

    @Test
    void eligibilityExcludesProtectedStates() {
        QuestAvatarComponent avatar = new QuestAvatarComponent(1L, "A", "cp1");
        assertTrue(EncounterDetector.isEligible(avatar, false));

        avatar.grantShieldUntil(100);
        avatar.refreshProtection(0);
        assertFalse(EncounterDetector.isEligible(avatar, false));

        avatar.grantShieldUntil(0);
        avatar.refreshProtection(0);
        avatar.grantPvpCooldownUntil(100);
        avatar.refreshProtection(0);
        assertFalse(EncounterDetector.isEligible(avatar, false));

        avatar.grantPvpCooldownUntil(0);
        avatar.refreshProtection(0);
        avatar.grantStealImmunityUntil(100);
        avatar.refreshProtection(0);
        assertFalse(EncounterDetector.isEligible(avatar, false));

        avatar.grantStealImmunityUntil(0);
        avatar.refreshProtection(0);
        avatar.setInDuel(true);
        assertFalse(EncounterDetector.isEligible(avatar, false));

        avatar.setInDuel(false);
        assertFalse(EncounterDetector.isEligible(avatar, true));
    }

    @Test
    void scanThrottleSkipsUntilIntervalElapsed() {
        EncounterDetector detector = new EncounterDetector(ExpeditionConfig.defaults(), TILE_SIZE, 10);
        assertTrue(detector.shouldScan(0));
        detector.markScanned(0);
        assertFalse(detector.shouldScan(5));
        assertTrue(detector.shouldScan(10));
    }
}
