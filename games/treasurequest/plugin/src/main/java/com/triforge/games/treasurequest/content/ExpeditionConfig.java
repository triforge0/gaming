package com.triforge.games.treasurequest.content;

/**
 * Tunable rules for an expedition. Defaults follow the plan's agreed numbers; admin config overrides
 * any field via {@code data/config.json} (see {@link com.triforge.games.treasurequest.content.ConfigLoader}).
 */
public record ExpeditionConfig(
        double encounterRadiusTiles,
        double stealPct,
        int pvpCooldownSecs,
        int stealImmunitySecs,
        int shieldSecs,
        int duelQuestionCount,
        int duelTimeLimitSecs,
        int treasureLockSecs,
        double powerKnowledgeWeight
) {

    public ExpeditionConfig {
        if (encounterRadiusTiles <= 0) {
            throw new IllegalArgumentException("encounterRadiusTiles must be > 0");
        }
        if (stealPct < 0 || stealPct > 1) {
            throw new IllegalArgumentException("stealPct must be in [0,1]");
        }
        if (powerKnowledgeWeight < 0 || powerKnowledgeWeight > 1) {
            throw new IllegalArgumentException("powerKnowledgeWeight must be in [0,1]");
        }
        if (pvpCooldownSecs < 0 || stealImmunitySecs < 0 || shieldSecs < 0 || treasureLockSecs < 0) {
            throw new IllegalArgumentException("durations must be >= 0");
        }
        if (duelQuestionCount <= 0 || duelTimeLimitSecs <= 0) {
            throw new IllegalArgumentException("duel settings must be > 0");
        }
    }

    public static ExpeditionConfig defaults() {
        return new ExpeditionConfig(2.0, 0.20, 300, 1800, 600, 5, 30, 30, 0.55);
    }
}
