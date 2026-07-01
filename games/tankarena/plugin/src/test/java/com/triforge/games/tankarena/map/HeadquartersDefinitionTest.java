package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.Team;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class HeadquartersDefinitionTest {

    @Test
    void rectBuildsInclusiveTileBoundsFromSize() {
        HeadquartersDefinition hq = HeadquartersDefinition.rect(Team.RED, 2, 3, 2, 2);

        assertEquals(Team.RED, hq.team());
        assertEquals(2, hq.minTileX());
        assertEquals(3, hq.minTileY());
        assertEquals(3, hq.maxTileX());
        assertEquals(4, hq.maxTileY());
        assertEquals(HeadquartersDefinition.DEFAULT_MAX_HP, hq.maxHp());
        assertTrue(hq.contains(2, 3));
        assertTrue(hq.contains(3, 4));
    }

    @Test
    void rectAcceptsCustomMaxHp() {
        HeadquartersDefinition hq = HeadquartersDefinition.rect(Team.BLUE, 0, 0, 1, 1, 10);

        assertEquals(10, hq.maxHp());
    }

    @Test
    void rectRejectsInvalidTeamOrSize() {
        assertThrows(IllegalArgumentException.class, () -> HeadquartersDefinition.rect(Team.NONE, 0, 0, 1, 1));
        assertThrows(IllegalArgumentException.class, () -> HeadquartersDefinition.rect(Team.RED, 0, 0, 0, 1));
        assertThrows(IllegalArgumentException.class, () -> HeadquartersDefinition.rect(Team.RED, 0, 0, 1, 1, 0));
    }
}
