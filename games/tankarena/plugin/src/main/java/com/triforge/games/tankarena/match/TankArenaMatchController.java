package com.triforge.games.tankarena.match;

import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchPhaseMachine;
import com.triforge.protocol.proto.RoomLobbySnapshot;

import java.util.Collection;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Tank Arena lobby and match flow: roster, team captain rules, and phase transitions via
 * {@link MatchPhaseMachine}.
 */
public final class TankArenaMatchController implements MatchController {
    public static final int TICKS_PER_SECOND = MatchPhaseMachine.TICKS_PER_SECOND;

    private final MatchPhaseMachine phaseMachine;
    private final Map<Long, LobbyPlayer> lobbyPlayers = new LinkedHashMap<>();
    private final Map<Team, TeamSetup> teamSetups = new EnumMap<>(Team.class);
    private long hostPlayerId = -1L;

    public TankArenaMatchController(MatchConfig config) {
        this.phaseMachine = new MatchPhaseMachine(Objects.requireNonNull(config, "config"));
    }

    @Override
    public MatchPhase phase() {
        return phaseMachine.phase();
    }

    @Override
    public MatchConfig config() {
        return phaseMachine.config();
    }

    public long hostPlayerId() {
        return hostPlayerId;
    }

    public void setHostPlayerId(long playerId) {
        this.hostPlayerId = playerId;
    }

    public boolean isHost(long playerId) {
        return hostPlayerId == playerId;
    }

    @Override
    public int countdownTicksRemaining() {
        return phaseMachine.countdownTicksRemaining();
    }

    @Override
    public int matchTicksRemaining() {
        return phaseMachine.matchTicksRemaining();
    }

    @Override
    public int countdownSecondsRemaining() {
        return phaseMachine.countdownSecondsRemaining();
    }

    @Override
    public int matchSecondsRemaining() {
        return phaseMachine.matchSecondsRemaining();
    }

    @Override
    public long matchRemainingMs() {
        return phaseMachine.matchRemainingMs();
    }

    public Collection<LobbyPlayer> players() {
        return lobbyPlayers.values();
    }

    public LobbyPlayer player(long playerId) {
        return lobbyPlayers.get(playerId);
    }

    public void putPlayer(LobbyPlayer player) {
        lobbyPlayers.put(player.playerId(), player);
    }

    public void removePlayer(long playerId) {
        LobbyPlayer removed = lobbyPlayers.remove(playerId);
        if (removed != null && removed.team().isPlayable()) {
            reassignTeamCaptain(removed.team());
        }
        if (hostPlayerId == playerId) {
            hostPlayerId = lobbyPlayers.keySet().stream().findFirst().orElse(-1L);
        }
    }

    public int playerCount() {
        return lobbyPlayers.size();
    }

    public TeamSetup teamSetup(Team team) {
        return teamSetups.get(team);
    }

    public Collection<TeamSetup> teamSetups() {
        return teamSetups.values();
    }

    public SpawnRegion spawnRegionForPlayer(LobbyPlayer player) {
        if (!player.team().isPlayable()) {
            return SpawnRegion.UNSPECIFIED;
        }
        TeamSetup setup = teamSetups.get(player.team());
        return setup != null ? setup.spawnRegion() : SpawnRegion.UNSPECIFIED;
    }

    public boolean isTeamCaptain(long playerId) {
        LobbyPlayer player = lobbyPlayers.get(playerId);
        return player != null && player.isTeamCaptain();
    }

    public boolean setDisplayName(long playerId, String name) {
        LobbyPlayer player = editablePlayer(playerId);
        if (player == null || !LobbyPlayer.isValidName(name)) {
            return false;
        }
        putPlayer(player.withDisplayName(name));
        return true;
    }

