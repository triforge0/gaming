package com.triforge.games.treasurequest.items;

import com.triforge.engine.loop.GameLoop;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.content.QuestContent;
import com.triforge.games.treasurequest.state.ExpeditionState;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ItemEffectsTest {

    private static final ExpeditionConfig CONFIG = ExpeditionConfig.defaults();

    @Test
    void shieldItemGrantsProtectionUntilExpiry() {
        QuestAvatarComponent avatar = new QuestAvatarComponent(1L, "A", "cp1");
        long grantTick = 100;
        ItemEffects.applyShield(avatar, grantTick);

        avatar.refreshProtection(grantTick);
        assertTrue(avatar.shielded());

        long expiry = grantTick + ItemEffects.SHIELD_ITEM_DURATION_SECS * GameLoop.TPS;
        avatar.refreshProtection(expiry);
        assertTrue(avatar.shielded());

        avatar.refreshProtection(expiry + 1);
        assertFalse(avatar.shielded());
    }

    @Test
    void speedBoostExpiresAndRestoresMultiplier() {
        QuestAvatarComponent avatar = new QuestAvatarComponent(1L, "A", "cp1");
        long grantTick = 50;
        ItemEffects.applySpeed(avatar, grantTick);

        avatar.refreshSpeed(grantTick);
        assertTrue(avatar.speedActive());
        assertTrue(avatar.speedMultiplier() > 1f);

        long expiry = grantTick + ItemEffects.SPEED_DURATION_SECS * GameLoop.TPS;
        avatar.refreshSpeed(expiry + 1);
        assertFalse(avatar.speedActive());
        assertTrue(avatar.speedMultiplier() <= 1f);
    }

    @Test
    void treasureLockBlocksTreasureAccessUntilExpiry() {
        ExpeditionState state = ExpeditionState.start("cp1");
        state.onCheckpointPassed(newBossCheckpoint());

        long grantTick = 200;
        ItemEffects.applyTreasureLock(state, grantTick, CONFIG);
        assertFalse(state.treasureAccessible(grantTick));

        long expiry = grantTick + CONFIG.treasureLockSecs() * (long) GameLoop.TPS;
        state.refreshAccessLock(expiry);
        assertFalse(state.treasureAccessible(expiry));

        state.refreshAccessLock(expiry + 1);
        assertTrue(state.treasureAccessible(expiry + 1));
    }

    @Test
    void inventoryGrantAndConsume() {
        Inventory inventory = Inventory.empty();
        inventory.grant(com.triforge.protocol.proto.ItemType.ITEM_SHIELD, 1);
        assertTrue(inventory.has(com.triforge.protocol.proto.ItemType.ITEM_SHIELD));
        assertTrue(inventory.consume(com.triforge.protocol.proto.ItemType.ITEM_SHIELD));
        assertFalse(inventory.has(com.triforge.protocol.proto.ItemType.ITEM_SHIELD));
    }

    @Test
    void fakeMapHintReferencesDecoyCheckpoint() {
        var hint = ItemEffects.buildFakeMapHint(QuestContent.loadDefault(
                com.triforge.games.treasurequest.content.ContentSource.classpathOnly()).map());
        assertFalse(hint.getText().isBlank());
        assertFalse(hint.getNextCheckpointIdsList().isEmpty());
    }

    private static com.triforge.games.treasurequest.content.Checkpoint newBossCheckpoint() {
        return new com.triforge.games.treasurequest.content.Checkpoint(
                "boss",
                new com.triforge.games.treasurequest.content.Rect(1, 1, 1, 1),
                "qboss",
                java.util.List.of(),
                true,
                com.triforge.games.treasurequest.content.CheckpointRisk.NORMAL,
                "hint",
                com.triforge.games.treasurequest.content.Reward.NONE);
    }
}
