package com.triforge.games.treasurequest.pvp;

import com.triforge.games.treasurequest.content.Question;
import com.triforge.protocol.proto.DuelSubmit;
import com.triforge.protocol.proto.QuizAnswer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** Scores duel answers and resolves winner / tie / steal transfer. */
public final class DuelScorer {

    private DuelScorer() {
    }

    public record ScoreResult(int correctCount, int totalQuestions) {
    }

    public record Outcome(
            long winnerPlayerId,
            boolean tie,
            int lowerCorrect,
            int higherCorrect,
            int stealAmount,
            int lowerScoreDelta,
            int higherScoreDelta
    ) {
    }

    public static ScoreResult score(List<Question> questions, DuelSubmit submit, long currentTick, long deadlineTick) {
        Objects.requireNonNull(questions, "questions");
        Objects.requireNonNull(submit, "submit");
        int totalQuestions = questions.size();
        if (currentTick > deadlineTick) {
            return new ScoreResult(0, totalQuestions);
        }

        Map<String, QuizAnswer> answersById = indexAnswers(submit);
        int correctCount = 0;
        for (Question question : questions) {
            QuizAnswer answer = answersById.get(question.id());
            if (answer != null && question.isCorrect(answer.getSelectedIndex())) {
                correctCount++;
            }
        }
        return new ScoreResult(correctCount, totalQuestions);
    }

    public static Outcome resolve(
            long lowerPlayerId,
            long higherPlayerId,
            int lowerCorrect,
            int higherCorrect,
            int lowerScore,
            int higherScore,
            int lowerPower,
            int higherPower,
            double stealPct
    ) {
        if (lowerCorrect > higherCorrect) {
            return winForLower(lowerPlayerId, lowerCorrect, higherCorrect, higherScore, stealPct);
        }
        if (higherCorrect > lowerCorrect) {
            return winForHigher(higherPlayerId, lowerPlayerId, lowerCorrect, higherCorrect, lowerScore, stealPct);
        }
        if (lowerPower > higherPower) {
            return winForLower(lowerPlayerId, lowerCorrect, higherCorrect, higherScore, stealPct);
        }
        if (higherPower > lowerPower) {
            return winForHigher(higherPlayerId, lowerPlayerId, lowerCorrect, higherCorrect, lowerScore, stealPct);
        }
        return new Outcome(0L, true, lowerCorrect, higherCorrect, 0, 0, 0);
    }

    private static Outcome winForLower(
            long lowerPlayerId,
            int lowerCorrect,
            int higherCorrect,
            int higherScore,
            double stealPct
    ) {
        int steal = stealAmount(higherScore, stealPct);
        return new Outcome(lowerPlayerId, false, lowerCorrect, higherCorrect, steal, steal, -steal);
    }

    private static Outcome winForHigher(
            long higherPlayerId,
            long lowerPlayerId,
            int lowerCorrect,
            int higherCorrect,
            int lowerScore,
            double stealPct
    ) {
        int steal = stealAmount(lowerScore, stealPct);
        return new Outcome(higherPlayerId, false, lowerCorrect, higherCorrect, steal, -steal, steal);
    }

    static int stealAmount(int loserScore, double stealPct) {
        return (int) Math.round(stealPct * loserScore);
    }

    private static Map<String, QuizAnswer> indexAnswers(DuelSubmit submit) {
        Map<String, QuizAnswer> answers = new HashMap<>();
        for (QuizAnswer answer : submit.getAnswersList()) {
            if (!answer.getQuestionId().isEmpty()) {
                answers.put(answer.getQuestionId(), answer);
            }
        }
        return answers;
    }
}
