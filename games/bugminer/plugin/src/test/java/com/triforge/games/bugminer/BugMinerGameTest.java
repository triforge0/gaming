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
    void serviceLoaderRegistersBugMinerPlugin() {
        Game game = GamePlugins.require(BugMinerPlugin.ID).createGame(null);
        assertNotNull(game);
    }
}
