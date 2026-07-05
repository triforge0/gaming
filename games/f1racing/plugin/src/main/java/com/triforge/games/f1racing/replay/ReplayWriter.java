package com.triforge.games.f1racing.replay;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

public final class ReplayWriter {

    private static final ObjectMapper MAPPER = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);
    private static final DateTimeFormatter STAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
            .withLocale(Locale.ROOT)
            .withZone(ZoneOffset.UTC);

    private ReplayWriter() {
    }

    public static Path replaysDirectory() {
        String base = System.getProperty("f1racing.data.dir", "data/f1racing");
        return Path.of(base, "replays");
    }

    public static String buildFileName(String roomId) {
        String safeRoom = roomId.replace(':', '-').replace('/', '-');
        return safeRoom + "-" + STAMP.format(Instant.now()) + ".f1replay";
    }

    public static Optional<ReplayDocument> write(
            String roomId,
            String trackId,
            long durationMs,
            java.util.List<ReplayFrame> frames
    ) {
        if (frames.isEmpty()) {
            return Optional.empty();
        }
        String fileName = buildFileName(roomId);
        ReplayDocument document = ReplayDocument.create(roomId, trackId, durationMs, fileName, frames);
        try {
            Path dir = replaysDirectory();
            Files.createDirectories(dir);
            Path target = dir.resolve(fileName);
            MAPPER.writeValue(target.toFile(), document);
            ReplayArchive.publish(document);
            return Optional.of(document);
        } catch (IOException exception) {
            return Optional.empty();
        }
    }
}
