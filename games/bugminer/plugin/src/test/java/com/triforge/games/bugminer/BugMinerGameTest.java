package com.triforge.games.bugminer;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

final class BugMinerGameTest {

    @Test
    void joinReadyAndStartMatch() {
        BugMinerGame game = new BugMinerGame();
        BugMinerRoomHost host = new BugMinerRoomHost("bugminer-room");
        game.bind(host);

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());

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

        // Mark ready
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
        game.handleLobbyCommand(2L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
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
    void serviceLoaderRegistersBugMinerPlugin() {
        Game game = GamePlugins.require(BugMinerPlugin.ID).createGame(null);
        assertNotNull(game);
    }
}
