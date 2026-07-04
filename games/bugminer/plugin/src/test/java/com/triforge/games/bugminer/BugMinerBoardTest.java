package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerHookState;
import com.triforge.protocol.proto.GameMessage;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

final class BugMinerBoardTest {

    @Test
    void fairModeSkipsManualSetupAndLocksBothMaps() {
        BugMinerBoard board = new BugMinerBoard();
        board.init(1L, 2L);
        board.fairMode().enabled = true;
        board.fairMode().battle = false;
        board.fairMode().levelId = "easy-mine";
        board.fairMode().timeLimit = 90;
        board.beginFairMode("room-fair-1");

        assertTrue(board.getState().getForPlayerA().getSetupLocked());
        assertTrue(board.getState().getForPlayerB().getSetupLocked());
        assertTrue(board.challengeA.copyItemsLayout().size() > 0);
        assertTrue(board.challengeA.copyItemsLayout().stream().noneMatch(i -> i.x == 0 && i.y == 0));
    }

    @Test
    void fairModeGivesIdenticalMapsToBothPlayers() {
        BugMinerBoard board = new BugMinerBoard();
        board.init(1L, 2L);
        board.fairMode().enabled = true;
        board.fairMode().battle = false;
        board.fairMode().levelId = "easy-mine";
        board.fairMode().timeLimit = 90;
        board.beginFairMode("room-fair-1");

        assertNotNull(board.challengeA);
        assertNotNull(board.challengeB);
        assertEquals(board.challengeA.copyItemsLayout().size(), board.challengeB.copyItemsLayout().size());
        for (int i = 0; i < board.challengeA.copyItemsLayout().size(); i++) {
            PlacedItem a = board.challengeA.copyItemsLayout().get(i);
            PlacedItem b = board.challengeB.copyItemsLayout().get(i);
            assertEquals(a.type, b.type);
            assertEquals(a.x, b.x, 0.01f);
            assertEquals(a.y, b.y, 0.01f);
        }
    }

    @Test
    void battleModeCreatesSharedArena() {
        BugMinerBoard board = new BugMinerBoard();
        board.init(1L, 2L);
        board.fairMode().enabled = true;
        board.fairMode().battle = true;
        board.fairMode().levelId = "easy-mine";
        board.fairMode().timeLimit = 90;
        board.beginBattleMode("room-battle-1");

        assertNull(board.challengeA);
        assertNull(board.challengeB);
        assertNotNull(board.battleArena);
        var battle = board.getState().getBattle();
        assertTrue(battle.getItemsCount() > 0);
        assertEquals(BugMinerHookState.BM_HOOK_SWINGING, battle.getHookA().getState());
        assertEquals(BugMinerHookState.BM_HOOK_SWINGING, battle.getHookB().getState());
    }

    @Test
    void autoSetupModeBlocksManualPlaceItem() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        game.handleJoinRequest("Alice", new io.netty.channel.embedded.EmbeddedChannel());
        game.handleJoinRequest("Bob", new io.netty.channel.embedded.EmbeddedChannel());

        game.handleGameMessage(1L, GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setConfigureFairMode(com.triforge.protocol.proto.BMConfigureFairModeCommand.newBuilder()
                                .setEnabled(true)
                                .setBattle(true)
                                .setLevelId("easy-mine")
                                .setTimeLimit(90)
                                .build())
                        .build())
                .build());

        game.handleLobbyCommand(1L, com.triforge.protocol.proto.LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());

        while (game.matchPhase() == com.triforge.engine.match.MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
        assertEquals(com.triforge.engine.match.MatchPhase.PLAYING, game.matchPhase());

        game.handleGameMessage(1L, GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setPlaceItem(com.triforge.protocol.proto.BMPlaceItemCommand.newBuilder()
                                .setItemId("item-0")
                                .setX(100)
                                .setY(100)
                                .build())
                        .build())
                .build());
        // No exception — placeItem blocked silently in battle mode
    }

    @Test
    void beginFreeModeCreatesUnlockedChallenges() {
        BugMinerBoard board = new BugMinerBoard();
        board.init(1L, 2L);
        board.beginFreeMode();

        assertNotNull(board.challengeA);
        assertNotNull(board.challengeB);
        assertFalse(board.getState().getForPlayerA().getSetupLocked());
        assertFalse(board.getState().getForPlayerB().getSetupLocked());
        assertTrue(board.challengeA.copyItemsLayout().size() > 0);
        assertTrue(board.challengeB.copyItemsLayout().size() > 0);
    }

    @Test
    void onSetupLockedStartsCountdownWhenBothLocked() {
        BugMinerBoard board = new BugMinerBoard();
        board.init(1L, 2L);
        board.beginFreeMode();

        assertTrue(board.challengeA.autoArrange(2L));
        assertTrue(board.challengeB.autoArrange(1L));

        board.challengeA.lockSetup(2L);
        board.onSetupLocked();
        assertEquals(0, board.playCountdownSeconds());

        board.challengeB.lockSetup(1L);
        board.onSetupLocked();
        assertTrue(board.playCountdownSeconds() > 0);
    }

    @Test
    void resetForLobbyClearsArenaAndWinner() {
        BugMinerBoard board = new BugMinerBoard();
        board.init(1L, 2L);
        board.fairMode().enabled = true;
        board.fairMode().battle = true;
        board.fairMode().levelId = "easy-mine";
        board.fairMode().timeLimit = 90;
        board.beginBattleMode("room-battle-1");
        board.setMatchOutcome(1L, "target");

        board.resetForLobby();

        var state = board.getState();
        assertNull(board.challengeA);
        assertNull(board.challengeB);
        assertNull(board.battleArena);
        assertFalse(state.hasBattle());
        assertFalse(state.hasWinnerId());
        assertEquals(0, state.getPlayCountdown());
    }

    @Test
    void initClearsStaleWinnerBeforeBattleStart() {
        BugMinerBoard board = new BugMinerBoard();
        board.setMatchOutcome(1L, "target");
        board.init(1L, 2L);
        board.fairMode().enabled = true;
        board.fairMode().battle = true;
        board.fairMode().levelId = "easy-mine";
        board.fairMode().timeLimit = 90;
        board.beginBattleMode("room-battle-1");

        var state = board.getState();
        assertFalse(state.hasWinnerId(), "stale winner must be cleared on new match");
        assertTrue(state.hasBattle());
        assertFalse(state.getBattle().getFinished());
        assertEquals(3, state.getPlayCountdown());
    }
}
