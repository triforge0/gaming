package com.triforge.games.tankarena.match;

import com.triforge.engine.match.MatchStats;
import com.triforge.protocol.proto.PlayerMatchStats;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Per-match scoreboard for Tank Arena (room thread only). */
public final class MatchStatsTracker {
    static final long ASSIST_WINDOW_TICKS = 300;

    private final Map<Long, MatchStats> stats = new LinkedHashMap<>();
    private final Map<Long, String> names = new LinkedHashMap<>();
    private final Map<Long, Team> teams = new LinkedHashMap<>();
    private final List<DamageEvent> damageLog = new ArrayList<>();
    private Team winnerOverride = Team.NONE;

    private record DamageEvent(long victimId, long attackerId, long tick) {
    }

    public void setWinnerOverride(Team team) {
        this.winnerOverride = team == null ? Team.NONE : team;
    }

    public void register(long playerId, String displayName, Team team) {
        stats.computeIfAbsent(playerId, id -> new MatchStats());
        names.put(playerId, displayName);
        teams.put(playerId, team == null ? Team.NONE : team);
    }

    public boolean isTracked(long playerId) {
        return stats.containsKey(playerId);
    }

    public MatchStats stats(long playerId) {
        return stats.get(playerId);
    }

    public void recordShotFired(long shooterPlayerId) {
        MatchStats shooter = stats.get(shooterPlayerId);
        if (shooter != null) {
            shooter.recordShotFired();
        }
    }

    public void recordDamage(long attackerPlayerId, long victimPlayerId, long tick) {
        MatchStats victim = stats.get(victimPlayerId);
        if (victim != null) {
            victim.addDamageTaken(1);
        }
        if (attackerPlayerId >= 0 && attackerPlayerId != victimPlayerId) {
            MatchStats attacker = stats.get(attackerPlayerId);
            if (attacker != null) {
                attacker.addDamageDealt(1);
                attacker.recordShotHit();
            }
            damageLog.add(new DamageEvent(victimPlayerId, attackerPlayerId, tick));
        }
    }

    public List<Long> recordKill(long killerPlayerId, long victimPlayerId, long tick) {
        MatchStats victim = stats.get(victimPlayerId);
        if (victim != null) {
            victim.addDeath();
        }
        if (killerPlayerId >= 0 && killerPlayerId != victimPlayerId) {
            MatchStats killer = stats.get(killerPlayerId);
            if (killer != null) {
                killer.addKill();
            }
            return creditAssists(victimPlayerId, killerPlayerId, tick);
        }
        return List.of();
    }

    private List<Long> creditAssists(long victimPlayerId, long killerPlayerId, long tick) {
        Set<Long> credited = new HashSet<>();
        List<Long> assistIds = new ArrayList<>();
        for (DamageEvent event : damageLog) {
            if (event.victimId() != victimPlayerId
                    || event.attackerId() == killerPlayerId
                    || event.attackerId() == victimPlayerId
                    || tick - event.tick() > ASSIST_WINDOW_TICKS) {
                continue;
            }
            if (credited.add(event.attackerId())) {
                MatchStats assistant = stats.get(event.attackerId());
                if (assistant != null) {
                    assistant.addAssist();
                    assistIds.add(event.attackerId());
                }
            }
        }
        return assistIds;
    }

    public int teamKills(Team team) {
        int total = 0;
        for (Map.Entry<Long, MatchStats> entry : stats.entrySet()) {
            if (teams.get(entry.getKey()) == team) {
                total += entry.getValue().kills();
            }
        }
        return total;
    }

    private int teamNetKills(Team team) {
        int net = 0;
        for (Map.Entry<Long, MatchStats> entry : stats.entrySet()) {
            if (teams.get(entry.getKey()) == team) {
                net += entry.getValue().kills() - entry.getValue().deaths();
            }
        }
        return net;
    }

    public Team winningTeam() {
        if (winnerOverride.isPlayable()) {
            return winnerOverride;
        }
        int redKills = teamKills(Team.RED);
        int blueKills = teamKills(Team.BLUE);
        if (redKills != blueKills) {
            return redKills > blueKills ? Team.RED : Team.BLUE;
        }
        int redNet = teamNetKills(Team.RED);
        int blueNet = teamNetKills(Team.BLUE);
        if (redNet != blueNet) {
            return redNet > blueNet ? Team.RED : Team.BLUE;
        }
        return Team.NONE;
    }

    public List<PlayerMatchStats> toProtoStats() {
        List<PlayerMatchStats> result = new ArrayList<>(stats.size());
        for (Map.Entry<Long, MatchStats> entry : stats.entrySet()) {
            long playerId = entry.getKey();
            result.add(MatchProtoMapper.toProto(
                    playerId,
                    names.getOrDefault(playerId, "Player-" + playerId),
                    teams.getOrDefault(playerId, Team.NONE),
                    entry.getValue()));
        }
        return result;
    }

    public void reset() {
        stats.clear();
        names.clear();
        teams.clear();
        damageLog.clear();
        winnerOverride = Team.NONE;
    }
}
