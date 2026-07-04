package com.triforge.games.bugminer;

/** Lobby fair/battle mode settings (mirrors TS FairModeConfig). */
public final class FairModeConfig {
    public boolean enabled;
    public boolean battle;
    public String levelId;
    public int timeLimit;

    public FairModeConfig() {
        this.enabled = false;
        this.battle = false;
        this.levelId = "easy-mine";
        this.timeLimit = 90;
    }

    public FairModeConfig copy() {
        FairModeConfig c = new FairModeConfig();
        c.enabled = enabled;
        c.battle = battle;
        c.levelId = levelId;
        c.timeLimit = timeLimit;
        return c;
    }

    public void applyPartial(Boolean enabled, Boolean battle, String levelId, Integer timeLimit) {
        if (enabled != null) {
            this.enabled = enabled;
            if (!enabled) this.battle = false;
        }
        if (battle != null) {
            this.battle = battle;
            if (battle) this.enabled = true;
            else if (this.enabled) this.battle = false;
        }
        if (levelId != null) {
            this.levelId = levelId;
            this.timeLimit = LevelCatalog.timeLimit(levelId);
        }
        if (timeLimit != null) {
            this.timeLimit = Math.max(30, Math.min(300, timeLimit));
        }
    }
}
