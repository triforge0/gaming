package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.checkpoint.CheckpointState;
import com.triforge.games.treasurequest.checkpoint.CheckpointZoneDetector;
import com.triforge.games.treasurequest.content.ContentSource;
import com.triforge.games.treasurequest.content.QuestContent;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.InteractCommand;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class CheckpointInteractionTest {

    @Test
    void spawnInStartZoneMarksCheckpointAvailable() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        assertEquals(CheckpointState.AVAILABLE, game.checkpointState(1L));
        assertTrue(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> msg.hasTq() && msg.getTq().hasPlayerStateUpdate()));
    }

    @Test
    void interactInAvailableZoneSendsQuizPromptWithoutAnswerKeys() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);
        host.clearMessages();

        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId("cp1"))
                .build());

        GameMessage response = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasQuizPrompt())
                .findFirst()
                .orElseThrow();
        var prompt = response.getTq().getQuizPrompt();
        assertEquals("q1", prompt.getQuizId());
        assertEquals("cp1", prompt.getCheckpointId());
        assertEquals(3, prompt.getQuestionsCount());
        assertTrue(prompt.getQuestionsList().stream().allMatch(q -> q.getOptionsCount() >= 2));
        assertEquals(CheckpointState.OPENED, game.checkpointState(1L));
    }

    @Test
    void interactOutsideZoneOrWrongCheckpointIsRejected() {
        MessagingRoomHost host = new MessagingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        moveAwayFromStartZone(game, host);
        assertEquals(CheckpointState.UNAVAILABLE, game.checkpointState(1L));

        host.clearMessages();
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.getDefaultInstance())
                .build());
        assertFalse(host.messagesToPlayer(1L).stream().anyMatch(msg -> msg.hasTq() && msg.getTq().hasQuizPrompt()));

        moveBackToStartZone(game, host);
        assertEquals(CheckpointState.AVAILABLE, game.checkpointState(1L));

        host.clearMessages();
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId("cp2a"))
                .build());
        assertFalse(host.messagesToPlayer(1L).stream().anyMatch(msg -> msg.hasTq() && msg.getTq().hasQuizPrompt()));
    }

    @Test
    void enteringNonCurrentCheckpointZoneDoesNothing() {
        QuestContent content = QuestContent.loadDefault(ContentSource.classpathOnly());
        CheckpointZoneDetector detector = new CheckpointZoneDetector(content.map());
        var cp2a = content.map().checkpoints().get("cp2a");

        float centerX = cp2a.zone().centerWorldX(content.map().tileSize());
        float centerY = cp2a.zone().centerWorldY(content.map().tileSize());

        assertTrue(detector.isInCheckpointZone(cp2a, centerX, centerY));
        assertFalse(detector.isInCurrentCheckpointZone(content.map().checkpoints(), "cp1", centerX, centerY));
    }

    private static void moveAwayFromStartZone(TreasureQuestGame game, MessagingRoomHost host) {
        InputCommand moveRight = InputCommand.newBuilder().setMoveRight(true).build();
        for (int i = 0; i < 120; i++) {
            game.queueInputCommand(1L, moveRight);
            game.onTick(host.nextTick());
        }
    }

    private static void moveBackToStartZone(TreasureQuestGame game, MessagingRoomHost host) {
        InputCommand moveLeft = InputCommand.newBuilder().setMoveLeft(true).build();
        for (int i = 0; i < 120; i++) {
            game.queueInputCommand(1L, moveLeft);
            game.onTick(host.nextTick());
        }
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
