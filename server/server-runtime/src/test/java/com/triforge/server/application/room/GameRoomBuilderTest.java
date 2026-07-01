package com.triforge.server.application.room;

import com.triforge.engine.game.GamePlugins;
import com.triforge.engine.match.MatchConfig;
import com.triforge.games.demo.DemoPlugin;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class GameRoomBuilderTest {

    @Test
    void appliesRoomNamePluginAndMatchConfigAtBuildTime() {
        MatchConfig config = MatchConfig.defaults().withMinPlayers(1);

        GameRoom room = GameRoom.builder("lab")
                .roomName("Lab Arena")
                .plugin(GamePlugins.require(DemoPlugin.ID))
                .matchConfig(config)
                .build();

        assertEquals("lab", room.roomId());
        assertEquals("Lab Arena", room.roomName());
        assertEquals(DemoPlugin.ID, room.plugin().id());
        assertEquals(1, room.matchController().config().minPlayers());
    }
}
