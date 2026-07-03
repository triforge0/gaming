package com.triforge.games.treasurequest;

import com.triforge.engine.loop.GameLoop;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.content.Question;
import com.triforge.games.treasurequest.pvp.Duel;
import com.triforge.games.treasurequest.pvp.EncounterDetector;
import com.triforge.protocol.proto.ChallengeResponse;
import com.triforge.protocol.proto.DuelSubmit;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.QuizAnswer;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class DuelFlowTest {

    @Test
    void winnerStealsTwentyPercentOfLoserScore() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        game.setPlayerScore(1L, 500);
        game.setPlayerScore(2L, 400);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        host.clearMessages();
        game.handleTreasureQuestMessage(1L, duelSubmit(perfectSubmit(duel)));
        game.handleTreasureQuestMessage(2L, duelSubmit(weakSubmit(duel)));

        assertEquals(580, game.playerScore(1L));
        assertEquals(320, game.playerScore(2L));
        assertFalse(game.playerInDuel(1L));
        assertFalse(game.playerInDuel(2L));

        GameMessage result = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasDuelResult())
                .findFirst()
                .orElseThrow();
        assertEquals(1L, result.getTq().getDuelResult().getWinnerPlayerId());
        assertEquals(80, result.getTq().getDuelResult().getScoreDelta());
        assertEquals(580, result.getTq().getDuelResult().getTotalScore());
    }

    @Test
    void tieLeavesScoresUnchanged() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        game.setPlayerScore(1L, 400);
        game.setPlayerScore(2L, 400);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        host.clearMessages();
        game.handleTreasureQuestMessage(1L, duelSubmit(weakSubmit(duel)));
        game.handleTreasureQuestMessage(2L, duelSubmit(weakSubmit(duel)));

        assertEquals(400, game.playerScore(1L));
        assertEquals(400, game.playerScore(2L));
        GameMessage result = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasDuelResult())
                .findFirst()
                .orElseThrow();
        assertTrue(result.getTq().getDuelResult().getTie());
        assertEquals(0, result.getTq().getDuelResult().getScoreDelta());
    }

    @Test
    void equalAnswersUsesPowerTieBreak() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        game.setPlayerScore(1L, 400);
        game.setPlayerScore(2L, 400);
        game.grantItemForTest(1L, com.triforge.protocol.proto.ItemType.ITEM_SHIELD, 1);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        host.clearMessages();
        game.handleTreasureQuestMessage(1L, duelSubmit(weakSubmit(duel)));
        game.handleTreasureQuestMessage(2L, duelSubmit(weakSubmit(duel)));

        assertEquals(480, game.playerScore(1L));
        assertEquals(320, game.playerScore(2L));
        GameMessage result = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasDuelResult())
                .findFirst()
                .orElseThrow();
        assertEquals(1L, result.getTq().getDuelResult().getWinnerPlayerId());
        assertFalse(result.getTq().getDuelResult().getTie());
    }

    @Test
    void timeoutAutoScoresUnansweredAsZero() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        host.setTick(duel.deadlineTick() + 1);
        host.clearMessages();
        game.onTick(host.currentTick());

        assertFalse(game.playerInDuel(1L));
        assertTrue(host.messagesToPlayer(1L).stream().anyMatch(msg -> msg.hasTq() && msg.getTq().hasDuelResult()));
        assertTrue(host.messagesToPlayer(2L).stream().anyMatch(msg -> msg.hasTq() && msg.getTq().hasDuelResult()));
    }

    private static void startDuelBetween(TreasureQuestGame game, DualMessagingRoomHost host) {
        placePlayersNearEachOther(game);
        host.clearMessages();
        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);
        String encounterId = host.messagesToPlayer(1L).stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasEncounterOffer())
                .map(msg -> msg.getTq().getEncounterOffer().getEncounterId())
                .findFirst()
                .orElseThrow();
        game.handleTreasureQuestMessage(1L, accept(encounterId));
        game.handleTreasureQuestMessage(2L, accept(encounterId));
    }

    private static void placePlayersNearEachOther(TreasureQuestGame game) {
        float[] pos = new float[2];
        game.viewerPosition(1L, pos);
        game.teleportAvatar(1L, pos[0], pos[1]);
        game.teleportAvatar(2L, pos[0] + 16f, pos[1]);
    }

    private static void runEncounterScanTicks(TreasureQuestGame game, DualMessagingRoomHost host, int ticks) {
        for (int i = 0; i < ticks; i++) {
            game.onTick(host.nextTick());
        }
    }

    private static TreasureQuestMessage accept(String encounterId) {
        return TreasureQuestMessage.newBuilder()
                .setChallengeResponse(ChallengeResponse.newBuilder()
                        .setEncounterId(encounterId)
                        .setAccept(true))
                .build();
    }

    private static TreasureQuestMessage duelSubmit(DuelSubmit submit) {
        return TreasureQuestMessage.newBuilder().setDuelSubmit(submit).build();
    }

    private static DuelSubmit perfectSubmit(Duel duel) {
        DuelSubmit.Builder builder = DuelSubmit.newBuilder().setDuelId(duel.duelId());
        for (Question question : duel.questions()) {
            builder.addAnswers(QuizAnswer.newBuilder()
                    .setQuestionId(question.id())
                    .setSelectedIndex(question.correctIndex()));
        }
        return builder.build();
    }

    private static DuelSubmit weakSubmit(Duel duel) {
        DuelSubmit.Builder builder = DuelSubmit.newBuilder().setDuelId(duel.duelId());
        for (Question question : duel.questions()) {
            int wrong = question.correctIndex() == 0 ? 1 : 0;
            builder.addAnswers(QuizAnswer.newBuilder()
                    .setQuestionId(question.id())
                    .setSelectedIndex(wrong));
        }
        return builder.build();
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
