package com.triforge.games.treasurequest.scoring;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Builds ranked standings for live and final TreasureQuest leaderboards. */
public final class Leaderboard {

    public record PlayerStanding(
            long playerId,
            String name,
            int power,
            int score,
            int checkpointsCleared
    ) {
    }

    public record Entry(
            long playerId,
            String name,
            int power,
            int score,
            int checkpointsCleared,
            int rank
    ) {
    }

    private Leaderboard() {
    }

    public static List<Entry> rank(List<PlayerStanding> standings) {
        Objects.requireNonNull(standings, "standings");
        List<PlayerStanding> sorted = standings.stream()
                .sorted(Leaderboard::compareByRank)
                .toList();

        List<Entry> ranked = new ArrayList<>(sorted.size());
        for (int i = 0; i < sorted.size(); i++) {
            PlayerStanding standing = sorted.get(i);
            ranked.add(new Entry(
                    standing.playerId(),
                    standing.name(),
                    standing.power(),
                    standing.score(),
                    standing.checkpointsCleared(),
                    i + 1));
        }
        return List.copyOf(ranked);
    }

    public static boolean orderChanged(List<Entry> previous, List<Entry> current) {
        if (previous.size() != current.size()) {
            return true;
        }
        for (int i = 0; i < previous.size(); i++) {
            Entry before = previous.get(i);
            Entry after = current.get(i);
            if (before.playerId() != after.playerId()
                    || before.power() != after.power()
                    || before.score() != after.score()
                    || before.checkpointsCleared() != after.checkpointsCleared()
                    || before.rank() != after.rank()) {
                return true;
            }
        }
        return false;
    }

    public static com.triforge.protocol.proto.Leaderboard toProto(List<Entry> entries, boolean finalStandings) {
        com.triforge.protocol.proto.Leaderboard.Builder builder =
                com.triforge.protocol.proto.Leaderboard.newBuilder()
                        .setFinalStandings(finalStandings);
        for (Entry entry : entries) {
            builder.addEntries(com.triforge.protocol.proto.LeaderboardEntry.newBuilder()
                    .setPlayerId(entry.playerId())
                    .setName(entry.name())
                    .setPower(entry.power())
                    .setScore(entry.score())
                    .setCheckpointsCleared(entry.checkpointsCleared())
                    .setRank(entry.rank())
                    .build());
        }
        return builder.build();
    }

    private static int compareByRank(PlayerStanding left, PlayerStanding right) {
        int byPower = Integer.compare(right.power(), left.power());
        if (byPower != 0) {
            return byPower;
        }
        int byCheckpoints = Integer.compare(right.checkpointsCleared(), left.checkpointsCleared());
        if (byCheckpoints != 0) {
            return byCheckpoints;
        }
        int byScore = Integer.compare(right.score(), left.score());
        if (byScore != 0) {
            return byScore;
        }
        return Long.compare(left.playerId(), right.playerId());
    }
}
