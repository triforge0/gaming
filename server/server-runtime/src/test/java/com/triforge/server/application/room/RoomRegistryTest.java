package com.triforge.server.application.room;

import com.triforge.engine.game.GamePlugins;
import com.triforge.games.tankarena.TankArenaPlugin;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class RoomRegistryTest {

    @Test
    void listsActiveRoomsWithPlayerCountsAndPluginInfo() {
        RoomRegistry registry = new RoomRegistry();
        registry.ensureRoom("main", "Main Arena");
        registry.ensureRoom("duel", "Duel Pit");

        assertEquals(2, registry.listRooms().size());
        assertTrue(registry.listRooms().stream().anyMatch(room -> "main".equals(room.roomId())));
        assertEquals(RoomRegistry.DEFAULT_MAX_PLAYERS, registry.listRooms().get(0).maxPlayers());
        assertEquals(TankArenaPlugin.ID, registry.listRooms().get(0).gamePluginId());
        assertEquals("Tank Arena", registry.listRooms().get(0).gameDisplayName());

        registry.clear();
    }

    @Test
    void ensureRoomUsesDefaultPluginFromConstructor() {
        RoomRegistry registry = new RoomRegistry(GamePlugins.defaultPlugin());
        GameRoom room = registry.ensureRoom("alpha", "Alpha Room");

        assertEquals(TankArenaPlugin.ID, room.plugin().id());
        registry.clear();
    }

    @Test
    void ensureRoomAcceptsExplicitPluginId() {
        RoomRegistry registry = new RoomRegistry();
        GameRoom room = registry.ensureRoom("beta", "Beta Room", TankArenaPlugin.ID);

        assertEquals(TankArenaPlugin.ID, room.plugin().id());
        registry.clear();
    }

    @Test
    void rejectsPluginChangeForExistingRoom() {
        RoomRegistry registry = new RoomRegistry();
        registry.ensureRoom("gamma", "Gamma Room", TankArenaPlugin.ID);

        assertThrows(IllegalStateException.class, () ->
                registry.ensureRoom("gamma", "Gamma Room", "other-game"));

        registry.clear();
    }

    @Test
    void getOrCreateReturnsExistingRoomWithoutPluginConflict() {
        RoomRegistry registry = new RoomRegistry();
        registry.ensureRoom("quest", "Treasure Quest", "treasurequest");

        GameRoom joined = registry.getOrCreate("quest");

        assertEquals("treasurequest", joined.plugin().id());
        registry.clear();
    }

    @Test
    void listsAvailablePluginsFromClasspath() {
        RoomRegistry registry = new RoomRegistry();
        assertTrue(registry.availablePlugins().stream()
                .anyMatch(plugin -> TankArenaPlugin.ID.equals(plugin.id())));
    }
}
