package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InteractCommand;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.QuizAnswer;
import com.triforge.protocol.proto.QuizSubmit;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class LeaderboardBroadcastTest {

    @Test
    void quizProgressBroadcastsLiveLeaderboard() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("lb-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);

        assertTrue(hasLiveLeaderboard(host.messagesToPlayer(1L)));
        assertTrue(hasLiveLeaderboard(host.messagesToPlayer(2L)));

        host.clearMessages();
        goToCheckpoint(game, "cp1");
        passCheckpoint(game, 1L, "cp1", "q1", 1, 0, 1);

        GameMessage update = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasLeaderboard())
                .reduce((first, second) -> second)
                .orElseThrow();
        assertFalse(update.getTq().getLeaderboard().getFinalStandings());
        assertEquals(1L, update.getTq().getLeaderboard().getEntries(0).getPlayerId());
        assertEquals(1, update.getTq().getLeaderboard().getEntries(0).getCheckpointsCleared());
    }

    @Test
    void treasureWinBroadcastsFinalStandings() {
        MessagingRoomHost host = new MessagingRoomHost("lb-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        goToCheckpoint(game, "cp1");
        passCheckpoint(game, "cp1", "q1", 1, 0, 1);
        goToCheckpoint(game, "cp2a");
        passCheckpoint(game, "cp2a", "q2", 1, 1, 2);
        goToCheckpoint(game, "cp3");
        passCheckpoint(game, "cp3", "q4", 1, 1, 1);
        goToCheckpoint(game, "boss");
        passCheckpoint(game, "boss", "qboss", 1, 1, 2);

        goToTreasure(game);
        host.clearMessages();
        game.onTick(host.nextTick());

        GameMessage finalBoard = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasLeaderboard())
                .reduce((first, second) -> second)
                .orElseThrow();
        assertTrue(finalBoard.getTq().getLeaderboard().getFinalStandings());
        assertEquals(1L, finalBoard.getTq().getLeaderboard().getEntries(0).getPlayerId());
        assertEquals(MatchPhase.ENDED, game.matchPhase());
    }

    private static void goToCheckpoint(TreasureQuestGame game, String checkpointId) {
        var checkpoint = game.questMap().checkpoints().get(checkpointId);
        int tileSize = game.questMap().tileSize();
        game.teleportAvatar(1L,
                checkpoint.zone().centerWorldX(tileSize),
                checkpoint.zone().centerWorldY(tileSize));
    }

    private static boolean hasLiveLeaderboard(java.util.List<GameMessage> messages) {
        return messages.stream()
                .anyMatch(msg -> msg.hasTq()
                        && msg.getTq().hasLeaderboard()
                        && !msg.getTq().getLeaderboard().getFinalStandings());
    }

    private static void passCheckpoint(
            TreasureQuestGame game,
            long playerId,
            String checkpointId,
            String quizId,
            int... correctIndices
    ) {
        game.handleTreasureQuestMessage(playerId, TreasureQuestMessage.newBuilder()
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
        game.handleTreasureQuestMessage(playerId, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(submit)
                .build());
    }

    private static void passCheckpoint(
            TreasureQuestGame game,
            String checkpointId,
            String quizId,
            int... correctIndices
    ) {
        passCheckpoint(game, 1L, checkpointId, quizId, correctIndices);
    }

    private static String[] questionIdsFor(String quizId) {
        return switch (quizId) {
            case "q1" -> new String[] {"q1a", "q1b", "q1c"};
            case "q2" -> new String[] {"q2a", "q2b", "q2c"};
            case "q4" -> new String[] {"q4a", "q4b", "q4c"};
            case "qboss" -> new String[] {"qb1", "qb2", "qb3"};
            default -> throw new IllegalArgumentException("Unknown quiz: " + quizId);
        };
    }

    private static void goToTreasure(TreasureQuestGame game) {
        var zone = game.questMap().treasure().zone();
        int tileSize = game.questMap().tileSize();
        game.teleportAvatar(1L, zone.centerWorldX(tileSize), zone.centerWorldY(tileSize));
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
