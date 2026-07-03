package com.triforge.games.tankarena.match;

import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchPhaseProtoMapper;
import com.triforge.engine.match.MatchStats;
import com.triforge.protocol.proto.PlayerMatchStats;

/** Maps Tank Arena match domain types to protobuf wire messages. */
public final class MatchProtoMapper {

    private MatchProtoMapper() {
    }

    public static com.triforge.protocol.proto.MatchPhase toProto(MatchPhase phase) {
        return MatchPhaseProtoMapper.toProto(phase);
    }

    public static MatchPhase toDomain(com.triforge.protocol.proto.MatchPhase phase) {
        return MatchPhaseProtoMapper.toDomain(phase);
    }

    public static com.triforge.protocol.proto.Team toProto(Team team) {
        return switch (team) {
            case NONE -> com.triforge.protocol.proto.Team.TEAM_NONE;
            case RED -> com.triforge.protocol.proto.Team.TEAM_RED;
            case BLUE -> com.triforge.protocol.proto.Team.TEAM_BLUE;
        };
    }

    public static Team toDomain(com.triforge.protocol.proto.Team team) {
        return switch (team) {
            case TEAM_RED -> Team.RED;
            case TEAM_BLUE -> Team.BLUE;
            case TEAM_NONE, UNRECOGNIZED -> Team.NONE;
        };
    }

    public static com.triforge.protocol.proto.SpawnRegion toProto(SpawnRegion region) {
        return switch (region) {
            case UNSPECIFIED -> com.triforge.protocol.proto.SpawnRegion.REGION_UNSPECIFIED;
            case TOP_LEFT -> com.triforge.protocol.proto.SpawnRegion.TOP_LEFT;
            case TOP_RIGHT -> com.triforge.protocol.proto.SpawnRegion.TOP_RIGHT;
            case BOTTOM_LEFT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_LEFT;
            case BOTTOM_RIGHT -> com.triforge.protocol.proto.SpawnRegion.BOTTOM_RIGHT;
        };
    }

    public static SpawnRegion toDomain(com.triforge.protocol.proto.SpawnRegion region) {
        return switch (region) {
            case TOP_LEFT -> SpawnRegion.TOP_LEFT;
            case TOP_RIGHT -> SpawnRegion.TOP_RIGHT;
            case BOTTOM_LEFT -> SpawnRegion.BOTTOM_LEFT;
            case BOTTOM_RIGHT -> SpawnRegion.BOTTOM_RIGHT;
            case REGION_UNSPECIFIED, UNRECOGNIZED -> SpawnRegion.UNSPECIFIED;
        };
    }

    public static com.triforge.protocol.proto.LobbyPlayer toProto(LobbyPlayer player) {
        return com.triforge.protocol.proto.LobbyPlayer.newBuilder()
                .setPlayerId(player.playerId())
                .setDisplayName(player.displayName())
                .setTeam(toProto(player.team()))
                .setSpawnRegion(toProto(player.spawnRegion()))
                .setReady(player.ready())
                .setIsHost(player.isHost())
                .setIsTeamCaptain(player.isTeamCaptain())
                .build();
    }

    public static com.triforge.protocol.proto.TeamSetup toProto(TeamSetup setup) {
        return com.triforge.protocol.proto.TeamSetup.newBuilder()
                .setTeam(toProto(setup.team()))
                .setCaptainPlayerId(setup.captainPlayerId())
                .setSpawnRegion(toProto(setup.spawnRegion()))
                .setHqRegion(toProto(setup.hqRegion()))
                .build();
    }

    public static LobbyPlayer toDomain(com.triforge.protocol.proto.LobbyPlayer player) {
        return new LobbyPlayer(
                player.getPlayerId(),
                player.getDisplayName(),
                toDomain(player.getTeam()),
                toDomain(player.getSpawnRegion()),
                player.getReady(),
                player.getIsHost(),
                player.getIsTeamCaptain());
    }

    public static PlayerMatchStats toProto(long playerId, String displayName, Team team, MatchStats stats) {
        return PlayerMatchStats.newBuilder()
                .setPlayerId(playerId)
                .setDisplayName(displayName)
                .setTeam(toProto(team))
                .setKills(stats.kills())
                .setDeaths(stats.deaths())
                .setAssists(stats.assists())
                .setDamageDealt(stats.damageDealt())
                .setDamageTaken(stats.damageTaken())
                .setShotsFired(stats.shotsFired())
                .setShotsHit(stats.shotsHit())
                .build();
    }

    public static com.triforge.protocol.proto.LobbyRejectReason toProto(LobbyRejectReason reason) {
        return switch (reason) {
            case NONE -> com.triforge.protocol.proto.LobbyRejectReason.LOBBY_REJECT_UNSPECIFIED;
            case NOT_IN_LOBBY_PHASE -> com.triforge.protocol.proto.LobbyRejectReason.NOT_IN_LOBBY_PHASE;
            case PLAYER_NOT_FOUND -> com.triforge.protocol.proto.LobbyRejectReason.PLAYER_NOT_FOUND;
            case INVALID_NAME -> com.triforge.protocol.proto.LobbyRejectReason.INVALID_NAME;
            case INVALID_TEAM -> com.triforge.protocol.proto.LobbyRejectReason.INVALID_TEAM;
            case TEAM_BALANCE -> com.triforge.protocol.proto.LobbyRejectReason.TEAM_BALANCE;
            case NOT_ON_PLAYABLE_TEAM -> com.triforge.protocol.proto.LobbyRejectReason.NOT_ON_PLAYABLE_TEAM;
            case NOT_TEAM_CAPTAIN -> com.triforge.protocol.proto.LobbyRejectReason.NOT_TEAM_CAPTAIN;
            case INVALID_SPAWN_REGION -> com.triforge.protocol.proto.LobbyRejectReason.INVALID_SPAWN_REGION;
            case TEAM_SETUP_INCOMPLETE -> com.triforge.protocol.proto.LobbyRejectReason.TEAM_SETUP_INCOMPLETE;
        };
    }
}
