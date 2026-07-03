package com.triforge.games.treasurequest.components;

import com.triforge.engine.ecs.Component;
import com.triforge.games.treasurequest.items.ItemEffects;

import java.util.Objects;

/** Per-avatar quest state carried in ECS and mirrored to {@code QuestAvatarComponentProto}. */
public final class QuestAvatarComponent implements Component {
    private final long playerId;
    private String name;
    private int score;
    private String currentCheckpoint;
    private int checkpointsCleared;
    private boolean shielded;
    private boolean pvpCooldown;
    private boolean stealImmune;
    private boolean inDuel;

    private long shieldUntilTick;
    private long pvpCooldownUntilTick;
    private long stealImmuneUntilTick;
    private long speedUntilTick;

    public static final float BASE_SPEED_MULTIPLIER = 1f;

    public QuestAvatarComponent(long playerId, String name, String startCheckpoint) {
        this.playerId = playerId;
        this.name = Objects.requireNonNull(name, "name");
        this.currentCheckpoint = Objects.requireNonNull(startCheckpoint, "startCheckpoint");
    }

    public long playerId() {
        return playerId;
    }

    public String name() {
        return name;
    }

    public int score() {
        return score;
    }

    public String currentCheckpoint() {
        return currentCheckpoint;
    }

    public int checkpointsCleared() {
        return checkpointsCleared;
    }

    public boolean shielded() {
        return shielded;
    }

    public boolean pvpCooldown() {
        return pvpCooldown;
    }

    public boolean stealImmune() {
        return stealImmune;
    }

    public boolean inDuel() {
        return inDuel;
    }

    long shieldUntilTick() {
        return shieldUntilTick;
    }

    long pvpCooldownUntilTick() {
        return pvpCooldownUntilTick;
    }

    long stealImmuneUntilTick() {
        return stealImmuneUntilTick;
    }

    long speedUntilTick() {
        return speedUntilTick;
    }

    public float speedMultiplier() {
        return speedActive() ? ItemEffects.SPEED_MULTIPLIER : BASE_SPEED_MULTIPLIER;
    }

    public boolean speedActive() {
        return speedUntilTick > 0;
    }

    public void grantSpeedUntil(long untilTick) {
        if (untilTick <= 0) {
            speedUntilTick = 0;
            return;
        }
        speedUntilTick = Math.max(speedUntilTick, untilTick);
    }

    public void refreshSpeed(long tick) {
        if (speedUntilTick > 0 && tick > speedUntilTick) {
            speedUntilTick = 0;
        }
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setCurrentCheckpoint(String currentCheckpoint) {
        this.currentCheckpoint = Objects.requireNonNull(currentCheckpoint, "currentCheckpoint");
    }

    public void setCheckpointsCleared(int checkpointsCleared) {
        this.checkpointsCleared = checkpointsCleared;
    }

    public void setInDuel(boolean inDuel) {
        this.inDuel = inDuel;
    }

    public void grantShieldUntil(long untilTick) {
        if (untilTick <= 0) {
            shieldUntilTick = 0;
            return;
        }
        shieldUntilTick = Math.max(shieldUntilTick, untilTick);
    }

    public void grantPvpCooldownUntil(long untilTick) {
        if (untilTick <= 0) {
            pvpCooldownUntilTick = 0;
            return;
        }
        pvpCooldownUntilTick = Math.max(pvpCooldownUntilTick, untilTick);
    }

    public void grantStealImmunityUntil(long untilTick) {
        if (untilTick <= 0) {
            stealImmuneUntilTick = 0;
            return;
        }
        stealImmuneUntilTick = Math.max(stealImmuneUntilTick, untilTick);
    }

    /** Recomputes wire-visible flags from absolute tick deadlines and clears expired timers. */
    public void refreshProtection(long tick) {
        shielded = shieldUntilTick > 0 && tick <= shieldUntilTick;
        pvpCooldown = pvpCooldownUntilTick > 0 && tick <= pvpCooldownUntilTick;
        stealImmune = stealImmuneUntilTick > 0 && tick <= stealImmuneUntilTick;
        refreshSpeed(tick);

        if (shieldUntilTick > 0 && tick > shieldUntilTick) {
            shieldUntilTick = 0;
        }
        if (pvpCooldownUntilTick > 0 && tick > pvpCooldownUntilTick) {
            pvpCooldownUntilTick = 0;
        }
        if (stealImmuneUntilTick > 0 && tick > stealImmuneUntilTick) {
            stealImmuneUntilTick = 0;
        }
    }
}
