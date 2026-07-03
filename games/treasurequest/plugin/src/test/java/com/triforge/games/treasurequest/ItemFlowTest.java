package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InteractCommand;
import com.triforge.protocol.proto.ItemType;
import com.triforge.protocol.proto.ItemUse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.QuizAnswer;
import com.triforge.protocol.proto.QuizSubmit;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ItemFlowTest {

    @Test
    void quizRewardGrantsShieldItem() {
        MessagingRoomHost host = new MessagingRoomHost("item-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        passCheckpointOne(game);
        host.clearMessages();

        teleportToCheckpoint(game, "cp2b");
        game.onTick(1);
        openQuiz(game, 1L, "cp2b");
        submitQuizThree(game, 1L);

        assertTrue(hasInventoryItem(host.messagesToPlayer(1L), ItemType.ITEM_SHIELD, 1));
    }

    @Test
    void shieldItemUseGrantsProtection() {
        MessagingRoomHost host = new MessagingRoomHost("item-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);

        game.grantItemForTest(1L, ItemType.ITEM_SHIELD, 1);
        host.clearMessages();

        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setItemUse(ItemUse.newBuilder().setItem(ItemType.ITEM_SHIELD))
                .build());

        assertTrue(game.playerShielded(1L));
        assertTrue(host.messagesToPlayer(1L).stream().anyMatch(ItemFlowTest::isInventoryUpdate));
    }

    private static void teleportToCheckpoint(TreasureQuestGame game, String checkpointId) {
        var map = game.questMap();
        var checkpoint = map.checkpoints().get(checkpointId);
        float x = checkpoint.zone().centerWorldX(map.tileSize());
        float y = checkpoint.zone().centerWorldY(map.tileSize());
        game.teleportAvatar(1L, x, y);
        game.teleportAvatar(2L, x + map.tileSize(), y);
    }

    private static void passCheckpointOne(TreasureQuestGame game) {
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId("cp1"))
                .build());
        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(QuizSubmit.newBuilder()
                        .setQuizId("q1")
                        .addAnswers(answer("q1a", 1))
                        .addAnswers(answer("q1b", 0))
                        .addAnswers(answer("q1c", 1)))
                .build());
    }

    private static void submitQuizThree(TreasureQuestGame game, long playerId) {
        game.handleTreasureQuestMessage(playerId, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(QuizSubmit.newBuilder()
                        .setQuizId("q3")
                        .addAnswers(answer("q3a", 1))
                        .addAnswers(answer("q3b", 1))
                        .addAnswers(answer("q3c", 2)))
                .build());
    }

    private static void openQuiz(TreasureQuestGame game, long playerId, String checkpointId) {
        game.handleTreasureQuestMessage(playerId, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId(checkpointId))
                .build());
    }

    private static QuizAnswer answer(String questionId, int selectedIndex) {
        return QuizAnswer.newBuilder()
                .setQuestionId(questionId)
                .setSelectedIndex(selectedIndex)
                .build();
    }

    private static boolean hasInventoryItem(java.util.List<GameMessage> messages, ItemType item, int count) {
        return messages.stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasPlayerStateUpdate())
                .map(msg -> msg.getTq().getPlayerStateUpdate().getInventoryList())
                .flatMap(java.util.List::stream)
                .anyMatch(entry -> entry.getItem() == item && entry.getCount() == count);
    }

    private static boolean isInventoryUpdate(GameMessage message) {
        return message.hasTq() && message.getTq().hasInventoryUpdate();
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

    private static void startMatchWithTwoPlayers(TreasureQuestGame game) {
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
        game.handleLobbyCommand(1L, LobbyCommand.newBuilder()
                .setSetReady(SetReadyAction.newBuilder().setReady(true))
                .build());
        game.handleLobbyCommand(2L, LobbyCommand.newBuilder()
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
