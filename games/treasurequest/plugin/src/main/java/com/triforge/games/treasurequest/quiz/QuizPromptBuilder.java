package com.triforge.games.treasurequest.quiz;

import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.Question;
import com.triforge.games.treasurequest.content.QuizSet;
import com.triforge.protocol.proto.QuizPrompt;
import com.triforge.protocol.proto.QuizQuestionProto;

import java.util.Objects;

/** Builds wire-safe quiz prompts — answer keys never leave the server. */
public final class QuizPromptBuilder {

    private QuizPromptBuilder() {
    }

    public static QuizPrompt build(QuizSet quiz, Checkpoint checkpoint, long deadlineTick) {
        Objects.requireNonNull(quiz, "quiz");
        Objects.requireNonNull(checkpoint, "checkpoint");

        QuizPrompt.Builder builder = QuizPrompt.newBuilder()
                .setQuizId(quiz.id())
                .setCheckpointId(checkpoint.id())
                .setPassThreshold(quiz.passThreshold())
                .setDeadlineTick(deadlineTick);

        for (Question question : quiz.questions()) {
            builder.addQuestions(toWireQuestion(question));
        }
        return builder.build();
    }

    private static QuizQuestionProto toWireQuestion(Question question) {
        return QuizQuestionProto.newBuilder()
                .setQuestionId(question.id())
                .setText(question.text())
                .addAllOptions(question.options())
                .setTimeLimitSec(question.timeLimitSec())
                .setPoints(question.points())
                .build();
    }
}
