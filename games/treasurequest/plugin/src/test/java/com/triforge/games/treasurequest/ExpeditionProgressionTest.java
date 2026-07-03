package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.content.Checkpoint;
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

final class ExpeditionProgressionTest {

    @Test
    void fullSeedChainThroughBranchBossAndTreasureEndsMatch() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        passCheckpoint(game, host, "cp1", "q1", 1, 0, 1);
        assertEquals(1, game.playerCheckpointsCleared(1L));

        goToCheckpoint(game, "cp2a");
        assertEquals("cp2a", game.currentCheckpoint(1L));
        passCheckpoint(game, host, "cp2a", "q2", 1, 1, 2);

        goToCheckpoint(game, "cp3");
        assertEquals("cp3", game.currentCheckpoint(1L));
        passCheckpoint(game, host, "cp3", "q4", 1, 1, 1);

        goToCheckpoint(game, "boss");
        assertEquals("boss", game.currentCheckpoint(1L));
        assertFalse(game.bossCleared(1L));
        passCheckpoint(game, host, "boss", "qboss", 1, 1, 2);
        assertTrue(game.bossCleared(1L));
        assertEquals(4, game.playerCheckpointsCleared(1L));

        goToTreasure(game);
        host.clearMessages();
        game.onTick(host.nextTick());

        assertEquals(MatchPhase.ENDED, game.matchPhase());
        GameMessage complete = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasExpeditionComplete())
                .findFirst()
                .orElseThrow();
        assertTrue(complete.getTq().getExpeditionComplete().getYouWon());
        assertEquals(1L, complete.getTq().getExpeditionComplete().getWinnerPlayerId());
    }

    @Test
    void bossCheckpointBlockedBeforePrerequisites() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        goToCheckpoint(game, "boss");
        host.clearMessages();
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId("boss"))
                .build());

        assertFalse(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> msg.hasTq() && msg.getTq().hasQuizPrompt()));
    }

    @Test
    void treasureZoneIgnoredBeforeBossClear() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        goToTreasure(game);
        game.onTick(host.nextTick());

        assertEquals(MatchPhase.PLAYING, game.matchPhase());
        assertFalse(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> msg.hasTq() && msg.getTq().hasExpeditionComplete()));
    }

    private static void passCheckpoint(
            TreasureQuestGame game,
            MessagingRoomHost host,
            String checkpointId,
            String quizId,
            int... correctIndices
    ) {
        host.clearMessages();
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId(checkpointId))
                .build());

        QuizSubmit.Builder submit = QuizSubmit.newBuilder().setQuizId(quizId);
        String[] questionIds = questionIdsFor(quizId);
        for (int i = 0; i < questionIds.length; i++) {
            submit.addAnswers(QuizAnswer.newBuilder()
                    .setQuestionId(questionIds[i])
                    .setSelectedIndex(correctIndices[i])
                    .build());
        }
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(submit)
                .build());

        GameMessage result = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizResult())
                .reduce((first, second) -> second)
                .orElseThrow();
        assertEquals(QuizOutcome.QUIZ_PASS, result.getTq().getQuizResult().getOutcome());
    }

    private static String[] questionIdsFor(String quizId) {
        return switch (quizId) {
            case "q1" -> new String[] {"q1a", "q1b", "q1c"};
            case "q2" -> new String[] {"q2a", "q2b", "q2c"};
            case "q3" -> new String[] {"q3a", "q3b", "q3c"};
            case "q4" -> new String[] {"q4a", "q4b", "q4c"};
            case "qboss" -> new String[] {"qb1", "qb2", "qb3"};
            default -> throw new IllegalArgumentException("Unknown quiz: " + quizId);
        };
    }

    private static void goToCheckpoint(TreasureQuestGame game, String checkpointId) {
        Checkpoint checkpoint = game.questMap().checkpoints().get(checkpointId);
        int tileSize = game.questMap().tileSize();
        game.teleportAvatar(1L,
                checkpoint.zone().centerWorldX(tileSize),
                checkpoint.zone().centerWorldY(tileSize));
    }

    private static void goToTreasure(TreasureQuestGame game) {
        var zone = game.questMap().treasure().zone();
        int tileSize = game.questMap().tileSize();
        game.teleportAvatar(1L, zone.centerWorldX(tileSize), zone.centerWorldY(tileSize));
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
