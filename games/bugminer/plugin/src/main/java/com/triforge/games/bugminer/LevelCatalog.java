package com.triforge.games.bugminer;

/** Level metadata mirrored from shared/levels.ts. */
final class LevelCatalog {
    private LevelCatalog() {}

    static int timeLimit(String levelId) {
        return switch (levelId) {
            case "rock-mine" -> 80;
            case "diamond-cave" -> 75;
            case "chaos-mine" -> 70;
            case "night-mine" -> 60;
            default -> 90;
        };
    }

    static int targetScore(String levelId) {
        return switch (levelId) {
            case "rock-mine" -> 1000;
            case "diamond-cave" -> 1200;
            case "chaos-mine" -> 1500;
            case "night-mine" -> 1800;
            default -> 800;
        };
    }
}
