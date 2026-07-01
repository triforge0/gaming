package com.triforge.server.application.room;

import com.triforge.engine.match.MatchConfig;
import com.triforge.games.tankarena.match.LobbyPlayer;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.TankArenaMatchController;
import com.triforge.games.tankarena.match.Team;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class TeamCaptainTest {

    @Test
    void firstPlayerOnTeamBecomesCaptain() {
        TankArenaMatchController controller = new TankArenaMatchController(MatchConfig.defaults());
        controller.putPlayer(LobbyPlayer.joining(1L, "P1", true));
        controller.putPlayer(LobbyPlayer.joining(2L, "P2", false));
        controller.putPlayer(LobbyPlayer.joining(3L, "P3", false));

        assertTrue(controller.setTeam(1L, Team.RED));
        assertTrue(controller.setTeam(2L, Team.BLUE));
        assertTrue(controller.player(1L).isTeamCaptain());
        assertTrue(controller.player(2L).isTeamCaptain());

        assertTrue(controller.setTeam(3L, Team.RED));
        assertTrue(controller.player(1L).isTeamCaptain());
        assertFalse(controller.player(3L).isTeamCaptain());
    }

    @Test
    void onlyCaptainMayConfigureTeamSetup() {
        TankArenaMatchController controller = new TankArenaMatchController(MatchConfig.defaults());
        controller.putPlayer(LobbyPlayer.joining(1L, "Cap", true));
        controller.putPlayer(LobbyPlayer.joining(2L, "Mem", false));
        assertTrue(controller.setTeam(1L, Team.BLUE));
        assertTrue(controller.setTeam(2L, Team.RED));

        assertFalse(controller.setTeamSetup(2L, SpawnRegion.TOP_RIGHT, SpawnRegion.BOTTOM_RIGHT));
        assertTrue(controller.setTeamSetup(1L, SpawnRegion.TOP_RIGHT, SpawnRegion.BOTTOM_RIGHT));
    }

    @Test
    void captainReassignedWhenCaptainLeavesTeam() {
        TankArenaMatchController controller = new TankArenaMatchController(MatchConfig.defaults());
        controller.putPlayer(LobbyPlayer.joining(1L, "Cap", true));
        controller.putPlayer(LobbyPlayer.joining(2L, "Mem", false));
        controller.putPlayer(LobbyPlayer.joining(3L, "Blue", false));
        assertTrue(controller.setTeam(1L, Team.RED));
        assertTrue(controller.setTeam(3L, Team.BLUE));
        assertTrue(controller.setTeam(2L, Team.RED));
        controller.setTeamSetup(1L, SpawnRegion.TOP_LEFT, SpawnRegion.BOTTOM_LEFT);

        assertTrue(controller.setTeam(1L, Team.NONE));

        assertTrue(controller.player(2L).isTeamCaptain());
        assertEquals(2L, controller.teamSetup(Team.RED).captainPlayerId());
    }

    @Test
    void membersReadyWhenCaptainConfiguredSpawnAndHq() {
        TankArenaMatchController controller = new TankArenaMatchController(MatchConfig.defaults());
        controller.putPlayer(LobbyPlayer.joining(1L, "Cap", true));
        controller.putPlayer(LobbyPlayer.joining(2L, "Mem", false));
        controller.putPlayer(LobbyPlayer.joining(3L, "Blue", false));
        assertTrue(controller.setTeam(1L, Team.RED));
        assertTrue(controller.setTeam(3L, Team.BLUE));
        assertTrue(controller.setTeam(2L, Team.RED));

        assertFalse(controller.setReady(2L, true));
        controller.setTeamSetup(1L, SpawnRegion.TOP_LEFT, SpawnRegion.BOTTOM_LEFT);
        assertTrue(controller.setReady(2L, true));
    }
}
