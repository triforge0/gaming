package com.triforge.games.tankarena.match;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LobbyPlayerTest {

    @Test
    void joiningPlayerStartsUnassignedAndNotReady() {
        LobbyPlayer player = LobbyPlayer.joining(1L, "Bình", true);

        assertEquals(Team.NONE, player.team());
        assertEquals(SpawnRegion.UNSPECIFIED, player.spawnRegion());
        assertFalse(player.ready());
        assertTrue(player.isHost());
        assertFalse(player.canReady(null));
    }

    @Test
    void nameIsTrimmed() {
        assertEquals("Linh", LobbyPlayer.joining(1L, "  Linh  ", false).displayName());
    }

    @Test
    void blankNameIsRejected() {
        assertThrows(IllegalArgumentException.class, () -> LobbyPlayer.joining(1L, "   ", false));
        assertThrows(IllegalArgumentException.class, () -> LobbyPlayer.joining(1L, null, false));
    }

    @Test
    void overlongNameIsRejected() {
        String tooLong = "x".repeat(LobbyPlayer.MAX_NAME_LENGTH + 1);
        assertThrows(IllegalArgumentException.class, () -> LobbyPlayer.joining(1L, tooLong, false));
    }

    @Test
    void nameValidationBoundaries() {
        assertFalse(LobbyPlayer.isValidName(null));
        assertFalse(LobbyPlayer.isValidName("  "));
        assertTrue(LobbyPlayer.isValidName("a"));
        assertTrue(LobbyPlayer.isValidName("x".repeat(LobbyPlayer.MAX_NAME_LENGTH)));
        assertFalse(LobbyPlayer.isValidName("x".repeat(LobbyPlayer.MAX_NAME_LENGTH + 1)));
    }

    @Test
    void withersProduceConfiguredReadyPlayer() {
        LobbyPlayer player = LobbyPlayer.joining(1L, "Thắng", false)
                .withTeam(Team.RED)
                .withSpawnRegion(SpawnRegion.BOTTOM_RIGHT)
                .withReady(true);

        assertEquals(Team.RED, player.team());
        assertEquals(SpawnRegion.BOTTOM_RIGHT, player.spawnRegion());
        assertTrue(player.ready());
        TeamSetup setup = new TeamSetup(Team.RED, 1L, SpawnRegion.BOTTOM_RIGHT, SpawnRegion.BOTTOM_RIGHT);
        assertTrue(player.canReady(setup));
    }
}
