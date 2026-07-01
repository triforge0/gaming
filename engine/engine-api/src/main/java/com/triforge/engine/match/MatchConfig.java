package com.triforge.engine.match;

/** Tunable timing and roster parameters for a match phase machine. */
public record MatchConfig(
        int countdownSeconds,
        int matchDurationSeconds,
        int scoreboardDelaySeconds,
        int minPlayers,
        boolean requireBalancedTeams
) {
    public MatchConfig {
        if (countdownSeconds < 0 || matchDurationSeconds <= 0 || scoreboardDelaySeconds < 0 || minPlayers < 1) {
            throw new IllegalArgumentException(
                    "Invalid match config: countdown=" + countdownSeconds
                            + " duration=" + matchDurationSeconds
                            + " scoreboardDelay=" + scoreboardDelaySeconds
                            + " minPlayers=" + minPlayers);
        }
    }

    public static final String DURATION_OVERRIDE_PROPERTY = "triforge.match.durationSeconds";
    private static final String LEGACY_DURATION_OVERRIDE_PROPERTY = "tankarena.match.durationSeconds";

    public static MatchConfig defaults() {
        return new MatchConfig(3, resolveDurationSeconds(300), 15, 2, true);
    }

    public MatchConfig withCountdownSeconds(int countdownSeconds) {
        return new MatchConfig(countdownSeconds, matchDurationSeconds, scoreboardDelaySeconds, minPlayers, requireBalancedTeams);
    }

    public MatchConfig withMatchDurationSeconds(int matchDurationSeconds) {
        return new MatchConfig(countdownSeconds, matchDurationSeconds, scoreboardDelaySeconds, minPlayers, requireBalancedTeams);
    }

    public MatchConfig withScoreboardDelaySeconds(int scoreboardDelaySeconds) {
        return new MatchConfig(countdownSeconds, matchDurationSeconds, scoreboardDelaySeconds, minPlayers, requireBalancedTeams);
    }

    public MatchConfig withMinPlayers(int minPlayers) {
        return new MatchConfig(countdownSeconds, matchDurationSeconds, scoreboardDelaySeconds, minPlayers, requireBalancedTeams);
    }

    public MatchConfig withRequireBalancedTeams(boolean requireBalancedTeams) {
        return new MatchConfig(countdownSeconds, matchDurationSeconds, scoreboardDelaySeconds, minPlayers, requireBalancedTeams);
    }

    private static int resolveDurationSeconds(int fallback) {
        String override = System.getProperty(DURATION_OVERRIDE_PROPERTY);
        if (override == null || override.isBlank()) {
            override = System.getProperty(LEGACY_DURATION_OVERRIDE_PROPERTY);
        }
        if (override == null || override.isBlank()) {
            return fallback;
        }
        try {
            int parsed = Integer.parseInt(override.trim());
            return parsed > 0 ? parsed : fallback;
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    public long matchDurationMs() {
        return matchDurationSeconds * 1000L;
    }
}
