package com.triforge.games.treasurequest.quiz;

import com.triforge.games.treasurequest.content.Question;
import com.triforge.games.treasurequest.content.QuizSet;
import com.triforge.protocol.proto.QuizAnswer;
import com.triforge.protocol.proto.QuizSubmit;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/** Scores a {@link QuizSubmit} against authoritative quiz content. */
public final class QuizScorer {

    private QuizScorer() {
    }

    public record Result(int correctCount, int pointsEarned, int totalQuestions, boolean passed) {
    }

    public static Result score(QuizSet quiz, QuizSubmit submit, QuizSession session, long currentTick) {
        Objects.requireNonNull(quiz, "quiz");
        Objects.requireNonNull(submit, "submit");
        Objects.requireNonNull(session, "session");

        int totalQuestions = quiz.questions().size();
        if (session.isExpired(currentTick)) {
            return new Result(0, 0, totalQuestions, false);
        }

        Map<String, QuizAnswer> answersById = indexAnswers(submit);
        int correctCount = 0;
        int pointsEarned = 0;

        for (Question question : quiz.questions()) {
            QuizAnswer answer = answersById.get(question.id());
            if (answer == null || session.isQuestionLate(question.id(), currentTick)) {
                continue;
            }
            if (question.isCorrect(answer.getSelectedIndex())) {
                correctCount++;
                pointsEarned += question.points();
            }
        }

        return new Result(correctCount, pointsEarned, totalQuestions, pointsEarned >= quiz.passThreshold());
    }

    private static Map<String, QuizAnswer> indexAnswers(QuizSubmit submit) {
        Map<String, QuizAnswer> answers = new HashMap<>();
        for (QuizAnswer answer : submit.getAnswersList()) {
            if (!answer.getQuestionId().isEmpty()) {
                answers.put(answer.getQuestionId(), answer);
            }
        }
        return answers;
    }
}
