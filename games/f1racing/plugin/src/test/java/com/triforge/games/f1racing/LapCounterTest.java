package com.triforge.games.f1racing;

import com.triforge.games.f1racing.race.CheckpointDetector;
import com.triforge.games.f1racing.race.LapCounter;
import com.triforge.games.f1racing.race.RaceStandings;
import com.triforge.games.f1racing.track.TrackDefinition;
import com.triforge.games.f1racing.track.TrackLoader;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LapCounterTest {

    @Test
    void orderedCheckpointCrossingIncrementsLap() {
        TrackDefinition track = TrackLoader.loadClasspath("city-loop");
        CheckpointDetector detector = new CheckpointDetector(track);
        LapCounter counter = new LapCounter(track.checkpoints().size(), 3, 0L);

        for (var checkpoint : track.checkpoints()) {
            counter.updatePosition(checkpoint.x(), checkpoint.y(), detector, 60, 60);
        }

        assertEquals(1, counter.lap());
        assertEquals(0, counter.nextCheckpointIndex());
    }

    @Test
    void skippingCheckpointDoesNotAdvanceLap() {
        TrackDefinition track = TrackLoader.loadClasspath("city-loop");
        CheckpointDetector detector = new CheckpointDetector(track);
        LapCounter counter = new LapCounter(track.checkpoints().size(), 3, 0L);

        var cp1 = track.checkpoints().get(1);
        counter.updatePosition(cp1.x(), cp1.y(), detector, 10, 60);

        assertEquals(0, counter.lap());
        assertEquals(0, counter.nextCheckpointIndex());
    }

    @Test
    void standingsSortByLapThenProgress() {
        RaceStandings standings = new RaceStandings();
        var sorted = standings.sort(List.of(
                new RaceStandings.CarProgress(1L, "A", 1, 3, 100f, 1000L, 0L, 0L, false, false),
                new RaceStandings.CarProgress(2L, "B", 2, 1, 50f, 900L, 0L, 0L, false, false)));

        assertEquals(2L, sorted.getFirst().getPlayerId());
        assertEquals(1, sorted.getFirst().getPosition());
    }

    @Test
    void finishedCarsRankByFinishTimeNotTrackPosition() {
        RaceStandings standings = new RaceStandings();
        // Both finished on lap 2; the earlier finisher (900ms) has driven less far past the line
        // (alongDistance 10) than the later finisher (1200ms, alongDistance 500). Classification
        // must follow finish time, so the 900ms car is P1 regardless of post-finish position.
        var sorted = standings.sort(List.of(
                new RaceStandings.CarProgress(1L, "Late", 2, 0, 500f, 1200L, 0L, 0L, true, false),
                new RaceStandings.CarProgress(2L, "Early", 2, 0, 10f, 900L, 0L, 0L, true, false),
                new RaceStandings.CarProgress(3L, "Running", 1, 4, 800f, 950L, 0L, 0L, false, false)));

        assertEquals(2L, sorted.get(0).getPlayerId());
        assertEquals(1L, sorted.get(1).getPlayerId());
        assertEquals(3L, sorted.get(2).getPlayerId());
    }

    @Test
    void completesTargetLaps() {
        TrackDefinition track = TrackLoader.loadClasspath("city-loop");
        CheckpointDetector detector = new CheckpointDetector(track);
        LapCounter counter = new LapCounter(track.checkpoints().size(), 2, 0L);

        for (int lap = 0; lap < 2; lap++) {
            for (var checkpoint : track.checkpoints()) {
                counter.updatePosition(checkpoint.x(), checkpoint.y(), detector, lap * 100L, 60);
            }
        }

        assertTrue(counter.finished());
        assertEquals(2, counter.lap());
    }
}
