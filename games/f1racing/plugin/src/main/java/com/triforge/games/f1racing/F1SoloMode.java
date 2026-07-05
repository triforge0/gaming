package com.triforge.games.f1racing;

import java.util.Locale;
import java.util.Optional;

/** Single-player entry modes (room ids under {@code f1racing:sp:…}). */
enum F1SoloMode {
    PRACTICE,
    TIME_TRIAL,
    RACE_BOTS;

    static Optional<F1SoloMode> parse(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return switch (token.toLowerCase(Locale.ROOT)) {
            case "practice" -> Optional.of(PRACTICE);
            case "trial", "time-trial", "timetrial" -> Optional.of(TIME_TRIAL);
            case "bots", "race-bots", "racebots" -> Optional.of(RACE_BOTS);
            default -> Optional.empty();
        };
    }
}

record F1SoloRoom(F1SoloMode mode, String trackId) {

    private static final String PREFIX = "f1racing:sp:";

    static Optional<F1SoloRoom> parse(String roomId) {
        if (roomId == null || !roomId.startsWith(PREFIX)) {
            return Optional.empty();
        }
        String[] parts = roomId.split(":");
        if (parts.length < 4) {
            return Optional.empty();
        }
        Optional<F1SoloMode> mode = F1SoloMode.parse(parts[2]);
        if (mode.isEmpty()) {
            return Optional.empty();
        }
        String trackId = parts.length >= 5 ? parts[3] : F1Constants.DEFAULT_TRACK_ID;
        return Optional.of(new F1SoloRoom(mode.get(), trackId));
    }
}
