package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.checkpoint.CheckpointState;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InteractCommand;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.QuizAnswer;
import com.triforge.protocol.proto.QuizOutcome;
import com.triforge.protocol.proto.QuizSubmit;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class QuizFlowTest {

    @Test
    void passingSubmitAwardsPointsAndRevealsHint() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);
        openQuiz(game);

        host.clearMessages();
        submitPerfectScore(game);

        GameMessage resultMessage = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizResult())
                .findFirst()
                .orElseThrow();
        var result = resultMessage.getTq().getQuizResult();
        assertEquals(QuizOutcome.QUIZ_PASS, result.getOutcome());
        assertEquals(3, result.getCorrectCount());
        assertEquals(50, result.getPointsEarned());
        assertEquals(50, result.getTotalScore());
        assertEquals(1, game.playerCheckpointsCleared(1L));

        assertTrue(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> msg.hasTq() && msg.getTq().hasHintReveal()));
        assertEquals(CheckpointState.UNAVAILABLE, game.checkpointState(1L));
    }

    @Test
    void failingSubmitDoesNotAwardPointsAndAllowsRetry() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);
        openQuiz(game);

        host.clearMessages();
        submitAllWrong(game);

        GameMessage resultMessage = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizResult())
                .findFirst()
                .orElseThrow();
        assertEquals(QuizOutcome.QUIZ_FAIL, resultMessage.getTq().getQuizResult().getOutcome());
        assertEquals(0, game.playerScore(1L));
        assertEquals(0, game.playerCheckpointsCleared(1L));
        assertFalse(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> msg.hasTq() && msg.getTq().hasHintReveal()));
        assertEquals(CheckpointState.AVAILABLE, game.checkpointState(1L));
    }

    @Test
    void expiredQuizAutoScoresAsFailOnTick() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);
        openQuiz(game);

        long deadline = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizPrompt())
                .map(msg -> msg.getTq().getQuizPrompt().getDeadlineTick())
                .findFirst()
                .orElseThrow();
        host.setTick(deadline + 1);
        host.clearMessages();

        game.onTick(host.currentTick());

        GameMessage resultMessage = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizResult())
                .findFirst()
                .orElseThrow();
        assertEquals(QuizOutcome.QUIZ_FAIL, resultMessage.getTq().getQuizResult().getOutcome());
        assertEquals(0, resultMessage.getTq().getQuizResult().getCorrectCount());
        assertEquals(0, game.playerScore(1L));
    }

    @Test
    void lateSubmitAfterDeadlineIsRejected() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);
        openQuiz(game);

        long deadline = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizPrompt())
                .map(msg -> msg.getTq().getQuizPrompt().getDeadlineTick())
                .findFirst()
                .orElseThrow();
        host.setTick(deadline + 1);
        host.clearMessages();

        submitPerfectScore(game);

        assertFalse(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> msg.hasTq() && msg.getTq().hasQuizResult()));
    }

    private static void openQuiz(TreasureQuestGame game) {
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId("cp1"))
                .build());
    }

    private static void submitPerfectScore(TreasureQuestGame game) {
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(QuizSubmit.newBuilder()
                        .setQuizId("q1")
                        .addAnswers(answer("q1a", 1))
                        .addAnswers(answer("q1b", 0))
                        .addAnswers(answer("q1c", 1)))
                .build());
    }

    private static void submitAllWrong(TreasureQuestGame game) {
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(QuizSubmit.newBuilder()
                        .setQuizId("q1")
                        .addAnswers(answer("q1a", 0))
                        .addAnswers(answer("q1b", 1))
                        .addAnswers(answer("q1c", 0)))
                .build());
    }

    private static QuizAnswer answer(String questionId, int selectedIndex) {
        return QuizAnswer.newBuilder()
                .setQuestionId(questionId)
                .setSelectedIndex(selectedIndex)
                .build();
    }

    private static void startMatchWithSinglePlayer(TreasureQuestGame game) {
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setStartMatch(StartMatchAction.newBuilder().build())
                .build());

        while (game.matchPhase() == MatchPhase.COUNTDOWN) {
            game.tickCountdownPhase();
        }
        assertEquals(MatchPhase.PLAYING, game.matchPhase());
    }
}
