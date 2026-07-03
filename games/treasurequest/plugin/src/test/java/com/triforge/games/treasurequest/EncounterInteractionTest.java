package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.pvp.EncounterDetector;
import com.triforge.protocol.proto.ChallengeResponse;
import com.triforge.protocol.proto.EncounterState;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class EncounterInteractionTest {

    @Test
    void nearPairReceivesEncounterOffer() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("pvp-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);

        float[] pos = new float[2];
        game.viewerPosition(1L, pos);
        game.teleportAvatar(1L, pos[0], pos[1]);
        game.teleportAvatar(2L, pos[0] + 16f, pos[1]);
        host.clearMessages();

        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        assertTrue(hasEncounterOffer(host.messagesToPlayer(1L), 2L));
        assertTrue(hasEncounterOffer(host.messagesToPlayer(2L), 1L));
    }

    @Test
    void shieldedPlayerDoesNotReceiveOffer() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("pvp-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);

        float[] pos = new float[2];
        game.viewerPosition(1L, pos);
        game.setPlayerShielded(1L, true);
        game.teleportAvatar(1L, pos[0], pos[1]);
        game.teleportAvatar(2L, pos[0] + 16f, pos[1]);
        host.clearMessages();

        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        assertFalse(host.messagesToPlayer(1L).stream().anyMatch(EncounterInteractionTest::isEncounterOffer));
        assertFalse(host.messagesToPlayer(2L).stream().anyMatch(EncounterInteractionTest::isEncounterOffer));
    }

    @Test
    void declineCancelsEncounterForBothPlayers() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("pvp-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        placePlayersNearEachOther(game);
        host.clearMessages();
        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        String encounterId = encounterId(host.messagesToPlayer(1L));
        host.clearMessages();

        game.handleTreasureQuestMessage(1L, TreasureQuestMessage.newBuilder()
                .setChallengeResponse(ChallengeResponse.newBuilder()
                        .setEncounterId(encounterId)
                        .setAccept(false))
                .build());

        assertTrue(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> isEncounterState(msg, EncounterState.ENC_DECLINED)));
        assertTrue(host.messagesToPlayer(2L).stream()
                .anyMatch(msg -> isEncounterState(msg, EncounterState.ENC_DECLINED)));
        assertFalse(game.playerInDuel(1L));
        assertFalse(game.playerInDuel(2L));
    }

    @Test
    void movingApartCancelsOffer() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("pvp-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        placePlayersNearEachOther(game);
        host.clearMessages();
        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        host.clearMessages();
        game.teleportAvatar(1L, 32f, 32f);
        game.teleportAvatar(2L, 400f, 400f);
        game.onTick(host.nextTick());

        assertTrue(host.messagesToPlayer(1L).stream()
                .anyMatch(msg -> isEncounterState(msg, EncounterState.ENC_CANCELLED)));
        assertTrue(host.messagesToPlayer(2L).stream()
                .anyMatch(msg -> isEncounterState(msg, EncounterState.ENC_CANCELLED)));
    }

    @Test
    void bothAcceptStartsDuelForBothPlayers() {
        DualMessagingRoomHost host = new DualMessagingRoomHost("pvp-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithTwoPlayers(game);
        placePlayersNearEachOther(game);
        host.clearMessages();
        runEncounterScanTicks(game, host, EncounterDetector.DEFAULT_SCAN_INTERVAL_TICKS);

        String encounterId = encounterId(host.messagesToPlayer(1L));
        host.clearMessages();

        game.handleTreasureQuestMessage(1L, accept(encounterId));
        game.handleTreasureQuestMessage(2L, accept(encounterId));

        assertTrue(game.playerInDuel(1L));
        assertTrue(game.playerInDuel(2L));
        assertTrue(host.messagesToPlayer(1L).stream().anyMatch(msg -> msg.hasTq() && msg.getTq().hasDuelPrompt()));
        assertTrue(host.messagesToPlayer(2L).stream().anyMatch(msg -> msg.hasTq() && msg.getTq().hasDuelPrompt()));
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

    private static boolean hasEncounterOffer(java.util.List<GameMessage> messages, long opponentId) {
        return messages.stream().anyMatch(msg ->
                msg.hasTq()
                        && msg.getTq().hasEncounterOffer()
                        && msg.getTq().getEncounterOffer().getOpponentPlayerId() == opponentId
                        && msg.getTq().getEncounterOffer().getState() == EncounterState.ENC_OFFERED);
    }

    private static boolean isEncounterOffer(GameMessage message) {
        return message.hasTq() && message.getTq().hasEncounterOffer();
    }

    private static boolean isEncounterState(GameMessage message, EncounterState state) {
        return message.hasTq()
                && message.getTq().hasEncounterOffer()
                && message.getTq().getEncounterOffer().getState() == state;
    }

    private static String encounterId(java.util.List<GameMessage> messages) {
        return messages.stream()
                .filter(msg -> msg.hasTq() && msg.getTq().hasEncounterOffer())
                .map(msg -> msg.getTq().getEncounterOffer().getEncounterId())
                .findFirst()
                .orElseThrow();
    }

    private static TreasureQuestMessage accept(String encounterId) {
        return TreasureQuestMessage.newBuilder()
                .setChallengeResponse(ChallengeResponse.newBuilder()
                        .setEncounterId(encounterId)
                        .setAccept(true))
                .build();
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
