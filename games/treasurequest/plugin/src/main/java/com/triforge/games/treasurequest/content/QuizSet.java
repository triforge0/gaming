package com.triforge.games.treasurequest.content;

import java.util.List;
import java.util.Objects;

/** An ordered set of questions with a {@code passThreshold} in points needed to clear the checkpoint. */
public record QuizSet(String id, int passThreshold, List<Question> questions) {

    public QuizSet {
        id = Objects.requireNonNull(id, "id");
        questions = List.copyOf(Objects.requireNonNull(questions, "questions"));
        if (questions.isEmpty()) {
            throw new IllegalArgumentException("Quiz '" + id + "' must have at least one question");
        }
        if (passThreshold < 0) {
            throw new IllegalArgumentException("Quiz '" + id + "' passThreshold must be >= 0");
        }
    }

    public int totalPoints() {
        return questions.stream().mapToInt(Question::points).sum();
    }

    public Question question(String questionId) {
        return questions.stream().filter(q -> q.id().equals(questionId)).findFirst().orElse(null);
    }
}
