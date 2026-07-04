package com.triforge.games.bugminer;

import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchPhaseProtoMapper;
import com.triforge.protocol.proto.LobbyPlayer;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.Team;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/** Minimal lobby state for the bugminer plugin (no teams, spawns, or HQ). */
final class BugMinerLobby {

    static final int MIN_PLAYERS = 1;
    static final int MAX_NAME_LENGTH = 24;

    private final Map<Long, Player> players = new LinkedHashMap<>();
    private long hostPlayerId;

    int playerCount() {
        return players.size();
    }
    
    List<Long> playerIds() {
        return new ArrayList<>(players.keySet());
    }

    boolean isHost(long playerId) {
        return playerId == hostPlayerId;
    }

    Long getPlayerIdByName(String name) {
        if (name == null) return null;
        String trimmed = name.trim();
        for (Player p : players.values()) {
            if (p.displayName().equalsIgnoreCase(trimmed)) {
                return p.playerId();
            }
        }
        return null;
    }

    Optional<Player> player(long playerId) {
        return Optional.ofNullable(players.get(playerId));
    }

    void addPlayer(long playerId, String displayName, boolean host) {
        players.put(playerId, new Player(playerId, displayName, true, host));
        if (host) {
            hostPlayerId = playerId;
        }
    }

    void removePlayer(long playerId) {
        players.remove(playerId);
        if (hostPlayerId == playerId) {
            hostPlayerId = players.keySet().stream().findFirst().orElse(0L);
            if (hostPlayerId != 0L) {
                players.computeIfPresent(hostPlayerId, (id, player) -> player.withHost(true));
            }
        }
    }

    boolean setDisplayName(long playerId, String displayName) {
        if (!isValidName(displayName)) {
            return false;
        }
        return replace(playerId, player -> player.withDisplayName(displayName.trim()));
    }

    boolean setReady(long playerId, boolean ready) {
        return replace(playerId, player -> player.withReady(ready));
    }

    boolean allReady() {
        return !players.isEmpty() && players.values().stream().allMatch(Player::ready);
    }

    boolean canStartMatch(MatchPhase phase) {
        return phase == MatchPhase.LOBBY && playerCount() >= MIN_PLAYERS && allReady();
    }

    void resetAllReady() {
        players.replaceAll((id, player) -> player.withReady(false));
    }

    RoomLobbySnapshot toSnapshot(String roomId, String roomName, MatchPhase phase, boolean canStart) {
        List<LobbyPlayer> protoPlayers = new ArrayList<>(players.size());
        for (Player player : players.values()) {
            protoPlayers.add(LobbyPlayer.newBuilder()
                    .setPlayerId(player.playerId())
                    .setDisplayName(player.displayName())
                    .setTeam(Team.TEAM_NONE)
                    .setReady(player.ready())
                    .setIsHost(player.host())
                    .build());
        }
        return RoomLobbySnapshot.newBuilder()
                .setRoomId(roomId)
                .setRoomName(roomName)
                .setPhase(MatchPhaseProtoMapper.toProto(phase))
                .addAllPlayers(protoPlayers)
                .setMinPlayers(MIN_PLAYERS)
                .setCanStart(canStart)
                .build();
    }

    private boolean replace(long playerId, java.util.function.UnaryOperator<Player> updater) {
        Player current = players.get(playerId);
        if (current == null) {
            return false;
        }
        players.put(playerId, updater.apply(current));
        return true;
    }

    static boolean isValidName(String name) {
        if (name == null) {
            return false;
        }
        String trimmed = name.trim();
        return !trimmed.isEmpty() && trimmed.length() <= MAX_NAME_LENGTH;
    }

    static String defaultName(long playerId) {
        return "Player-" + playerId;
    }

    record Player(long playerId, String displayName, boolean ready, boolean host) {

        Player {
            displayName = Objects.requireNonNull(displayName, "displayName");
        }

        Player withDisplayName(String newName) {
            return new Player(playerId, newName, ready, host);
        }

        Player withReady(boolean newReady) {
            return new Player(playerId, displayName, newReady, host);
        }

        Player withHost(boolean newHost) {
            return new Player(playerId, displayName, ready, newHost);
        }
    }
}
