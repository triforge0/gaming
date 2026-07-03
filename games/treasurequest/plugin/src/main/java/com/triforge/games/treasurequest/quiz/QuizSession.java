package com.triforge.games.treasurequest.quiz;

import com.triforge.engine.loop.GameLoop;
import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.Question;
import com.triforge.games.treasurequest.content.QuizSet;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/** Active quiz attempt for one player; per-question deadlines are cumulative from {@code startedTick}. */
public final class QuizSession {

    private final long playerId;
    private final String quizId;
    private final String checkpointId;
    private final long startedTick;
    private final long deadlineTick;
    private final Map<String, Long> questionDeadlines;

    private QuizSession(
            long playerId,
            String quizId,
            String checkpointId,
            long startedTick,
            long deadlineTick,
            Map<String, Long> questionDeadlines
    ) {
        this.playerId = playerId;
        this.quizId = quizId;
        this.checkpointId = checkpointId;
        this.startedTick = startedTick;
        this.deadlineTick = deadlineTick;
        this.questionDeadlines = questionDeadlines;
    }

    public static QuizSession start(long playerId, QuizSet quiz, Checkpoint checkpoint, long currentTick) {
        return start(playerId, quiz, checkpoint, currentTick, 1f);
    }

    public static QuizSession start(
            long playerId,
            QuizSet quiz,
            Checkpoint checkpoint,
            long currentTick,
            float speedMultiplier
    ) {
        Objects.requireNonNull(quiz, "quiz");
        Objects.requireNonNull(checkpoint, "checkpoint");

        float timeMultiplier = speedMultiplier > 1f ? speedMultiplier : 1f;
        long tick = currentTick;
        Map<String, Long> deadlines = new LinkedHashMap<>();
        for (Question question : quiz.questions()) {
            tick += (long) (question.timeLimitSec() * timeMultiplier * GameLoop.TPS);
            deadlines.put(question.id(), tick);
        }
        return new QuizSession(playerId, quiz.id(), checkpoint.id(), currentTick, tick, Map.copyOf(deadlines));
    }

    public long playerId() {
        return playerId;
    }

    public String quizId() {
        return quizId;
    }

    public String checkpointId() {
        return checkpointId;
    }

    public long startedTick() {
        return startedTick;
    }

    public long deadlineTick() {
        return deadlineTick;
    }

    public boolean isExpired(long currentTick) {
        return currentTick > deadlineTick;
    }

    public boolean isQuestionLate(String questionId, long currentTick) {
        Long deadline = questionDeadlines.get(questionId);
        return deadline == null || currentTick > deadline;
    }
}
