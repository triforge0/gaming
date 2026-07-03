package com.triforge.games.treasurequest.content;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** Picks a fixed-size question set for PvP duels from the loaded quiz catalog. */
public final class DuelQuestionPicker {

    private DuelQuestionPicker() {
    }

    public static List<Question> pick(QuizCatalog catalog, int count, String duelId) {
        if (count <= 0) {
            throw new IllegalArgumentException("count must be > 0");
        }
        List<Question> pool = catalog.allQuestions();
        if (pool.size() < count) {
            throw new IllegalArgumentException(
                    "Need at least " + count + " questions for duels but catalog has " + pool.size());
        }
        List<Question> sorted = new ArrayList<>(pool);
        sorted.sort(Comparator.comparing(Question::id));
        int maxStart = sorted.size() - count;
        int start = Math.floorMod(duelId.hashCode(), maxStart + 1);
        return List.copyOf(sorted.subList(start, start + count));
    }
}
