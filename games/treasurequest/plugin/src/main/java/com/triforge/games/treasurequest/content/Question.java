package com.triforge.games.treasurequest.content;

import java.util.List;
import java.util.Objects;

/**
 * One multiple-choice question. {@code correctIndex} is authoritative server state and is NEVER
 * placed on the wire before an answer is scored.
 */
public record Question(
        String id,
        String text,
        List<String> options,
        int correctIndex,
        int points,
        int timeLimitSec
) {

    public Question {
        id = Objects.requireNonNull(id, "id");
        text = Objects.requireNonNull(text, "text");
        options = List.copyOf(Objects.requireNonNull(options, "options"));
        if (options.size() < 2) {
            throw new IllegalArgumentException("Question '" + id + "' must have >= 2 options");
        }
        if (correctIndex < 0 || correctIndex >= options.size()) {
            throw new IllegalArgumentException("Question '" + id + "' correctIndex out of range: " + correctIndex);
        }
        if (points < 0) {
            throw new IllegalArgumentException("Question '" + id + "' points must be >= 0");
        }
        if (timeLimitSec <= 0) {
            throw new IllegalArgumentException("Question '" + id + "' timeLimitSec must be > 0");
        }
    }

    public boolean isCorrect(int selectedIndex) {
        return selectedIndex == correctIndex;
    }
}
