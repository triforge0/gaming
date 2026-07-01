package com.triforge.server.application.room;

import com.triforge.games.tankarena.match.LobbyPlayer;
import com.triforge.engine.match.MatchConfig;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.TankArenaMatchController;
import com.triforge.games.tankarena.match.Team;
import com.triforge.games.tankarena.match.TeamSetup;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.SetTeamAction;
import com.triforge.protocol.proto.SetTeamSetupAction;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LobbyCommandTest {

    private TankArenaMatchController controllerWith(long... playerIds) {
        TankArenaMatchController controller = new TankArenaMatchController(MatchConfig.defaults());
        for (long id : playerIds) {
            controller.putPlayer(LobbyPlayer.joining(id, "P" + id, id == playerIds[0]));
        }
        return controller;
    }

    @Test
    void setDisplayNameAppliesAndTrims() {
        TankArenaMatchController controller = controllerWith(1L);
        assertTrue(controller.setDisplayName(1L, "  Thắng  "));
        assertEquals("Thắng", controller.player(1L).displayName());
    }

    @Test
    void setDisplayNameRejectsBlank() {
        TankArenaMatchController controller = controllerWith(1L);
        assertFalse(controller.setDisplayName(1L, "   "));
        assertEquals("P1", controller.player(1L).displayName());
    }

    @Test
    void setTeamRejectsImbalancedSwitch() {
        TankArenaMatchController controller = controllerWith(1L, 2L);
        assertTrue(controller.setTeam(1L, Team.RED));
        assertFalse(controller.setTeam(2L, Team.RED), "second RED would make it 2v0");
        assertTrue(controller.setTeam(2L, Team.BLUE));
        assertEquals(Team.RED, controller.player(1L).team());
        assertEquals(Team.BLUE, controller.player(2L).team());
    }

    @Test
    void changingTeamClearsReady() {
        TankArenaMatchController controller = controllerWith(1L);
        LobbyTestSupport.configureTeam(controller, 1L, Team.RED, SpawnRegion.TOP_LEFT);
        assertTrue(controller.setReady(1L, true));
        assertTrue(controller.player(1L).ready());

        assertTrue(controller.setTeam(1L, Team.BLUE));
        assertFalse(controller.player(1L).ready(), "switching team must clear ready");
    }

    @Test
    void setTeamSetupRejectsWrongSideAndClearsReady() {
        TankArenaMatchController controller = controllerWith(1L);
        controller.setTeam(1L, Team.RED);
        assertFalse(controller.setTeamSetup(1L, SpawnRegion.TOP_RIGHT, SpawnRegion.BOTTOM_RIGHT));

        assertTrue(controller.setTeamSetup(1L, SpawnRegion.TOP_LEFT, SpawnRegion.BOTTOM_LEFT));
        controller.setReady(1L, true);
        assertTrue(controller.setTeamSetup(1L, SpawnRegion.BOTTOM_LEFT, SpawnRegion.TOP_LEFT));
        assertFalse(controller.player(1L).ready(), "changing team setup must clear ready");
    }

    @Test
    void readyRequiresTeamAndCaptainSetup() {
        TankArenaMatchController controller = controllerWith(1L);
        assertFalse(controller.setReady(1L, true), "no team");

        controller.setTeam(1L, Team.RED);
        assertFalse(controller.setReady(1L, true), "team but no captain setup");

        controller.setTeamSetup(1L, SpawnRegion.TOP_LEFT, SpawnRegion.BOTTOM_LEFT);
        assertTrue(controller.setReady(1L, true));
        assertTrue(controller.setReady(1L, false), "un-ready always allowed");
    }

    @Test
    void editsRejectedOutsideLobbyPhase() {
        TankArenaMatchController controller = controllerWith(1L);
        controller.startCountdown();
        assertFalse(controller.setTeam(1L, Team.RED));
        assertFalse(controller.setDisplayName(1L, "Late"));
        assertFalse(controller.setReady(1L, true));
    }

    @Test
    void unknownPlayerRejected() {
        TankArenaMatchController controller = controllerWith(1L);
        assertFalse(controller.setTeam(99L, Team.RED));
    }

    @Test
    void protoCommandFlowsThroughGameRoom() {
        try (GameRoom room = new GameRoom("lobby-cmd-room")) {
            TankArenaRoomSupport.match(room).putPlayer(LobbyPlayer.joining(1L, "Thắng", true));

            room.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                    .setSetTeam(SetTeamAction.newBuilder()
                            .setTeam(com.triforge.protocol.proto.Team.TEAM_RED))
                    .build());
            assertEquals(Team.RED, TankArenaRoomSupport.match(room).player(1L).team());
            assertTrue(TankArenaRoomSupport.match(room).player(1L).isTeamCaptain());

            room.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                    .setSetTeamSetup(SetTeamSetupAction.newBuilder()
                            .setSpawnRegion(com.triforge.protocol.proto.SpawnRegion.TOP_LEFT)
                            .setHqRegion(com.triforge.protocol.proto.SpawnRegion.BOTTOM_LEFT))
                    .build());
            assertEquals(SpawnRegion.TOP_LEFT, TankArenaRoomSupport.match(room).player(1L).spawnRegion());

            room.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                    .setSetReady(SetReadyAction.newBuilder().setReady(true))
                    .build());
            assertTrue(TankArenaRoomSupport.match(room).player(1L).ready());
        }
    }
}
