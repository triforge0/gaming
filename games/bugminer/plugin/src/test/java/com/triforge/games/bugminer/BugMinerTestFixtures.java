package com.triforge.games.bugminer;

import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.BMConfigureFairModeCommand;
import com.triforge.protocol.proto.BugMinerMessage;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.StartMatchAction;
import io.netty.channel.embedded.EmbeddedChannel;

/** Shared helpers for BugMiner integration tests. */
final class BugMinerTestFixtures {

    static final long HOST_ID = 1L;
    static final long GUEST_ID = 2L;

    private BugMinerTestFixtures() {
    }

    static BugMinerGame newGame(BugMinerRoomHost host) {
        BugMinerGame game = new BugMinerGame();
        game.matchConfig(MatchConfig.defaults()
                .withCountdownSeconds(1)
                .withScoreboardDelaySeconds(1));
        game.bind(host);
        return game;
    }

    static void joinTwoPlayers(BugMinerGame game) {
        game.handleJoinRequest("Alice", new EmbeddedChannel());
        game.handleJoinRequest("Bob", new EmbeddedChannel());
    }

    static void hostStartMatch(BugMinerGame game) {
        game.handleLobbyCommand(HOST_ID, LobbyCommand.newBuilder()
                .setStartMatch(StartMatchAction.newBuilder().build())
                .build());
    }

    static void tickUntilPhase(BugMinerGame game, MatchPhase target) {
        for (int i = 0; i < 20_000 && game.matchPhase() != target; i++) {
            switch (game.matchPhase()) {
                case COUNTDOWN -> game.tickCountdownPhase();
                case PLAYING -> {
                    if (target == MatchPhase.PLAYING) {
                        return;
                    }
                    game.tickMatchTimer();
                }
                case ENDED -> game.tickScoreboardPhase();
                default -> {
                    return;
                }
            }
        }
        if (game.matchPhase() != target) {
            throw new IllegalStateException("timed out waiting for " + target + ", got " + game.matchPhase());
        }
    }

    static void tickPlaying(BugMinerGame game, int ticks) {
        for (int i = 0; i < ticks; i++) {
            if (game.matchPhase() != MatchPhase.PLAYING) {
                break;
            }
            game.tickMatchTimer();
        }
    }

    static GameMessage configureFairModeMessage(
            boolean enabled, boolean battle, String levelId, int timeLimit) {
        return GameMessage.newBuilder()
                .setBugminer(BugMinerMessage.newBuilder()
                        .setConfigureFairMode(BMConfigureFairModeCommand.newBuilder()
                                .setEnabled(enabled)
                                .setBattle(battle)
                                .setLevelId(levelId)
                                .setTimeLimit(timeLimit)
                                .build())
                        .build())
                .build();
    }

    static void configureFairMode(BugMinerGame game, long playerId,
            boolean enabled, boolean battle, String levelId, int timeLimit) {
        game.handleGameMessage(playerId, configureFairModeMessage(enabled, battle, levelId, timeLimit));
    }

    static GameMessage setLevelMessage(String levelId) {
        return GameMessage.newBuilder()
                .setBugminer(BugMinerMessage.newBuilder()
                        .setSetLevel(com.triforge.protocol.proto.BMSetLevelCommand.newBuilder()
                                .setLevelId(levelId)
                                .build())
                        .build())
                .build();
    }

    static GameMessage autoArrangeMessage() {
        return GameMessage.newBuilder()
                .setBugminer(BugMinerMessage.newBuilder()
                        .setAutoArrange(com.triforge.protocol.proto.BMAutoArrangeCommand.newBuilder().build())
                        .build())
                .build();
    }

    static GameMessage lockMapMessage() {
        return GameMessage.newBuilder()
                .setBugminer(BugMinerMessage.newBuilder()
                        .setLockMap(com.triforge.protocol.proto.BMLockMapCommand.newBuilder().build())
                        .build())
                .build();
    }

    static GameMessage placeItemMessage(String itemId, float x, float y) {
        return GameMessage.newBuilder()
                .setBugminer(BugMinerMessage.newBuilder()
                        .setPlaceItem(com.triforge.protocol.proto.BMPlaceItemCommand.newBuilder()
                                .setItemId(itemId)
                                .setX(x)
                                .setY(y)
                                .build())
                        .build())
                .build();
    }

    static GameMessage restartMessage() {
        return GameMessage.newBuilder()
                .setBugminer(BugMinerMessage.newBuilder()
                        .setRestart(com.triforge.protocol.proto.BMRestartCommand.newBuilder().build())
                        .build())
                .build();
    }
}
