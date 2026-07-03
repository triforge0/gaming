package com.triforge.games.treasurequest;

import com.triforge.engine.loop.GameLoop;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.pvp.Duel;
import com.triforge.games.treasurequest.pvp.EncounterDetector;
import com.triforge.protocol.proto.ChallengeResponse;
import com.triforge.protocol.proto.DuelSubmit;
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

final class PvpProtectionTest {

    private static final ExpeditionConfig CONFIG = ExpeditionConfig.defaults();

    @Test
    void refreshProtectionClearsExpiredTimers() {
        QuestAvatarComponent avatar = new QuestAvatarComponent(1L, "A", "cp1");

        avatar.grantShieldUntil(100);
        avatar.refreshProtection(100);
        assertTrue(avatar.shielded());
        avatar.refreshProtection(101);
        assertFalse(avatar.shielded());

        avatar.grantPvpCooldownUntil(200);
        avatar.refreshProtection(200);
        assertTrue(avatar.pvpCooldown());
        avatar.refreshProtection(201);
        assertFalse(avatar.pvpCooldown());

        avatar.grantStealImmunityUntil(300);
        avatar.refreshProtection(300);
        assertTrue(avatar.stealImmune());
        avatar.refreshProtection(301);
        assertFalse(avatar.stealImmune());
    }

    @Test
    void quizPassGrantsShieldUntilConfigDuration() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("shield-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);

        long grantTick = host.currentTick();
        passQuiz(game, host, 1L);

        long shieldTicks = (long) CONFIG.shieldSecs() * GameLoop.TPS;
        assertTrue(game.playerShielded(1L));
        host.setTick(grantTick + shieldTicks);
        game.onTick(host.currentTick());
        assertTrue(game.playerShielded(1L));

        host.setTick(grantTick + shieldTicks + 1);
        game.onTick(host.currentTick());
        assertFalse(game.playerShielded(1L));
    }

    @Test
    void quizShieldBlocksEncounterOffers() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("shield-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        passQuiz(game, host, 1L);

        placePlayersNearEachOther(game);
        host.clearMessages();
        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        assertFalse(hasAnyEncounterOffer(host));
    }

    @Test
    void duelWinnerGetsPvpCooldownAndLoserGetsStealImmunity() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        long grantTick = host.currentTick();
        host.clearMessages();
        game.handleTreasureQuestMessage(1L, duelSubmit(perfectSubmit(duel)));
        game.handleTreasureQuestMessage(2L, duelSubmit(weakSubmit(duel)));

        long cooldownTicks = (long) CONFIG.pvpCooldownSecs() * GameLoop.TPS;
        long immunityTicks = (long) CONFIG.stealImmunitySecs() * GameLoop.TPS;

        assertTrue(game.playerPvpCooldown(1L));
        assertFalse(game.playerPvpCooldown(2L));
        assertTrue(game.playerStealImmune(2L));
        assertFalse(game.playerStealImmune(1L));

        host.setTick(grantTick + cooldownTicks);
        game.onTick(host.currentTick());
        assertTrue(game.playerPvpCooldown(1L));
        host.setTick(grantTick + cooldownTicks + 1);
        game.onTick(host.currentTick());
        assertFalse(game.playerPvpCooldown(1L));

        host.setTick(grantTick + immunityTicks);
        game.onTick(host.currentTick());
        assertTrue(game.playerStealImmune(2L));
        host.setTick(grantTick + immunityTicks + 1);
        game.onTick(host.currentTick());
        assertFalse(game.playerStealImmune(2L));
    }

    @Test
    void duelTieDoesNotGrantProtection() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        game.handleTreasureQuestMessage(1L, duelSubmit(weakSubmit(duel)));
        game.handleTreasureQuestMessage(2L, duelSubmit(weakSubmit(duel)));

        assertFalse(game.playerPvpCooldown(1L));
        assertFalse(game.playerPvpCooldown(2L));
        assertFalse(game.playerStealImmune(1L));
        assertFalse(game.playerStealImmune(2L));
    }

    @Test
    void winnerCooldownBlocksNewEncounterOffers() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("duel-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        startDuelBetween(game, host);

        Duel duel = game.duelManager().duelForPlayer(1L).orElseThrow();
        game.handleTreasureQuestMessage(1L, duelSubmit(perfectSubmit(duel)));
        game.handleTreasureQuestMessage(2L, duelSubmit(weakSubmit(duel)));

        placePlayersNearEachOther(game);
        host.clearMessages();
        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        assertFalse(hasAnyEncounterOffer(host));
    }

    private static void passQuiz(TreasureQuestGame game, DualMessagingRoomHost host, long playerId) {
        game.handleTreasureQuestMessage(playerId, TreasureQuestMessage.newBuilder()
                .setInteract(InteractCommand.newBuilder().setCheckpointId("cp1"))
                .build());
        game.handleTreasureQuestMessage(playerId, TreasureQuestMessage.newBuilder()
                .setQuizSubmit(QuizSubmit.newBuilder()
                        .setQuizId("q1")
                        .addAnswers(answer("q1a", 1))
                        .addAnswers(answer("q1b", 0))
                        .addAnswers(answer("q1c", 1)))
                .build());
        assertTrue(game.playerShielded(playerId));
    }

    private static QuizAnswer answer(String questionId, int selectedIndex) {
        return QuizAnswer.newBuilder()
                .setQuestionId(questionId)
                .setSelectedIndex(selectedIndex)
                .build();
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

    private static boolean hasAnyEncounterOffer(DualMessagingRoomHost host) {
        return host.messagesToPlayer(1L).stream().anyMatch(PvpProtectionTest::isEncounterOffer)
                || host.messagesToPlayer(2L).stream().anyMatch(PvpProtectionTest::isEncounterOffer);
    }

    private static boolean isEncounterOffer(com.triforge.protocol.proto.GameMessage message) {
        return message.hasTq() && message.getTq().hasEncounterOffer();
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
        for (var question : duel.questions()) {
            builder.addAnswers(QuizAnswer.newBuilder()
                    .setQuestionId(question.id())
                    .setSelectedIndex(question.correctIndex()));
        }
        return builder.build();
    }

    private static DuelSubmit weakSubmit(Duel duel) {
        DuelSubmit.Builder builder = DuelSubmit.newBuilder().setDuelId(duel.duelId());
        for (var question : duel.questions()) {
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
