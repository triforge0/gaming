package com.triforge.games.treasurequest.pvp;

import com.triforge.engine.loop.GameLoop;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.ExpeditionConfig;

/** Pairwise proximity scan for PvP encounters (throttled each tick batch). */
public final class EncounterDetector {

    public static final int DEFAULT_SCAN_INTERVAL_TICKS = 30;

    private final double encounterRadiusWorld;
    private final int scanIntervalTicks;
    private long lastScanTick = -1L;

    public EncounterDetector(ExpeditionConfig config, int tileSize) {
        this(config, tileSize, DEFAULT_SCAN_INTERVAL_TICKS);
    }

    EncounterDetector(ExpeditionConfig config, int tileSize, int scanIntervalTicks) {
        if (scanIntervalTicks <= 0) {
            throw new IllegalArgumentException("scanIntervalTicks must be > 0");
        }
        this.encounterRadiusWorld = config.encounterRadiusTiles() * tileSize;
        this.scanIntervalTicks = scanIntervalTicks;
    }

    public double encounterRadiusWorld() {
        return encounterRadiusWorld;
    }

    public boolean shouldScan(long tick) {
        return lastScanTick < 0L || tick - lastScanTick >= scanIntervalTicks;
    }

    public void markScanned(long tick) {
        lastScanTick = tick;
    }

    public boolean withinRadius(float x1, float y1, float x2, float y2) {
        double dx = x1 - x2;
        double dy = y1 - y2;
        double radiusSq = encounterRadiusWorld * encounterRadiusWorld;
        return dx * dx + dy * dy <= radiusSq;
    }

    /** Players in quiz, duel, or under PvP protection cannot enter encounters. */
    public static boolean isEligible(QuestAvatarComponent avatar, boolean inActiveQuiz) {
        if (avatar == null) {
            return false;
        }
        return !inActiveQuiz
                && !avatar.inDuel()
                && !avatar.shielded()
                && !avatar.pvpCooldown()
                && !avatar.stealImmune();
    }

    public static long offerDurationTicks() {
        return 10L * GameLoop.TPS;
    }
}
