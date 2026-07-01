package com.triforge.server.application.room;

import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.TankArenaMatchController;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetTeamAction;
import com.triforge.protocol.proto.SetTeamSetupAction;

/** Shared lobby configuration helpers for integration tests. */
public final class LobbyTestSupport {
    private LobbyTestSupport() {
    }

    public static void configureTeam(
            TankArenaMatchController controller,
            long playerId,
            Team team,
            SpawnRegion spawn,
            SpawnRegion hq
    ) {
        controller.setTeam(playerId, team);
        controller.setTeamSetup(playerId, spawn, hq);
    }

    public static void configureTeam(
            TankArenaMatchController controller,
            long playerId,
            Team team,
            SpawnRegion spawn
    ) {
        configureTeam(controller, playerId, team, spawn, spawn);
    }

    public static void configureTeam(GameRoom room, long playerId, Team team, SpawnRegion spawn) {
        room.handleLobbyCommand(playerId, LobbyCommand.newBuilder()
                .setSetTeam(SetTeamAction.newBuilder().setTeam(toProtoTeam(team)))
                .build());
        room.handleLobbyCommand(playerId, LobbyCommand.newBuilder()
                .setSetTeamSetup(SetTeamSetupAction.newBuilder()
                        .setSpawnRegion(toProtoSpawn(spawn))
                        .setHqRegion(toProtoSpawn(spawn))
                        .build())
                .build());
    }

    public static void configureTeam(
            GameRoom room,
            long playerId,
            Team team,
            SpawnRegion spawn,
            SpawnRegion hq
    ) {
        room.handleLobbyCommand(playerId, LobbyCommand.newBuilder()
                .setSetTeam(SetTeamAction.newBuilder().setTeam(toProtoTeam(team)))
                .build());
        room.handleLobbyCommand(playerId, LobbyCommand.newBuilder()
                .setSetTeamSetup(SetTeamSetupAction.newBuilder()
                        .setSpawnRegion(toProtoSpawn(spawn))
                        .setHqRegion(toProtoSpawn(hq))
                        .build())
                .build());
    }

    public static com.triforge.protocol.proto.Team toProtoTeam(Team team) {
        return switch (team) {
            case RED -> com.triforge.protocol.proto.Team.TEAM_RED;
            case BLUE -> com.triforge.protocol.proto.Team.TEAM_BLUE;
            case NONE -> com.triforge.protocol.proto.Team.TEAM_NONE;
        };
    }

    public static com.triforge.protocol.proto.SpawnRegion toProtoSpawn(SpawnRegion region) {
        return switch (region) {
            case TOP_LEFT -> com.triforge.protocol.proto.SpawnRegion.TOP_LEFT;
            case TOP_RIGHT -> com.triforge.protocol.proto.SpawnRegion.TOP_RIGHT;
            case BOTTOM_LEFT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_LEFT;
            case BOTTOM_RIGHT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_RIGHT;
            case UNSPECIFIED -> com.triforge.protocol.proto.SpawnRegion.REGION_UNSPECIFIED;
        };
    }
}
