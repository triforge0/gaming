package com.triforge.games.tankarena.match;

import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchPhase;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class TankArenaMatchControllerTest {

    private TankArenaMatchController newController() {
        return new TankArenaMatchController(MatchConfig.defaults());
    }

    @Test
    void defaultsToLobby() {
        TankArenaMatchController controller = newController();
        assertEquals(MatchPhase.LOBBY, controller.phase());
        assertEquals(0, controller.playerCount());
        assertEquals(-1L, controller.hostPlayerId());
    }

    @Test
    void rosterTracksPlayersAndReassignsHostOnLeave() {
        TankArenaMatchController controller = newController();
        controller.putPlayer(LobbyPlayer.joining(1L, "Thắng", true));
        controller.putPlayer(LobbyPlayer.joining(2L, "An", false));
        controller.setHostPlayerId(1L);

        assertEquals(2, controller.playerCount());
        assertTrue(controller.isHost(1L));
        assertFalse(controller.isHost(2L));

        controller.removePlayer(1L);
        assertEquals(1, controller.playerCount());
        assertEquals(2L, controller.hostPlayerId(), "host should fall through to remaining player");

        controller.removePlayer(2L);
        assertEquals(-1L, controller.hostPlayerId(), "no host when roster empties");
    }
}
