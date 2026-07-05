package com.triforge.games.f1racing.replay;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

/** In-memory index of the most recent replay for HTTP download. */
public final class ReplayArchive {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final AtomicReference<ReplayDocument> LAST = new AtomicReference<>();

    private ReplayArchive() {
    }

    public static void publish(ReplayDocument document) {
        LAST.set(document);
    }

    public static Optional<ReplayDocument> lastReplay() {
        return Optional.ofNullable(LAST.get());
    }

    public static Optional<String> lastReplayJson() {
        ReplayDocument document = LAST.get();
        if (document == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(MAPPER.writeValueAsString(document));
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    public static void clear() {
        LAST.set(null);
    }
}
