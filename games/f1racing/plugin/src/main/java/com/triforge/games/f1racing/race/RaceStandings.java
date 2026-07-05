package com.triforge.games.f1racing.race;

import com.triforge.protocol.proto.F1StandingEntry;

import java.util.ArrayList;
import java.util.List;

/** Sorts live race positions from lap + distance-to-next-checkpoint. */
public final class RaceStandings {

    public record CarProgress(
            long playerId,
            String name,
            int lap,
            int nextCheckpoint,
            float alongDistance,
            long totalTimeMs,
            long bestLapMs,
            long lastLapMs,
            boolean finished,
            boolean bot
    ) {
    }

    public List<F1StandingEntry> sort(List<CarProgress> cars) {
        List<CarProgress> ordered = new ArrayList<>(cars);
        ordered.sort(RaceStandings::compareProgress);

        List<F1StandingEntry> entries = new ArrayList<>(ordered.size());
        int position = 1;
        for (CarProgress car : ordered) {
            entries.add(F1StandingEntry.newBuilder()
                    .setPlayerId(car.playerId())
                    .setDisplayName(car.name())
                    .setPosition(position++)
                    .setLap(car.lap())
                    .setBestLapMs(car.bestLapMs())
                    .setLastLapMs(car.lastLapMs())
                    .setTotalTimeMs(car.totalTimeMs())
                    .setFinished(car.finished())
                    .setIsBot(car.bot())
                    .build());
        }
        return entries;
    }

    /**
     * Finished cars rank ahead of running cars and are ordered by (frozen) finish time — never by
     * their post-finish track position. Running cars are ordered by race progress.
     */
    private static int compareProgress(CarProgress a, CarProgress b) {
        if (a.finished() != b.finished()) {
            return a.finished() ? -1 : 1;
        }
        if (a.finished()) {
            int byFinishTime = Long.compare(a.totalTimeMs(), b.totalTimeMs());
            return byFinishTime != 0 ? byFinishTime : Long.compare(a.playerId(), b.playerId());
        }
        int byLap = Integer.compare(b.lap(), a.lap());
        if (byLap != 0) {
            return byLap;
        }
        int byCheckpoint = Integer.compare(b.nextCheckpoint(), a.nextCheckpoint());
        if (byCheckpoint != 0) {
            return byCheckpoint;
        }
        int byDistance = Double.compare(b.alongDistance(), a.alongDistance());
        if (byDistance != 0) {
            return byDistance;
        }
        return Long.compare(a.totalTimeMs(), b.totalTimeMs());
    }
}
