package com.triforge.games.treasurequest.quiz;

import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.CheckpointRisk;
import com.triforge.games.treasurequest.content.ContentSource;
import com.triforge.games.treasurequest.content.Question;
import com.triforge.games.treasurequest.content.QuestContent;
import com.triforge.games.treasurequest.content.QuizSet;
import com.triforge.games.treasurequest.content.Rect;
import com.triforge.games.treasurequest.content.Reward;
import com.triforge.protocol.proto.QuizAnswer;
import com.triforge.protocol.proto.QuizSubmit;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class QuizScorerTest {

    private static final QuizSet QUIZ = new QuizSet(
            "test",
            20,
            List.of(
                    new Question("a", "A?", List.of("x", "y"), 1, 10, 10),
                    new Question("b", "B?", List.of("x", "y"), 0, 10, 10),
                    new Question("c", "C?", List.of("x", "y"), 1, 10, 10)
            ));

    private static final Checkpoint CHECKPOINT = new Checkpoint(
            "cp1",
            new Rect(1, 1, 1, 1),
            "test",
            List.of("cp2"),
            false,
            CheckpointRisk.NORMAL,
            "hint",
            Reward.NONE);

    @Test
    void passWhenPointsMeetThreshold() {
        QuizSession session = QuizSession.start(1L, QUIZ, CHECKPOINT, 0L);
        QuizSubmit submit = QuizSubmit.newBuilder()
                .setQuizId("test")
                .addAnswers(answer("a", 1))
                .addAnswers(answer("b", 0))
                .addAnswers(answer("c", 1))
                .build();

        QuizScorer.Result result = QuizScorer.score(QUIZ, submit, session, 100L);

        assertTrue(result.passed());
        assertEquals(3, result.correctCount());
        assertEquals(30, result.pointsEarned());
    }

    @Test
    void failWhenBelowThreshold() {
        QuizSession session = QuizSession.start(1L, QUIZ, CHECKPOINT, 0L);
        QuizSubmit submit = QuizSubmit.newBuilder()
                .setQuizId("test")
                .addAnswers(answer("a", 0))
                .addAnswers(answer("b", 1))
                .addAnswers(answer("c", 0))
                .build();

        QuizScorer.Result result = QuizScorer.score(QUIZ, submit, session, 100L);

        assertFalse(result.passed());
        assertEquals(0, result.correctCount());
        assertEquals(0, result.pointsEarned());
    }

    @Test
    void expiredSessionScoresZero() {
        QuizSession session = QuizSession.start(1L, QUIZ, CHECKPOINT, 0L);
        QuizSubmit submit = QuizSubmit.newBuilder()
                .setQuizId("test")
                .addAnswers(answer("a", 1))
                .build();

        QuizScorer.Result result = QuizScorer.score(QUIZ, submit, session, session.deadlineTick() + 1);

        assertFalse(result.passed());
        assertEquals(0, result.correctCount());
    }

    @Test
    void lateQuestionAnswerIsIgnored() {
        QuizSession session = QuizSession.start(1L, QUIZ, CHECKPOINT, 0L);
        long afterFirstQuestion = 10L * 60 + 1;
        QuizSubmit submit = QuizSubmit.newBuilder()
                .setQuizId("test")
                .addAnswers(answer("a", 1))
                .build();

        QuizScorer.Result result = QuizScorer.score(QUIZ, submit, session, afterFirstQuestion);

        assertEquals(0, result.correctCount());
        assertEquals(0, result.pointsEarned());
        assertFalse(result.passed());
    }

    private static QuizAnswer answer(String questionId, int selectedIndex) {
        return QuizAnswer.newBuilder()
                .setQuestionId(questionId)
                .setSelectedIndex(selectedIndex)
                .build();
    }
}
