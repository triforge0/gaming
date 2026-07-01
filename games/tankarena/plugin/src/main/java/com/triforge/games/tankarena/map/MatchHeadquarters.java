package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.Team;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/** Per-match HP for each team's headquarters. Reset when a new match starts. */
public final class MatchHeadquarters {
    private List<HeadquartersDefinition> definitions;
    private final Map<Team, Integer> hp = new EnumMap<>(Team.class);

    public MatchHeadquarters(GameMap gameMap) {
        syncFromMap(gameMap);
    }

    public void syncFromMap(GameMap gameMap) {
        this.definitions = List.copyOf(gameMap.headquarters());
        reset();
    }

    public void reset() {
        hp.clear();
        for (HeadquartersDefinition definition : definitions) {
            hp.put(definition.team(), definition.maxHp());
        }
    }

    public int hp(Team team) {
        return hp.getOrDefault(team, 0);
    }

    public int maxHp(Team team) {
        for (HeadquartersDefinition definition : definitions) {
            if (definition.team() == team) {
                return definition.maxHp();
            }
        }
        return 0;
    }

    public boolean hasTeam(Team team) {
        return hp.containsKey(team);
    }

    /** Applies one hit. Returns remaining HP, or {@code -1} if the team has no HQ or it is already destroyed. */
    public int applyDamage(Team team) {
        Integer current = hp.get(team);
        if (current == null || current <= 0) {
            return -1;
        }
        int remaining = current - 1;
        hp.put(team, remaining);
        return remaining;
    }

    public boolean isDestroyed(Team team) {
        return hasTeam(team) && hp.get(team) <= 0;
    }
}
