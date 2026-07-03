package com.triforge.games.treasurequest.content;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class QuestContentTest {

    // ── Happy path: the bundled seed loads and cross-validates ──────────────

    @Test
    void loadsSeedExpedition() {
        QuestContent content = QuestContent.loadDefault(ContentSource.classpathOnly());

        QuestMap map = content.map();
        assertEquals(20, map.width());
        assertEquals(15, map.height());
        assertEquals(32, map.tileSize());

        assertEquals(5, map.checkpoints().size());
        assertEquals("cp1", map.checkpoints().start().id());
        assertTrue(map.checkpoints().boss().isPresent());
        assertEquals("boss", map.checkpoints().boss().get().id());
        assertEquals(List.of("cp2a", "cp2b"), map.checkpoints().get("cp1").next());

        assertNotNull(map.treasure());
        assertEquals(5, content.quizzes().size());
        assertEquals(0.20, content.config().stealPct());
    }

    @Test
    void seedZonesResolveToWalkableTiles() {
        QuestMap map = QuestContent.loadDefault(ContentSource.classpathOnly()).map();
        for (Checkpoint cp : map.checkpoints().all()) {
            Rect z = cp.zone();
            assertTrue(z.withinMap(map.width(), map.height()), cp.id() + " within map");
            assertTrue(!map.tileAt(z.x(), z.y()).blocksMovement(), cp.id() + " on walkable tile");
        }
    }

    // ── Malformed content is rejected ──────────────────────────────────────

    @Test
    void rejectsQuestionWithCorrectIndexOutOfRange() {
        assertThrows(IllegalArgumentException.class, () ->
                new Question("bad", "?", List.of("a", "b"), 5, 10, 20));
    }

    @Test
    void rejectsQuestionWithTooFewOptions() {
        assertThrows(IllegalArgumentException.class, () ->
                new Question("bad", "?", List.of("only-one"), 0, 10, 20));
    }

    @Test
    void rejectsCheckpointGraphWithDanglingNext() {
        Checkpoint cp = new Checkpoint("cp1", new Rect(1, 1, 1, 1), "q1",
                List.of("ghost"), true, CheckpointRisk.NORMAL, "", Reward.NONE);
        assertThrows(IllegalArgumentException.class, () -> new CheckpointGraph(List.of(cp), "cp1"));
    }

    @Test
    void rejectsCheckpointGraphWithoutBoss() {
        Checkpoint cp = new Checkpoint("cp1", new Rect(1, 1, 1, 1), "q1",
                List.of(), false, CheckpointRisk.NORMAL, "", Reward.NONE);
        assertThrows(IllegalArgumentException.class, () -> new CheckpointGraph(List.of(cp), "cp1"));
    }

    @Test
    void rejectsCheckpointZoneOutsideMap() {
        QuestTileType[] tiles = new QuestTileType[4 * 4];
        Arrays.fill(tiles, QuestTileType.EMPTY);
        Checkpoint offMap = new Checkpoint("boss", new Rect(3, 3, 2, 2), "q1",
                List.of(), true, CheckpointRisk.NORMAL, "", Reward.NONE);
        CheckpointGraph graph = new CheckpointGraph(List.of(offMap), "boss");
        TreasureZone treasure = new TreasureZone(new Rect(0, 0, 1, 1));
        assertThrows(IllegalArgumentException.class, () -> new QuestMap(4, 4, 32, tiles, graph, treasure));
    }

    @Test
    void rejectsCheckpointReferencingUnknownQuiz() {
        QuestMap map = QuestContent.loadDefault(ContentSource.classpathOnly()).map();
        // Catalog is missing every quiz the map's checkpoints reference.
        QuizCatalog empty = new QuizCatalog(List.of(new QuizSet("unused", 10,
                List.of(new Question("x", "?", List.of("a", "b"), 0, 10, 20)))));
        assertThrows(IllegalArgumentException.class,
                () -> new QuestContent(map, empty, ExpeditionConfig.defaults()));
    }
}
