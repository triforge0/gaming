package com.triforge.games.tankarena.match;

import java.util.Objects;

/** Immutable lobby-side view of a player's match configuration. */
public record LobbyPlayer(
        long playerId,
        String displayName,
        Team team,
        SpawnRegion spawnRegion,
        boolean ready,
        boolean isHost,
        boolean isTeamCaptain
) {
    public static final int MAX_NAME_LENGTH = 24;

    public LobbyPlayer {
        displayName = normalizeName(displayName);
        team = Objects.requireNonNullElse(team, Team.NONE);
        spawnRegion = Objects.requireNonNullElse(spawnRegion, SpawnRegion.UNSPECIFIED);
    }

    public static LobbyPlayer joining(long playerId, String displayName, boolean isHost) {
        return new LobbyPlayer(playerId, displayName, Team.NONE, SpawnRegion.UNSPECIFIED, false, isHost, false);
    }

    public LobbyPlayer withDisplayName(String newName) {
        return new LobbyPlayer(playerId, newName, team, spawnRegion, ready, isHost, isTeamCaptain);
    }

    public LobbyPlayer withTeam(Team newTeam) {
        return new LobbyPlayer(playerId, displayName, newTeam, spawnRegion, ready, isHost, isTeamCaptain);
    }

    public LobbyPlayer withSpawnRegion(SpawnRegion newRegion) {
        return new LobbyPlayer(playerId, displayName, team, newRegion, ready, isHost, isTeamCaptain);
    }

    public LobbyPlayer withReady(boolean newReady) {
        return new LobbyPlayer(playerId, displayName, team, spawnRegion, newReady, isHost, isTeamCaptain);
    }

    public LobbyPlayer withTeamCaptain(boolean captain) {
        return new LobbyPlayer(playerId, displayName, team, spawnRegion, ready, isHost, captain);
    }

    public boolean canReady(TeamSetup teamSetup) {
        return team.isPlayable()
                && teamSetup != null
                && teamSetup.isComplete();
    }

    public static boolean isValidName(String name) {
        if (name == null) {
            return false;
        }
        String trimmed = name.trim();
        return !trimmed.isEmpty() && trimmed.length() <= MAX_NAME_LENGTH;
    }

    private static String normalizeName(String name) {
        if (!isValidName(name)) {
            throw new IllegalArgumentException(
                    "Display name must be non-blank and at most " + MAX_NAME_LENGTH + " characters");
        }
        return name.trim();
    }
}
