package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

final class BattleArenaTest {

    @Test
    void startsBattleWithSharedLayoutAndDualHooks() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "ARENA1");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);
        var state = arena.toProto();

        assertTrue(state.getItemsCount() > 0);
        assertEquals(BugMinerHookState.BM_HOOK_SWINGING, state.getHookA().getState());
        assertEquals(BugMinerHookState.BM_HOOK_SWINGING, state.getHookB().getState());
        assertEquals(0, state.getScoreA());
        assertEquals(0, state.getScoreB());
    }

    @Test
    void bothPlayersCanFireHooksIndependently() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "FIRE");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);

        assertTrue(arena.fireHook(1L));
        assertTrue(arena.fireHook(2L));
        assertFalse(arena.fireHook(1L));

        var state = arena.toProto();
        assertEquals(BugMinerHookState.BM_HOOK_EXTENDING, state.getHookA().getState());
        assertEquals(BugMinerHookState.BM_HOOK_EXTENDING, state.getHookB().getState());
    }

    @Test
    void tickAdvancesHooksWithoutCrashing() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "TICK");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);
        arena.fireHook(1L);
        for (int i = 0; i < 60; i++) {
            arena.tick(1f / 60f, true);
        }
        assertFalse(arena.isFinished());
    }
}
