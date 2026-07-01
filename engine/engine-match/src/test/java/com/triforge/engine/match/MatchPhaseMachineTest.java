package com.triforge.engine.match;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class MatchPhaseMachineTest {

    private MatchPhaseMachine newMachine() {
        return new MatchPhaseMachine(MatchConfig.defaults());
    }

    @Test
    void defaultsToLobby() {
        MatchPhaseMachine machine = newMachine();
        assertEquals(MatchPhase.LOBBY, machine.phase());
    }

    @Test
    void transitionsAdvanceThroughTheLifecycle() {
        MatchPhaseMachine machine = newMachine();

        machine.startCountdown();
        assertEquals(MatchPhase.COUNTDOWN, machine.phase());
        assertEquals(MatchConfig.defaults().countdownSeconds() * MatchPhaseMachine.TICKS_PER_SECOND,
                machine.countdownTicksRemaining());

        machine.startMatch();
        assertEquals(MatchPhase.PLAYING, machine.phase());
        assertEquals(0, machine.countdownTicksRemaining());
        assertEquals(MatchConfig.defaults().matchDurationSeconds() * MatchPhaseMachine.TICKS_PER_SECOND,
                machine.matchTicksRemaining());

        machine.endMatch();
        assertEquals(MatchPhase.ENDED, machine.phase());
        assertEquals(0, machine.matchTicksRemaining());

        machine.returnToLobby();
        assertEquals(MatchPhase.LOBBY, machine.phase());
    }

    @Test
    void tickCountdownDecrementsAndFloorsAtZero() {
        MatchPhaseMachine machine = newMachine();
        machine.startCountdown();
        int start = machine.countdownTicksRemaining();

        machine.tickCountdown();
        assertEquals(start - 1, machine.countdownTicksRemaining());

        for (int i = 0; i < start + 10; i++) {
            machine.tickCountdown();
        }
        assertEquals(0, machine.countdownTicksRemaining());
        assertTrue(machine.countdownFinished());
    }
}
