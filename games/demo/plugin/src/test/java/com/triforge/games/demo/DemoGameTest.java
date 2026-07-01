package com.triforge.games.demo;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

final class DemoGameTest {

    @Test
    void joinReadyAndStartMatch() {
        DemoGame game = new DemoGame();
        DemoRoomHost host = new DemoRoomHost("demo-room");
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
    void serviceLoaderRegistersDemoPlugin() {
        Game game = GamePlugins.require(DemoPlugin.ID).createGame(null);
        assertNotNull(game);
    }
}
