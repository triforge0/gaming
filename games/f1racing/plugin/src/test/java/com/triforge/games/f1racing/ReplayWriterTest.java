package com.triforge.games.f1racing;

import com.triforge.games.f1racing.replay.ReplayArchive;
import com.triforge.games.f1racing.replay.ReplayFrame;
import com.triforge.games.f1racing.replay.ReplayWriter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ReplayWriterTest {

    @TempDir
    Path tempDir;

    @Test
    void writesReplayFileAndPublishesArchive() throws Exception {
        ReplayArchive.clear();
        System.setProperty("f1racing.data.dir", tempDir.toString());

        var document = ReplayWriter.write(
                "f1racing:city-loop:TEST",
                "city-loop",
                12_000L,
                List.of(new ReplayFrame(3L, 1L, "Alice", "formula-modern", "#e10600",
                        10f, 20f, 0f, 1.5f, 42f, false)));

        assertTrue(document.isPresent());
        assertTrue(Files.exists(tempDir.resolve("replays").resolve(document.get().fileName())));
        assertEquals(document.get().fileName(), ReplayArchive.lastReplay().orElseThrow().fileName());

        System.clearProperty("f1racing.data.dir");
    }
}
