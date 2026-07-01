package com.triforge.server.application.room;

import com.triforge.engine.ecs.Entity;
import com.triforge.games.tankarena.TankArenaGame;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.match.TankArenaMatchController;
import com.triforge.games.tankarena.match.Team;
import com.triforge.games.tankarena.vision.RoomVisionState;

/** Tank Arena helpers for integration tests that need plugin-specific room APIs. */
final class TankArenaRoomSupport {

    private TankArenaRoomSupport() {
    }

    static TankArenaGame tank(GameRoom room) {
        return (TankArenaGame) room.game();
    }

    static TankArenaMatchController match(GameRoom room) {
        return (TankArenaMatchController) room.matchController();
    }

    static GameMap gameMap(GameRoom room) {
        return tank(room).gameMap();
    }

    static MapConfig mapConfig(GameRoom room) {
        return tank(room).mapConfig();
    }

    static RoomVisionState visionState(GameRoom room) {
        return tank(room).visionState();
    }

    static Entity spawnPlayerTank(GameRoom room, long playerId, String playerName) {
        return tank(room).spawnPlayerTank(playerId, playerName);
    }

    static Entity playerEntity(GameRoom room, long playerId) {
        return tank(room).playerEntity(playerId);
    }

    static Entity spawnPlayerTank(
            GameRoom room,
            long playerId,
            String playerName,
            int lives,
            float x,
            float y,
            Team team
    ) {
        return tank(room).spawnPlayerTank(playerId, playerName, lives, x, y, team);
    }
}
