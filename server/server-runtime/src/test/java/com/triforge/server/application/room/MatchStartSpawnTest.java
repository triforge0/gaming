package com.triforge.server.application.room;

import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.engine.ecs.Entity;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.SetSpawnAction;
import com.triforge.protocol.proto.SetTeamAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class MatchStartSpawnTest {

    @Test
    void twoPlayersSpawnInChosenRegionsWithTeams() {
        GameRoom room = new GameRoom("spawn-room"); // not started: step ticks manually
        GameMap map = TankArenaRoomSupport.gameMap(room);

        room.handleJoinRequest("Thắng", new EmbeddedChannel());
        room.handleJoinRequest("An", new EmbeddedChannel());
        configure(room, 1L, Team.RED, SpawnRegion.TOP_LEFT);
        configure(room, 2L, Team.BLUE, SpawnRegion.BOTTOM_RIGHT);
        room.handleLobbyCommand(1L, ready());
        room.handleLobbyCommand(2L, ready());

        // Drive the countdown to completion → startMatch spawns the tanks.
        while (room.matchPhase() == MatchPhase.COUNTDOWN) {
            room.tickCountdownPhase();
        }

        assertEquals(MatchPhase.PLAYING, room.matchPhase());
        assertEquals(2, room.entityManager().count(), "two lobby players → two tanks");

        assertSpawn(room, map, 1L, Team.RED, SpawnRegion.TOP_LEFT);
        assertSpawn(room, map, 2L, Team.BLUE, SpawnRegion.BOTTOM_RIGHT);
    }

    private void assertSpawn(GameRoom room, GameMap map, long playerId, Team team, SpawnRegion region) {
        Entity tank = TankArenaRoomSupport.playerEntity(room, playerId);
        PlayerComponent player = room.componentManager().get(tank, PlayerComponent.class);
        PositionComponent pos = room.componentManager().get(tank, PositionComponent.class);

        assertEquals(team, player.team(), "team assigned on entity");
        int tileX = map.worldToTileX(pos.x());
        int tileY = map.worldToTileY(pos.y());
        assertTrue(map.spawnRegion(region).contains(tileX, tileY),
                playerId + " spawned outside " + region + " at (" + tileX + "," + tileY + ")");
        assertTrue(!map.tileAt(tileX, tileY).blocksTank(TankArenaRoomSupport.mapConfig(room)), "spawn tile is open");
    }

    private static void configure(GameRoom room, long playerId, Team team, SpawnRegion region) {
        LobbyTestSupport.configureTeam(room, playerId, team, region);
    }

    private static LobbyCommand ready() {
        return LobbyCommand.newBuilder().setSetReady(SetReadyAction.newBuilder().setReady(true)).build();
    }

    private static com.triforge.protocol.proto.Team toProto(Team team) {
        return switch (team) {
            case RED -> com.triforge.protocol.proto.Team.TEAM_RED;
            case BLUE -> com.triforge.protocol.proto.Team.TEAM_BLUE;
            case NONE -> com.triforge.protocol.proto.Team.TEAM_NONE;
        };
    }

    private static com.triforge.protocol.proto.SpawnRegion toProto(SpawnRegion region) {
        return switch (region) {
            case TOP_LEFT -> com.triforge.protocol.proto.SpawnRegion.TOP_LEFT;
            case TOP_RIGHT -> com.triforge.protocol.proto.SpawnRegion.TOP_RIGHT;
            case BOTTOM_LEFT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_LEFT;
            case BOTTOM_RIGHT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_RIGHT;
            case UNSPECIFIED -> com.triforge.protocol.proto.SpawnRegion.REGION_UNSPECIFIED;
        };
    }
}
