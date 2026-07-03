package com.triforge.games.treasurequest.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Parses the quiz catalog from JSON ({@code {"quizzes":[{id,passThreshold,questions:[...]}]} }). */
public final class QuizLoader {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private QuizLoader() {
    }

    public static QuizCatalog load(ContentSource source, String relPath) throws IOException {
        Objects.requireNonNull(source, "source");
        try (InputStream in = source.open(relPath)) {
            return parseBytes(in.readAllBytes());
        }
    }

    public static QuizCatalog parseBytes(byte[] json) throws IOException {
        return fromDefinition(MAPPER.readValue(json, QuizFile.class));
    }

    static QuizCatalog fromDefinition(QuizFile file) {
        Objects.requireNonNull(file, "file");
        if (file.quizzes() == null || file.quizzes().isEmpty()) {
            throw new IllegalArgumentException("Quiz file must define at least one quiz");
        }
        List<QuizSet> quizzes = new ArrayList<>();
        for (QuizDefinition quiz : file.quizzes()) {
            List<Question> questions = new ArrayList<>();
            if (quiz.questions() != null) {
                for (QuestionDefinition q : quiz.questions()) {
                    questions.add(new Question(
                            q.id(), q.text(), q.options(), q.correctIndex(), q.points(), q.timeLimitSec()));
                }
            }
            quizzes.add(new QuizSet(quiz.id(), quiz.passThreshold(), questions));
        }
        return new QuizCatalog(quizzes);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record QuizFile(List<QuizDefinition> quizzes) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record QuizDefinition(String id, int passThreshold, List<QuestionDefinition> questions) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record QuestionDefinition(
            String id,
            String text,
            List<String> options,
            int correctIndex,
            int points,
            int timeLimitSec
    ) {
    }
}
