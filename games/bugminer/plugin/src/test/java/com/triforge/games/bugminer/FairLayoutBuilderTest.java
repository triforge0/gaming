package com.triforge.games.bugminer;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

final class FairLayoutBuilderTest {

    @Test
    void buildsPlacedLayoutForRoomSeed() {
        List<PlacedItem> layout = FairLayoutBuilder.build("easy-mine", "ROOM-FAIR-1");
        assertFalse(layout.isEmpty());
        for (PlacedItem item : layout) {
            assertFalse(item.x == 0f && item.y == 0f, "item should be placed");
        }
    }

    @Test
    void sameSeedProducesIdenticalLayout() {
        List<PlacedItem> a = FairLayoutBuilder.build("easy-mine", "SAME-ROOM");
        List<PlacedItem> b = FairLayoutBuilder.build("easy-mine", "SAME-ROOM");
        assertEquals(a.size(), b.size());
        for (int i = 0; i < a.size(); i++) {
            assertEquals(a.get(i).type, b.get(i).type);
            assertEquals(a.get(i).x, b.get(i).x, 0.01f);
            assertEquals(a.get(i).y, b.get(i).y, 0.01f);
        }
    }
}
