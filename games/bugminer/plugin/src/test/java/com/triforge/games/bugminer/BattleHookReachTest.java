package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import com.triforge.protocol.proto.BugMinerItemType;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class BattleHookReachTest {

    private static final BattleHookAnchor ANCHOR_A =
            new BattleHookAnchor(GameConstants.BATTLE_MINER_A, false);

    @Test
    void battleHookReachesOpponentHalf() {
        HookPhysics.HookData hook = HookPhysics.createInitialHook();
        hook.angle = 1.05f;
        hook.state = BugMinerHookState.BM_HOOK_EXTENDING;

        for (int i = 0; i < 200; i++) {
            HookPhysics.updateExtend(hook, 0.05f, GameConstants.BATTLE_HOOK_MAX_LENGTH);
        }

        Vec2 tip = HookPhysics.getHookTipAt(ANCHOR_A, hook);
        assertTrue(tip.x > 0f, "player A hook should cross into opponent half, tip.x=" + tip.x);
        assertTrue(tip.y >= GameConstants.SETUP_MIN_Y, "tip should reach item zone");
    }

    @Test
    void maxLengthAutoRetractsInBattle() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "REACH1");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);
        arena.fireHook(1L);

        var hook = arena.toProto().getHookA();
        assertEquals(BugMinerHookState.BM_HOOK_EXTENDING, hook.getState());

        for (int i = 0; i < 300; i++) {
            arena.tick(0.05f, true);
            var state = arena.toProto().getHookA();
            if (state.getState() == BugMinerHookState.BM_HOOK_RETRACTING) {
                assertTrue(state.getLength() <= GameConstants.BATTLE_HOOK_MAX_LENGTH + 1f);
                return;
            }
        }
        assertEquals(
                BugMinerHookState.BM_HOOK_RETRACTING,
                arena.toProto().getHookA().getState(),
                "hook must retract after full extension");
    }

    @Test
    void bedrockBouncesWithoutAttaching() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "BED1");
        PlacedItem bedrock = layout.stream()
                .filter(i -> i.type == BugMinerItemType.BM_ITEM_BEDROCK)
                .findFirst()
                .orElseThrow();

        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);
        float targetAngle = (float) Math.atan2(
                bedrock.x - GameConstants.BATTLE_MINER_A.x,
                bedrock.y);

        for (int i = 0; i < 500; i++) {
            arena.tick(0.05f, true);
            var hook = arena.toProto().getHookA();
            if (Math.abs(hook.getAngle() - targetAngle) < 0.12f
                    && hook.getState() == BugMinerHookState.BM_HOOK_SWINGING) {
                arena.fireHook(1L);
                break;
            }
        }

        for (int i = 0; i < 120; i++) {
            arena.tick(0.05f, true);
            var hook = arena.toProto().getHookA();
            if (hook.getState() == BugMinerHookState.BM_HOOK_RETRACTING) {
                assertFalse(hook.hasAttachedItemId(), "bedrock must not attach to hook");
                return;
            }
        }
        assertFalse(arena.toProto().getHookA().hasAttachedItemId());
    }
}
