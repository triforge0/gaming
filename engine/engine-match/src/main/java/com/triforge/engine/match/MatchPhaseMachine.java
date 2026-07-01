package com.triforge.engine.match;

import java.util.Objects;

/**
 * Generic match phase state machine: LOBBY → COUNTDOWN → PLAYING → ENDED → LOBBY.
 * Game-specific lobby rules live in the game plugin; this class only owns phase and timers.
 */
public final class MatchPhaseMachine implements MatchController {
    public static final int TICKS_PER_SECOND = 60;

    private final MatchConfig config;
    private MatchPhase phase = MatchPhase.LOBBY;
    private int countdownTicksRemaining;
    private int matchTicksRemaining;
    private int scoreboardTicksRemaining;

    public MatchPhaseMachine(MatchConfig config) {
        this.config = Objects.requireNonNull(config, "config");
    }

    @Override
    public MatchPhase phase() {
        return phase;
    }

    @Override
    public MatchConfig config() {
        return config;
    }

    @Override
    public int countdownTicksRemaining() {
        return countdownTicksRemaining;
    }

    @Override
    public int matchTicksRemaining() {
        return matchTicksRemaining;
    }

    @Override
    public int countdownSecondsRemaining() {
        return (int) Math.ceil(countdownTicksRemaining / (double) TICKS_PER_SECOND);
    }

    @Override
    public int matchSecondsRemaining() {
        return (int) Math.ceil(matchTicksRemaining / (double) TICKS_PER_SECOND);
    }

    @Override
    public long matchRemainingMs() {
        return matchTicksRemaining * 1000L / TICKS_PER_SECOND;
    }

    @Override
    public int scoreboardTicksRemaining() {
        return scoreboardTicksRemaining;
    }

    public void startCountdown() {
        phase = MatchPhase.COUNTDOWN;
        countdownTicksRemaining = config.countdownSeconds() * TICKS_PER_SECOND;
    }

    public void startMatch() {
        phase = MatchPhase.PLAYING;
        countdownTicksRemaining = 0;
        matchTicksRemaining = config.matchDurationSeconds() * TICKS_PER_SECOND;
    }

    public void endMatch() {
        phase = MatchPhase.ENDED;
        matchTicksRemaining = 0;
        scoreboardTicksRemaining = config.scoreboardDelaySeconds() * TICKS_PER_SECOND;
    }

    public void returnToLobby() {
        phase = MatchPhase.LOBBY;
        countdownTicksRemaining = 0;
        matchTicksRemaining = 0;
        scoreboardTicksRemaining = 0;
    }

    @Override
    public void tickCountdown() {
        if (countdownTicksRemaining > 0) {
            countdownTicksRemaining--;
        }
    }

    @Override
    public void tickMatch() {
        if (matchTicksRemaining > 0) {
            matchTicksRemaining--;
        }
    }

    @Override
    public void tickScoreboard() {
        if (scoreboardTicksRemaining > 0) {
            scoreboardTicksRemaining--;
        }
    }

    @Override
    public boolean scoreboardFinished() {
        return phase == MatchPhase.ENDED && scoreboardTicksRemaining == 0;
    }

    @Override
    public boolean matchTimeExpired() {
        return phase == MatchPhase.PLAYING && matchTicksRemaining == 0;
    }

    public boolean countdownFinished() {
        return phase == MatchPhase.COUNTDOWN && countdownTicksRemaining == 0;
    }
}
