package com.triforge.games.tankarena.match;

import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchStats;
import com.triforge.protocol.proto.PlayerMatchStats;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class MatchProtoMapperTest {

    @Test
    void matchPhaseRoundTrips() {
        for (MatchPhase phase : MatchPhase.values()) {
            assertEquals(phase, MatchProtoMapper.toDomain(MatchProtoMapper.toProto(phase)));
        }
    }

    @Test
    void teamRoundTrips() {
        for (Team team : Team.values()) {
            assertEquals(team, MatchProtoMapper.toDomain(MatchProtoMapper.toProto(team)));
        }
    }

    @Test
    void spawnRegionRoundTrips() {
        for (SpawnRegion region : SpawnRegion.values()) {
            assertEquals(region, MatchProtoMapper.toDomain(MatchProtoMapper.toProto(region)));
        }
    }

    @Test
    void lobbyPlayerRoundTrips() {
        LobbyPlayer player = new LobbyPlayer(42L, "Thắng", Team.RED, SpawnRegion.TOP_LEFT, true, true, true);

        LobbyPlayer restored = MatchProtoMapper.toDomain(MatchProtoMapper.toProto(player));

        assertEquals(player, restored);
    }

    @Test
    void matchStatsMapToProto() {
        MatchStats stats = new MatchStats();
        stats.addKill();
        stats.addKill();
        stats.addDeath();
        stats.addAssist();
        stats.addDamageDealt(120);
        stats.addDamageTaken(35);
        stats.recordShotFired();
        stats.recordShotFired();
        stats.recordShotHit();

        PlayerMatchStats proto = MatchProtoMapper.toProto(7L, "An", Team.BLUE, stats);

        assertEquals(7L, proto.getPlayerId());
        assertEquals("An", proto.getDisplayName());
        assertEquals(com.triforge.protocol.proto.Team.TEAM_BLUE, proto.getTeam());
        assertEquals(2, proto.getKills());
        assertEquals(1, proto.getDeaths());
        assertEquals(1, proto.getAssists());
        assertEquals(120, proto.getDamageDealt());
        assertEquals(35, proto.getDamageTaken());
        assertEquals(2, proto.getShotsFired());
        assertEquals(1, proto.getShotsHit());
    }
}
