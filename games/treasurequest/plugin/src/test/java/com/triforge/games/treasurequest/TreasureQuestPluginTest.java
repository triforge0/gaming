package com.triforge.games.treasurequest;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

final class TreasureQuestPluginTest {

    @Test
    void serviceLoaderRegistersTreasureQuestPlugin() {
        Game game = GamePlugins.require(TreasureQuestPlugin.ID).createGame(null);
        assertNotNull(game);
        assertEquals("treasurequest", TreasureQuestPlugin.ID);
    }

    @Test
    void joinReadyAndStartMatchReachesPlaying() {
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(new TreasureQuestRoomHost("quest-room"));

        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());

        assertEquals(MatchPhase.LOBBY, game.matchPhase());

        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(StartMatchAction.newBuilder().build())
                .build());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
    }
}
