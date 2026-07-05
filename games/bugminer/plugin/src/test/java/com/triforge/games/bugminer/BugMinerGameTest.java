package com.triforge.games.bugminer;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.BugMinerBoardState;
import com.triforge.protocol.proto.BugMinerHookState;
import com.triforge.protocol.proto.BugMinerPlacedItem;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static com.triforge.games.bugminer.BugMinerTestFixtures.GUEST_ID;
import static com.triforge.games.bugminer.BugMinerTestFixtures.HOST_ID;
import static com.triforge.games.bugminer.BugMinerTestFixtures.autoArrangeMessage;
import static com.triforge.games.bugminer.BugMinerTestFixtures.configureFairMode;
import static com.triforge.games.bugminer.BugMinerTestFixtures.hostStartMatch;
import static com.triforge.games.bugminer.BugMinerTestFixtures.joinTwoPlayers;
import static com.triforge.games.bugminer.BugMinerTestFixtures.lockMapMessage;
import static com.triforge.games.bugminer.BugMinerTestFixtures.newGame;
import static com.triforge.games.bugminer.BugMinerTestFixtures.placeItemMessage;
import static com.triforge.games.bugminer.BugMinerTestFixtures.restartMessage;
import static com.triforge.games.bugminer.BugMinerTestFixtures.setLevelMessage;
import static com.triforge.games.bugminer.BugMinerTestFixtures.tickPlaying;
import static com.triforge.games.bugminer.BugMinerTestFixtures.tickUntilPhase;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class BugMinerGameTest {

    // ── Lobby lifecycle ───────────────────────────────────────────────

    @Nested
    class LobbyLifecycle {

        @Test
        void twoPlayersJoinStaysInLobbyUntilHostStarts() {
            BugMinerGame game = newGame(new BugMinerRoomHost("bugminer-room"));
            joinTwoPlayers(game);
            assertEquals(MatchPhase.LOBBY, game.matchPhase());
        }

        @Test
        void hostCannotStartWithOnePlayer() {
            BugMinerGame game = newGame(new BugMinerRoomHost("bugminer-room"));
            game.handleJoinRequest("Alice", new EmbeddedChannel());
            hostStartMatch(game);
            assertEquals(MatchPhase.LOBBY, game.matchPhase());
        }

        @Test
        void nonHostCannotStartMatch() {
            BugMinerGame game = newGame(new BugMinerRoomHost("bugminer-room"));
            joinTwoPlayers(game);
            game.handleLobbyCommand(GUEST_ID, LobbyCommand.newBuilder()
                    .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                    .build());
            assertEquals(MatchPhase.LOBBY, game.matchPhase());
        }

        @Test
        void hostStartsMatchWithTwoPlayers() {
            BugMinerGame game = newGame(new BugMinerRoomHost("bugminer-room"));
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);
            assertEquals(MatchPhase.PLAYING, game.matchPhase());
        }

        @Test
        void scoreboardReturnsToLobby() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, true, "easy-mine", 1);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);
            tickPlaying(game, 400);
            tickUntilPhase(game, MatchPhase.ENDED);
            tickUntilPhase(game, MatchPhase.LOBBY);

            BugMinerBoardState board = host.latestBoard();
            assertFalse(board.hasForPlayerA());
            assertFalse(board.hasForPlayerB());
            assertFalse(board.hasBattle());
            assertEquals(0L, board.getWinnerId());
        }
    }

    // ── Free mode ───────────────────────────────────────────────────

    @Nested
    class FreeModeFlow {

        @Test
        void staysInDualSetupUntilBothLock() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState afterStart = host.latestBoard();
            assertFalse(afterStart.getForPlayerA().getSetupLocked());
            assertFalse(afterStart.getForPlayerB().getSetupLocked());

            game.handleGameMessage(HOST_ID, autoArrangeMessage());
            game.handleGameMessage(GUEST_ID, autoArrangeMessage());
            game.handleGameMessage(HOST_ID, lockMapMessage());
            BugMinerBoardState afterOneLock = host.latestBoard();
            assertTrue(afterOneLock.getForPlayerB().getSetupLocked());
            assertFalse(afterOneLock.getForPlayerA().getSetupLocked());
            assertEquals(0, afterOneLock.getPlayCountdown());

            game.handleGameMessage(GUEST_ID, lockMapMessage());
            BugMinerBoardState afterBothLock = host.latestBoard();
            assertTrue(afterBothLock.getForPlayerA().getSetupLocked());
            assertTrue(afterBothLock.getForPlayerB().getSetupLocked());
            assertTrue(afterBothLock.getPlayCountdown() > 0);
        }

        @Test
        void designerCrossAssignment() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState board = host.latestBoard();
            assertEquals(GUEST_ID, board.getForPlayerA().getDesignerId());
            assertEquals(HOST_ID, board.getForPlayerA().getPlayerId());
            assertEquals(HOST_ID, board.getForPlayerB().getDesignerId());
            assertEquals(GUEST_ID, board.getForPlayerB().getPlayerId());
        }

        @Test
        void allowsDifferentLevelsPerDesigner() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            game.handleGameMessage(HOST_ID, setLevelMessage("night-mine"));
            game.handleGameMessage(GUEST_ID, setLevelMessage("rock-mine"));

            BugMinerBoardState board = host.latestBoard();
            assertEquals("rock-mine", board.getForPlayerA().getLevelId());
            assertEquals("night-mine", board.getForPlayerB().getLevelId());
        }

        @Test
        void countdownAfterBothLock() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            game.handleGameMessage(HOST_ID, autoArrangeMessage());
            game.handleGameMessage(GUEST_ID, autoArrangeMessage());
            game.handleGameMessage(HOST_ID, lockMapMessage());
            game.handleGameMessage(GUEST_ID, lockMapMessage());

            assertTrue(host.latestBoard().getPlayCountdown() > 0);
            tickPlaying(game, 200);
            assertEquals(0, host.latestBoard().getPlayCountdown());
            assertEquals(MatchPhase.PLAYING, game.matchPhase());
        }

        @Test
        void restartReturnsToLobby() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            game.handleGameMessage(HOST_ID, restartMessage());
            assertEquals(MatchPhase.LOBBY, game.matchPhase());
            assertFalse(host.latestBoard().hasForPlayerA());
            assertFalse(host.latestBoard().hasForPlayerB());
        }

        @Test
        void fullPlaythrough() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            game.handleGameMessage(HOST_ID, setLevelMessage("easy-mine"));
            game.handleGameMessage(GUEST_ID, setLevelMessage("rock-mine"));
            game.handleGameMessage(HOST_ID, autoArrangeMessage());
            game.handleGameMessage(GUEST_ID, autoArrangeMessage());
            game.handleGameMessage(HOST_ID, lockMapMessage());
            game.handleGameMessage(GUEST_ID, lockMapMessage());

            assertTrue(host.latestBoard().getPlayCountdown() > 0);
            tickPlaying(game, 200);
            assertEquals(MatchPhase.PLAYING, game.matchPhase());

            game.handleGameMessage(HOST_ID, GameMessage.newBuilder()
                    .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                            .setFireHook(com.triforge.protocol.proto.BMFireHookCommand.newBuilder().build())
                            .build())
                    .build());
            tickPlaying(game, 30);
        }
    }

    // ── Fair mode ───────────────────────────────────────────────────

    @Nested
    class FairModeFlow {

        @Test
        void onlyHostCanConfigure() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer:easy-mine:FAIR");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);

            game.handleGameMessage(GUEST_ID, BugMinerTestFixtures.configureFairModeMessage(
                    true, false, "easy-mine", 90));
            assertFalse(host.latestBoard().getFairMode().getEnabled());

            configureFairMode(game, HOST_ID, true, false, "easy-mine", 90);
            assertTrue(host.latestBoard().getFairMode().getEnabled());
        }

        @Test
        void skipsDualSetup() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer:easy-mine:FAIR");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, false, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState board = host.latestBoard();
            assertTrue(board.getForPlayerA().getSetupLocked());
            assertTrue(board.getForPlayerB().getSetupLocked());
            assertTrue(board.getPlayCountdown() > 0);
            assertTrue(board.getForPlayerA().getItemsCount() > 0);
            assertTrue(board.getForPlayerA().getItemsList().stream()
                    .noneMatch(i -> i.getX() == 0f && i.getY() == 0f));
        }

        @Test
        void identicalMaps() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer:easy-mine:FAIR");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, false, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            assertPlacedItemsEqual(
                    host.latestBoard().getForPlayerA().getItemsList(),
                    host.latestBoard().getForPlayerB().getItemsList());
        }

        @Test
        void sameLevelAndTime() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer:rock-mine:FAIR");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, false, "rock-mine", 100);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState board = host.latestBoard();
            assertEquals("rock-mine", board.getForPlayerA().getLevelId());
            assertEquals("rock-mine", board.getForPlayerB().getLevelId());
            assertEquals(100, board.getForPlayerA().getTimeLimit());
            assertEquals(100, board.getForPlayerB().getTimeLimit());
        }

        @Test
        void blocksManualSetup() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer:easy-mine:FAIR");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, false, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState before = host.latestBoard();
            game.handleGameMessage(HOST_ID, setLevelMessage("night-mine"));
            game.handleGameMessage(HOST_ID, placeItemMessage("item-0", 100, 100));
            game.handleGameMessage(HOST_ID, autoArrangeMessage());
            game.handleGameMessage(HOST_ID, lockMapMessage());

            BugMinerBoardState after = host.latestBoard();
            assertEquals(before.getForPlayerA().getLevelId(), after.getForPlayerA().getLevelId());
            assertEquals(before.getForPlayerA().getItemsCount(), after.getForPlayerA().getItemsCount());
            assertTrue(after.getForPlayerA().getSetupLocked());
        }

        @Test
        void matchStartsAfterLobbyConfiguration() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer:easy-mine:FAIR");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, false, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);
            assertEquals(MatchPhase.PLAYING, game.matchPhase());
        }

        @Test
        void configureAllowedDuringCountdown() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            hostStartMatch(game);
            assertEquals(MatchPhase.COUNTDOWN, game.matchPhase());

            configureFairMode(game, HOST_ID, true, false, "rock-mine", 100);
            tickUntilPhase(game, MatchPhase.PLAYING);
            assertEquals("rock-mine", host.latestBoard().getForPlayerA().getLevelId());
        }
    }

    // ── Battle mode ─────────────────────────────────────────────────

    @Nested
    class BattleModeFlow {

        @Test
        void configuresViaHost() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, true, "easy-mine", 90);

            var fairMode = host.latestBoard().getFairMode();
            assertTrue(fairMode.getEnabled());
            assertTrue(fairMode.getBattle());
        }

        @Test
        void skipsDualSetupAndCreatesArena() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, true, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState board = host.latestBoard();
            assertFalse(board.hasForPlayerA());
            assertFalse(board.hasForPlayerB());
            assertTrue(board.hasBattle());
            assertTrue(board.getBattle().getItemsCount() > 0);
            assertEquals(BugMinerHookState.BM_HOOK_SWINGING, board.getBattle().getHookA().getState());
            assertEquals(BugMinerHookState.BM_HOOK_SWINGING, board.getBattle().getHookB().getState());
            assertTrue(board.getPlayCountdown() > 0);
        }

        @Test
        void blocksManualSetup() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, true, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            int itemsBefore = host.latestBoard().getBattle().getItemsCount();
            game.handleGameMessage(HOST_ID, placeItemMessage("item-0", 100, 100));
            game.handleGameMessage(HOST_ID, lockMapMessage());
            assertEquals(itemsBefore, host.latestBoard().getBattle().getItemsCount());
        }

        @Test
        void noStaleWinnerOnRematch() {
            BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
            BugMinerGame game = newGame(host);
            joinTwoPlayers(game);
            configureFairMode(game, HOST_ID, true, true, "easy-mine", 1);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            tickPlaying(game, 400);
            tickUntilPhase(game, MatchPhase.ENDED);
            assertTrue(host.latestBoard().getWinnerId() != 0L || host.latestBoard().getBattle().getFinished());

            tickUntilPhase(game, MatchPhase.LOBBY);
            host.clearBoards();

            configureFairMode(game, HOST_ID, true, true, "easy-mine", 90);
            hostStartMatch(game);
            tickUntilPhase(game, MatchPhase.PLAYING);

            BugMinerBoardState rematch = host.latestBoard();
            assertEquals(0L, rematch.getWinnerId(), "stale winner must not carry into rematch");
            assertTrue(rematch.hasBattle());
            assertFalse(rematch.getBattle().getFinished());
            assertTrue(rematch.getPlayCountdown() > 0);
        }
    }

    // ── Misc ────────────────────────────────────────────────────────

    @Test
    void playerReconnectTest() {
        BugMinerGame game = newGame(new BugMinerRoomHost("bugminer-room"));
        joinTwoPlayers(game);
        hostStartMatch(game);
        tickUntilPhase(game, MatchPhase.PLAYING);
        game.handleLeaveRequest(HOST_ID);
        game.handleJoinRequest("Alice", new EmbeddedChannel());
    }

    @Test
    void serviceLoaderRegistersBugMinerPlugin() {
        Game game = GamePlugins.require(BugMinerPlugin.ID).createGame(null);
        assertNotNull(game);
    }

    private static void assertPlacedItemsEqual(
            java.util.List<BugMinerPlacedItem> a, java.util.List<BugMinerPlacedItem> b) {
        assertEquals(a.size(), b.size());
        for (int i = 0; i < a.size(); i++) {
            assertEquals(a.get(i).getType(), b.get(i).getType());
            assertEquals(a.get(i).getX(), b.get(i).getX(), 0.01f);
            assertEquals(a.get(i).getY(), b.get(i).getY(), 0.01f);
        }
    }
}
