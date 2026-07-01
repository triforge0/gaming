package com.triforge.engine.match;

/** Generic match phase and timer surface exposed by any game plugin. */
public interface MatchController {

    MatchPhase phase();

    MatchConfig config();

    int countdownTicksRemaining();

    int matchTicksRemaining();

    int countdownSecondsRemaining();

    int matchSecondsRemaining();

    long matchRemainingMs();

    int scoreboardTicksRemaining();

    void tickCountdown();

    void tickMatch();

    void tickScoreboard();

    boolean scoreboardFinished();

    boolean matchTimeExpired();
}
