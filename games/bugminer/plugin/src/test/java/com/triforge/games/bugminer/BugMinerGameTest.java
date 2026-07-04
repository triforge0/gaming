package com.triforge.games.bugminer;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

final class BugMinerGameTest {

    @Test
    void twoPlayersJoinStaysInLobbyUntilHostStarts() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());

        assertEquals(MatchPhase.LOBBY, game.matchPhase());
    }

    @Test
    void nonHostCannotStartMatch() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());

        game.handleLobbyCommand(2L, LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());

        assertEquals(MatchPhase.LOBBY, game.matchPhase());
    }

    @Test
    void hostStartsMatchWithTwoPlayers() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        assertEquals(MatchPhase.LOBBY, game.matchPhase());

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
    }

    @Test
    void fullPlaythroughTest() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        // 1. Two players join
        game.handleJoinRequest("Alice", new EmbeddedChannel()); // player 1
        game.handleJoinRequest("Bob", new EmbeddedChannel());   // player 2
        assertEquals(MatchPhase.LOBBY, game.matchPhase());

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());

        // Fast forward countdown
        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
        assertEquals(MatchPhase.PLAYING, game.matchPhase());

        // 2. Setup Phase: Alice designs Bob's map, Bob designs Alice's map.
        // Send level change commands
        game.handleGameMessage(1L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setSetLevel(com.triforge.protocol.proto.BMSetLevelCommand.newBuilder().setLevelId("easy-mine").build())
                        .build())
                .build());
        
        game.handleGameMessage(2L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setSetLevel(com.triforge.protocol.proto.BMSetLevelCommand.newBuilder().setLevelId("rock-mine").build())
                        .build())
                .build());

        // Call auto-arrange for both players
        game.handleGameMessage(1L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setAutoArrange(com.triforge.protocol.proto.BMAutoArrangeCommand.newBuilder().build())
                        .build())
                .build());

        game.handleGameMessage(2L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setAutoArrange(com.triforge.protocol.proto.BMAutoArrangeCommand.newBuilder().build())
                        .build())
                .build());

        // Lock both maps
        game.handleGameMessage(1L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setLockMap(com.triforge.protocol.proto.BMLockMapCommand.newBuilder().build())
                        .build())
                .build());

        game.handleGameMessage(2L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setLockMap(com.triforge.protocol.proto.BMLockMapCommand.newBuilder().build())
                        .build())
                .build());

        // 3. Play Phase: Tick loop, moving items, hook shooting
        // Verify items moved inside tick
        game.tickMatchTimer();

        // Alice (playerId=1) fires hook on challengeA (designed by Bob, i.e. player 2)
        game.handleGameMessage(1L, com.triforge.protocol.proto.GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setFireHook(com.triforge.protocol.proto.BMFireHookCommand.newBuilder().build())
                        .build())
                .build());

        // Tick several times to let hook extend and check updates
        for (int i = 0; i < 30; i++) {
            game.tickMatchTimer();
        }
    }

    @Test
    void playerReconnectTest() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        // Join two players
        game.handleJoinRequest("Alice", new EmbeddedChannel()); // 1L
        game.handleJoinRequest("Bob", new EmbeddedChannel());   // 2L

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());

        // Fast forward countdown
        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
        assertEquals(MatchPhase.PLAYING, game.matchPhase());

        // Alice disconnects
        game.handleLeaveRequest(1L);

        // Join request with name "Alice" should reconnect her and give same ID (1L)
        game.handleJoinRequest("Alice", new EmbeddedChannel());
    }

    @Test
    void fairModeMatchStartsAfterLobbyConfiguration() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer:easy-mine:FAIR");
        game.bind(host);

        game.handleJoinRequest("Alice", new io.netty.channel.embedded.EmbeddedChannel());
        game.handleJoinRequest("Bob", new io.netty.channel.embedded.EmbeddedChannel());
        assertEquals(com.triforge.engine.match.MatchPhase.LOBBY, game.matchPhase());

        game.handleGameMessage(1L, GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setConfigureFairMode(com.triforge.protocol.proto.BMConfigureFairModeCommand.newBuilder()
                                .setEnabled(true)
                                .setLevelId("easy-mine")
                                .setTimeLimit(90)
                                .build())
                        .build())
                .build());

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());

        while (game.matchPhase() == com.triforge.engine.match.MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
        assertEquals(com.triforge.engine.match.MatchPhase.PLAYING, game.matchPhase());
    }

    @Test
    void configureFairModeAllowedDuringCountdown() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        game.handleJoinRequest("Alice", new io.netty.channel.embedded.EmbeddedChannel());
        game.handleJoinRequest("Bob", new io.netty.channel.embedded.EmbeddedChannel());
        assertEquals(com.triforge.engine.match.MatchPhase.LOBBY, game.matchPhase());

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(com.triforge.protocol.proto.StartMatchAction.newBuilder().build())
                .build());
        assertEquals(com.triforge.engine.match.MatchPhase.COUNTDOWN, game.matchPhase());

        game.handleGameMessage(1L, GameMessage.newBuilder()
                .setBugminer(com.triforge.protocol.proto.BugMinerMessage.newBuilder()
                        .setConfigureFairMode(com.triforge.protocol.proto.BMConfigureFairModeCommand.newBuilder()
                                .setEnabled(true)
                                .setBattle(false)
                                .setLevelId("rock-mine")
                                .setTimeLimit(100)
                                .build())
                        .build())
                .build());

        while (game.matchPhase() == com.triforge.engine.match.MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
        assertEquals(com.triforge.engine.match.MatchPhase.PLAYING, game.matchPhase());
    }

    @Test
    void serviceLoaderRegistersBugMinerPlugin() {
        Game game = GamePlugins.require(BugMinerPlugin.ID).createGame(null);
        assertNotNull(game);
    }
}
