package com.triforge.games.f1racing;

import com.triforge.games.f1racing.race.LapCounter;
import com.triforge.protocol.proto.F1QualifyingEntry;
import com.triforge.protocol.proto.F1QualifyingResult;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/** Builds qualifying grid order from recorded best laps. */
final class QualifyingGrid {

    private QualifyingGrid() {
    }

    static F1QualifyingResult build(F1Lobby lobby, Map<Long, LapCounter> lapCounters) {
        List<RankedDriver> ranked = new ArrayList<>();
        for (F1Lobby.Player player : lobby.playersSnapshot()) {
            LapCounter counter = lapCounters.get(player.playerId());
            long bestMs = counter == null ? 0L : counter.bestLapMs();
            ranked.add(new RankedDriver(player.playerId(), player.displayName(), player.bot(), bestMs));
        }

        ranked.sort(Comparator
                .comparingLong(RankedDriver::bestLapMs)
                .thenComparingLong(RankedDriver::playerId));

        List<RankedDriver> withTime = new ArrayList<>();
        List<RankedDriver> withoutTime = new ArrayList<>();
        for (RankedDriver driver : ranked) {
            if (driver.bestLapMs() > 0L) {
                withTime.add(driver);
            } else {
                withoutTime.add(driver);
            }
        }
        withTime.addAll(withoutTime);

        List<F1QualifyingEntry> entries = new ArrayList<>(withTime.size());
        int slot = 0;
        for (RankedDriver driver : withTime) {
            entries.add(F1QualifyingEntry.newBuilder()
                    .setPlayerId(driver.playerId())
                    .setDisplayName(driver.displayName())
                    .setGridSlot(slot++)
                    .setBestLapMs(driver.bestLapMs())
                    .setIsBot(driver.bot())
                    .build());
        }
        return F1QualifyingResult.newBuilder().addAllEntries(entries).build();
    }

    static List<Long> playerOrder(F1QualifyingResult result) {
        List<F1QualifyingEntry> ordered = new ArrayList<>(result.getEntriesList());
        ordered.sort(Comparator.comparingInt(F1QualifyingEntry::getGridSlot));
        return ordered.stream().map(F1QualifyingEntry::getPlayerId).toList();
    }

    private record RankedDriver(long playerId, String displayName, boolean bot, long bestLapMs) {
    }
}
