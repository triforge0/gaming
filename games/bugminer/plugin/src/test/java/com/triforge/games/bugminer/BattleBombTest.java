package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import com.triforge.protocol.proto.BugMinerItemType;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

final class BattleBombTest {

    @Test
    void throwBombRespectsCooldownAndHookState() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "BOMB1");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);
        arena.creditScore('A', 200);
        arena.creditScore('B', 200);

        assertTrue(arena.throwBomb(1L));
        assertFalse(arena.throwBomb(1L));

        arena.fireHook(1L);
        assertFalse(arena.throwBomb(1L));
        assertTrue(arena.throwBomb(2L));
    }

    @Test
    void throwBombCosts100Points() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "COST1");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);

        assertFalse(arena.throwBomb(1L));

        arena.creditScore('A', 150);
        assertTrue(arena.throwBomb(1L));
        assertEquals(50, arena.toProto().getScoreA());

        arena.creditScore('A', 40);
        assertFalse(arena.throwBomb(1L));
    }

    @Test
    void bombHitDropsAttachedItemAndBouncesHook() {
        List<PlacedItem> layout = BattleLayoutBuilder.build("easy-mine", "BOMB2");
        BattleArena arena = new BattleArena(1L, 2L, "easy-mine", 90, layout);
        arena.creditScore('A', 200);

        PlacedItem gold = layout.stream()
                .filter(i -> i.type == BugMinerItemType.BM_ITEM_GOLD && !i.collected)
                .findFirst()
                .orElseThrow();
        gold.x = 0f;
        gold.y = 150f;
        gold.collected = false;

        arena.fireHook(2L);
        for (int i = 0; i < 200; i++) {
            arena.tick(0.05f, true);
            if (arena.toProto().getHookB().getState() == BugMinerHookState.BM_HOOK_RETRACTING
                    && arena.toProto().getHookB().hasAttachedItemId()) {
                break;
            }
        }

        assertEquals(BugMinerHookState.BM_HOOK_RETRACTING, arena.toProto().getHookB().getState());
        assertTrue(arena.toProto().getHookB().hasAttachedItemId());

        assertTrue(arena.throwBomb(1L));
        boolean ropeCut = false;
        for (int i = 0; i < 100; i++) {
            arena.tick(0.05f, true);
            for (BugMinerClientEvent ev : arena.drainEvents()) {
                if ("battle:ropeCut".equals(ev.eventType)) ropeCut = true;
            }
            if (arena.toProto().getBombsCount() == 0 && ropeCut) break;
        }

        assertEquals(BugMinerHookState.BM_HOOK_SWINGING, arena.toProto().getHookB().getState());
        assertFalse(arena.toProto().getHookB().hasAttachedItemId());
        assertTrue(ropeCut);
    }
}
