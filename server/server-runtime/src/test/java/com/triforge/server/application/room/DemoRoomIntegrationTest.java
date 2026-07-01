package com.triforge.server.application.room;

import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.demo.DemoPlugin;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class DemoRoomIntegrationTest {

    @Test
    void gameRoomRunsDemoPlugin() {
        GameRoom room = GameRoom.builder("demo-integration")
                .plugin(GamePlugins.require(DemoPlugin.ID))
                .build();

        room.handleJoinRequest("Tester", new EmbeddedChannel());
        room.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
        room.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(StartMatchAction.newBuilder().build())
                .build());

        while (room.matchPhase() == MatchPhase.COUNTDOWN) {
            room.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, room.matchPhase());
        assertEquals(DemoPlugin.ID, room.plugin().id());
    }
}