    public boolean setTeam(long playerId, Team team) {
        LobbyPlayer player = editablePlayer(playerId);
        if (player == null || team == null) {
            return false;
        }
        if (team.isPlayable() && !teamSwitchKeepsBalance(playerId, team)) {
            return false;
        }

        Team previousTeam = player.team();
        putPlayer(player.withTeam(team).withReady(false).withTeamCaptain(false));

        if (previousTeam.isPlayable() && previousTeam != team) {
            reassignTeamCaptain(previousTeam);
        }

        if (team.isPlayable()) {
            ensureTeamCaptain(playerId, team);
        }
        return true;
    }

    public boolean setTeamSetup(long playerId, SpawnRegion spawnRegion, SpawnRegion hqRegion) {
        LobbyPlayer player = editablePlayer(playerId);
        if (player == null || !player.team().isPlayable() || !player.isTeamCaptain()) {
            return false;
        }
        if (spawnRegion == null || hqRegion == null
                || !spawnRegion.isChosen() || !hqRegion.isChosen()) {
            return false;
        }
        Team team = player.team();
        if (!spawnRegion.isValidForTeam(team) || !hqRegion.isValidForTeam(team)) {
            return false;
        }

        teamSetups.put(team, new TeamSetup(team, playerId, spawnRegion, hqRegion));
        syncTeamSpawnRegions(team, spawnRegion);
        clearReadyForTeam(team);
        return true;
    }

    public boolean setSpawnRegion(long playerId, SpawnRegion region) {
        LobbyPlayer player = editablePlayer(playerId);
        if (player == null || !player.isTeamCaptain() || region == null || !region.isChosen()) {
            return false;
        }
        TeamSetup existing = teamSetups.get(player.team());
        SpawnRegion hq = existing != null && existing.hqRegion().isChosen()
                ? existing.hqRegion()
                : region;
        return setTeamSetup(playerId, region, hq);
    }

    public boolean setReady(long playerId, boolean ready) {
        LobbyPlayer player = editablePlayer(playerId);
        if (player == null) {
            return false;
        }
        if (ready && !player.canReady(teamSetups.get(player.team()))) {
            return false;
        }
        putPlayer(player.withReady(ready));
        return true;
    }

    private LobbyPlayer editablePlayer(long playerId) {
        return phaseMachine.phase() == MatchPhase.LOBBY ? lobbyPlayers.get(playerId) : null;
    }

    private void ensureTeamCaptain(long joiningPlayerId, Team team) {
        TeamSetup existing = teamSetups.get(team);
        long captainId = existing != null ? existing.captainPlayerId() : -1L;
        if (captainId != -1L && lobbyPlayers.containsKey(captainId)
                && lobbyPlayers.get(captainId).team() == team
                && lobbyPlayers.get(captainId).isTeamCaptain()) {
            return;
        }
        lobbyPlayers.values().stream()
                .filter(player -> player.team() == team)
                .findFirst()
                .ifPresent(player -> promoteCaptain(player.playerId(), team));
    }

    private void reassignTeamCaptain(Team team) {
        TeamSetup setup = teamSetups.get(team);
        long currentCaptain = setup != null ? setup.captainPlayerId() : -1L;
        if (currentCaptain != -1L && lobbyPlayers.containsKey(currentCaptain)
                && lobbyPlayers.get(currentCaptain).team() == team) {
            return;
        }
        for (LobbyPlayer member : lobbyPlayers.values()) {
            if (member.team() == team) {
                promoteCaptain(member.playerId(), team);
                return;
            }
        }
        teamSetups.remove(team);
        clearCaptainFlags(team);
    }

    private void promoteCaptain(long playerId, Team team) {
        clearCaptainFlags(team);
        LobbyPlayer player = lobbyPlayers.get(playerId);
        if (player == null) {
            return;
        }
        putPlayer(player.withTeamCaptain(true));
        TeamSetup previous = teamSetups.get(team);
        if (previous != null) {
            teamSetups.put(team, new TeamSetup(team, playerId, previous.spawnRegion(), previous.hqRegion()));
        }
    }

    private void clearCaptainFlags(Team team) {
        for (LobbyPlayer member : lobbyPlayers.values()) {
            if (member.team() == team && member.isTeamCaptain()) {
                putPlayer(member.withTeamCaptain(false));
            }
        }
    }

