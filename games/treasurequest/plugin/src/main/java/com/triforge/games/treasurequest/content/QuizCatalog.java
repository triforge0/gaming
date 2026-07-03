package com.triforge.games.treasurequest.content;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** Lookup of quiz sets by id, loaded from {@code data/quizzes.json}. */
public final class QuizCatalog {

    private final Map<String, QuizSet> byId;

    public QuizCatalog(List<QuizSet> quizzes) {
        Objects.requireNonNull(quizzes, "quizzes");
        Map<String, QuizSet> map = new LinkedHashMap<>();
        for (QuizSet quiz : quizzes) {
            if (map.put(quiz.id(), quiz) != null) {
                throw new IllegalArgumentException("Duplicate quiz id: " + quiz.id());
            }
        }
        this.byId = map;
    }

    public QuizSet get(String id) {
        return byId.get(id);
    }

    public boolean has(String id) {
        return byId.containsKey(id);
    }

    public int size() {
        return byId.size();
    }

    /** Stable pool of every question across all quiz sets (quiz file order, then question order). */
    public List<Question> allQuestions() {
        List<Question> all = new ArrayList<>();
        for (QuizSet quiz : byId.values()) {
            all.addAll(quiz.questions());
        }
        return List.copyOf(all);
    }
}
