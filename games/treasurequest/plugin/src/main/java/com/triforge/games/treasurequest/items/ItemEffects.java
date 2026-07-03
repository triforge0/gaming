package com.triforge.games.treasurequest.items;

import com.triforge.engine.loop.GameLoop;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.content.QuestMap;
import com.triforge.games.treasurequest.state.ExpeditionState;
import com.triforge.protocol.proto.HintReveal;
import com.triforge.protocol.proto.ItemType;

/** Applies item effects and exposes shared tuning constants. */
public final class ItemEffects {

    public static final float SPEED_MULTIPLIER = 1.5f;
    public static final int SPEED_DURATION_SECS = 60;
    public static final int SHIELD_ITEM_DURATION_SECS = 300;

    private ItemEffects() {
    }

    public static void apply(ItemType item, ItemUseContext context) {
        switch (QuestItemType.fromProto(item)) {
            case SHIELD -> applyShield(context.avatar(), context.tick());
            case SPEED -> applySpeed(context.avatar(), context.tick());
            case FAKE_MAP -> context.hintSender().send(context.targetPlayerId(), buildFakeMapHint(context.map()));
            case TREASURE_LOCK -> applyTreasureLock(context.targetExpedition(), context.tick(), context.config());
        }
    }

    public static void applyShield(QuestAvatarComponent avatar, long tick) {
        avatar.grantShieldUntil(tick + durationTicks(SHIELD_ITEM_DURATION_SECS));
        avatar.refreshProtection(tick);
    }

    public static void applySpeed(QuestAvatarComponent avatar, long tick) {
        avatar.grantSpeedUntil(tick + durationTicks(SPEED_DURATION_SECS));
        avatar.refreshSpeed(tick);
    }

    public static void applyTreasureLock(ExpeditionState target, long tick, ExpeditionConfig config) {
        target.grantAccessLockUntil(tick + durationTicks(config.treasureLockSecs()));
        target.refreshAccessLock(tick);
    }

    public static HintReveal buildFakeMapHint(QuestMap map) {
        Checkpoint decoy = map.checkpoints().all().iterator().next();
        int tileSize = map.tileSize();
        return HintReveal.newBuilder()
                .setText("Scout report: head toward " + decoy.id() + " (may be a decoy).")
                .addNextCheckpointIds(decoy.id())
                .setX(decoy.zone().centerWorldX(tileSize))
                .setY(decoy.zone().centerWorldY(tileSize))
                .build();
    }

    private static long durationTicks(int seconds) {
        return (long) seconds * GameLoop.TPS;
    }

    public record ItemUseContext(
            long tick,
            QuestAvatarComponent avatar,
            ExpeditionState targetExpedition,
            long targetPlayerId,
            ExpeditionConfig config,
            QuestMap map,
            HintSender hintSender
    ) {
        @FunctionalInterface
        public interface HintSender {
            void send(long playerId, HintReveal hint);
        }
    }
}