    private void syncTeamSpawnRegions(Team team, SpawnRegion spawnRegion) {
        for (LobbyPlayer member : lobbyPlayers.values()) {
            if (member.team() == team) {
                putPlayer(member.withSpawnRegion(spawnRegion));
            }
        }
    }

    private void clearReadyForTeam(Team team) {
        for (LobbyPlayer member : lobbyPlayers.values()) {
            if (member.team() == team && member.ready()) {
                putPlayer(member.withReady(false));
            }
        }
    }

    private boolean teamSwitchKeepsBalance(long playerId, Team target) {
        int red = 0;
        int blue = 0;
        for (LobbyPlayer player : lobbyPlayers.values()) {
            Team effective = player.playerId() == playerId ? target : player.team();
            if (effective == Team.RED) {
                red++;
            } else if (effective == Team.BLUE) {
                blue++;
            }
        }
        return Math.abs(red - blue) <= 1;
    }

    public boolean hasMinimumPlayers() {
        return lobbyPlayers.size() >= phaseMachine.config().minPlayers();
    }

    public boolean everyoneReady() {
        return !lobbyPlayers.isEmpty() && lobbyPlayers.values().stream().allMatch(LobbyPlayer::ready);
    }

    public boolean teamsConfigured() {
        boolean hasRed = lobbyPlayers.values().stream().anyMatch(p -> p.team() == Team.RED);
        boolean hasBlue = lobbyPlayers.values().stream().anyMatch(p -> p.team() == Team.BLUE);
        if (hasRed) {
            TeamSetup red = teamSetups.get(Team.RED);
            if (red == null || !red.isComplete()) {
                return false;
            }
        }
        if (hasBlue) {
            TeamSetup blue = teamSetups.get(Team.BLUE);
            if (blue == null || !blue.isComplete()) {
                return false;
            }
        }
        return true;
    }

    public boolean canStartMatch() {
        return phaseMachine.phase() == MatchPhase.LOBBY
                && hasMinimumPlayers()
                && everyoneReady()
                && teamsConfigured();
    }

    public RoomLobbySnapshot toLobbySnapshot(String roomId, String roomName) {
        RoomLobbySnapshot.Builder builder = RoomLobbySnapshot.newBuilder()
                .setRoomId(roomId)
                .setRoomName(roomName)
                .setPhase(MatchProtoMapper.toProto(phaseMachine.phase()))
                .setMinPlayers(phaseMachine.config().minPlayers())
                .setCanStart(canStartMatch());
        for (LobbyPlayer player : lobbyPlayers.values()) {
            builder.addPlayers(MatchProtoMapper.toProto(player));
        }
        for (TeamSetup setup : teamSetups.values()) {
            builder.addTeamSetups(MatchProtoMapper.toProto(setup));
        }
        return builder.build();
    }

    public void startCountdown() {
        phaseMachine.startCountdown();
    }

    public void startMatch() {
        phaseMachine.startMatch();
    }

    public void endMatch() {
        phaseMachine.endMatch();
    }

    public void returnToLobby() {
        phaseMachine.returnToLobby();
        lobbyPlayers.replaceAll((id, player) -> player.withReady(false));
    }

    @Override
    public int scoreboardTicksRemaining() {
        return phaseMachine.scoreboardTicksRemaining();
    }

    @Override
    public void tickScoreboard() {
        phaseMachine.tickScoreboard();
    }

    @Override
    public boolean scoreboardFinished() {
        return phaseMachine.scoreboardFinished();
    }

    @Override
    public void tickCountdown() {
        phaseMachine.tickCountdown();
    }

    @Override
    public void tickMatch() {
        phaseMachine.tickMatch();
    }

    @Override
    public boolean matchTimeExpired() {
        return phaseMachine.matchTimeExpired();
    }

    public boolean countdownFinished() {
        return phaseMachine.countdownFinished();
    }
}
