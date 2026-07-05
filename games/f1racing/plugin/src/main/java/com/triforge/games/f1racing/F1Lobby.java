package com.triforge.games.f1racing;

import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchPhaseProtoMapper;
import com.triforge.protocol.proto.F1GarageLoadout;
import com.triforge.protocol.proto.LobbyPlayer;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.Team;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/** Lobby roster, ready flags, and per-player cosmetic loadouts. */
final class F1Lobby {

    static final int MAX_NAME_LENGTH = 24;

    private final Map<Long, Player> players = new LinkedHashMap<>();
    private long hostPlayerId;
    private long nextBotId = -1L;

    int botCount() {
        return (int) players.values().stream().filter(Player::bot).count();
    }

    boolean addBot() {
        long botId = nextBotId--;
        return players.put(
                botId,
                new Player(botId, "Bot " + Math.abs(botId), true, false, true, defaultLoadout())) == null;
    }

    void ensureBotCount(int targetBots, F1RoomConfigState config) {
        int safeTarget = Math.max(0, targetBots);
        while (botCount() < safeTarget && !isFull(config)) {
            addBot();
        }
    }

    boolean kickPlayer(long playerId) {
        if (playerId == hostPlayerId) {
            return false;
        }
        return players.remove(playerId) != null;
    }

    int playerCount() {
        return players.size();
    }

    boolean isHost(long playerId) {
        return playerId == hostPlayerId;
    }

    boolean isFull(F1RoomConfigState config) {
        return playerCount() >= config.maxPlayers();
    }

    Optional<Player> player(long playerId) {
        return Optional.ofNullable(players.get(playerId));
    }

    List<Player> playersSnapshot() {
        return List.copyOf(players.values());
    }

    boolean addPlayer(long playerId, String displayName, boolean host) {
        boolean added = players.put(playerId, new Player(playerId, displayName, false, host, false, defaultLoadout())) == null;
        if (host) {
            hostPlayerId = playerId;
        }
        return added;
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

    boolean setLoadout(long playerId, F1GarageLoadout loadout) {
        return replace(playerId, player -> player.withLoadout(loadout));
    }

    boolean allReady() {
        return !players.isEmpty()
                && players.values().stream().allMatch(player -> player.bot() || player.ready());
    }

    boolean canStartMatch(MatchPhase phase, boolean soloRoom) {
        int minPlayers = soloRoom ? 1 : F1Constants.MIN_PLAYERS;
        return phase == MatchPhase.LOBBY
                && playerCount() >= minPlayers
                && allReady();
    }

    void resetAllReady() {
        players.replaceAll((id, player) -> player.withReady(false));
    }

    RoomLobbySnapshot toSnapshot(
            String roomId,
            String roomName,
            MatchPhase phase,
            boolean canStart,
            F1RoomConfigState config
    ) {
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
                .setMinPlayers(F1Constants.MIN_PLAYERS)
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
        return "Driver-" + playerId;
    }

    private static F1GarageLoadout defaultLoadout() {
        return F1GarageLoadout.newBuilder()
                .setCarId("formula-modern")
                .setPrimaryColor("#e10600")
                .build();
    }

    record Player(long playerId, String displayName, boolean ready, boolean host, boolean bot, F1GarageLoadout loadout) {

        Player {
            displayName = Objects.requireNonNull(displayName, "displayName");
            loadout = loadout == null ? defaultLoadout() : loadout;
        }

        Player withDisplayName(String newName) {
            return new Player(playerId, newName, ready, host, bot, loadout);
        }

        Player withReady(boolean newReady) {
            return new Player(playerId, displayName, newReady, host, bot, loadout);
        }

        Player withHost(boolean newHost) {
            return new Player(playerId, displayName, ready, newHost, bot, loadout);
        }

        Player withLoadout(F1GarageLoadout newLoadout) {
            return new Player(playerId, displayName, ready, host, bot, newLoadout);
        }
    }
}
