package com.triforge.games.treasurequest.checkpoint;

import com.triforge.games.treasurequest.content.ContentSource;
import com.triforge.games.treasurequest.content.QuestContent;
import com.triforge.games.treasurequest.content.Rect;
import com.triforge.games.treasurequest.world.WorldBounds;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class CheckpointZoneDetectorTest {

    private final QuestContent content = QuestContent.loadDefault(ContentSource.classpathOnly());
    private final CheckpointZoneDetector detector = new CheckpointZoneDetector(content.map());

    @Test
    void overlapsStartCheckpointZoneAtCenter() {
        var start = content.map().checkpoints().start();
        float x = start.zone().centerWorldX(content.map().tileSize());
        float y = start.zone().centerWorldY(content.map().tileSize());

        assertTrue(detector.isInCurrentCheckpointZone(content.map().checkpoints(), start.id(), x, y));
    }

    @Test
    void doesNotOverlapWhenOutsideZone() {
        assertFalse(detector.isInCurrentCheckpointZone(
                content.map().checkpoints(), "cp1", 500f, 500f));
    }

    @Test
    void avatarEdgeMustOverlapZoneTiles() {
        Rect zone = new Rect(2, 6, 2, 2);
        int tileSize = content.map().tileSize();
        float zoneMinX = zone.x() * tileSize;
        float justOutside = zoneMinX - WorldBounds.AVATAR_HALF_SIZE - 1f;

        assertFalse(detector.avatarOverlapsZone(zone, justOutside, zone.centerWorldY(tileSize)));
    }
}
