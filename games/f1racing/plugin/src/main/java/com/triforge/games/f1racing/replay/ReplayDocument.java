package com.triforge.games.f1racing.replay;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ReplayDocument(
        String version,
        String roomId,
        String trackId,
        long durationMs,
        String fileName,
        List<ReplayFrame> frames
) {
    public static ReplayDocument create(
            String roomId,
            String trackId,
            long durationMs,
            String fileName,
            List<ReplayFrame> frames
    ) {
        return new ReplayDocument("1", roomId, trackId, durationMs, fileName, List.copyOf(frames));
    }
}
