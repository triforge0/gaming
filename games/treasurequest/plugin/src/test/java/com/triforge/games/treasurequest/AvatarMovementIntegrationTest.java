package com.triforge.games.treasurequest;

import com.triforge.engine.match.MatchPhase;
import com.triforge.games.treasurequest.systems.MovementSystem;
import com.triforge.games.treasurequest.world.WorldBounds;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.SetReadyAction;
import com.triforge.protocol.proto.StartMatchAction;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class AvatarMovementIntegrationTest {

    private static final float MOVE_DELTA = MovementSystem.AVATAR_SPEED / 60f;

    @Test
    void matchStartSpawnsControllableAvatarAtStartCheckpoint() {
        TickTrackingRoomHost host = new TickTrackingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        long entityId = game.playerEntityId(1L);
        assertTrue(entityId > 0L);

        float[] pos = new float[2];
        game.viewerPosition(1L, pos);
        assertEquals(game.questMap().checkpoints().start().zone().centerWorldX(game.questMap().tileSize()),
                pos[0], 0.001f);
        assertEquals(game.questMap().checkpoints().start().zone().centerWorldY(game.questMap().tileSize()),
                pos[1], 0.001f);
    }

    @Test
    void inputMovesAvatarAndWallsBlockMovement() {
        TickTrackingRoomHost host = new TickTrackingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        float[] pos = new float[2];
        game.viewerPosition(1L, pos);
        float startX = pos[0];
        float startY = pos[1];

        InputCommand moveRight = InputCommand.newBuilder().setMoveRight(true).build();
        for (int i = 0; i < 30; i++) {
            game.queueInputCommand(1L, moveRight);
            game.onTick(host.nextTick());
        }

        game.viewerPosition(1L, pos);
        assertTrue(pos[0] > startX + MOVE_DELTA);
        assertEquals(startY, pos[1], 0.001f);

        InputCommand moveLeft = InputCommand.newBuilder().setMoveLeft(true).build();
        for (int i = 0; i < 200; i++) {
            game.queueInputCommand(1L, moveLeft);
            game.onTick(host.nextTick());
        }

        game.viewerPosition(1L, pos);
        float minCenterX = game.questMap().tileSize() + WorldBounds.AVATAR_HALF_SIZE;
        assertTrue(pos[0] >= minCenterX - 0.001f);

        float blockedX = pos[0];
        game.queueInputCommand(1L, moveLeft);
        game.onTick(host.nextTick());
        game.viewerPosition(1L, pos);
        assertEquals(blockedX, pos[0], 0.001f);
    }

    @Test
    void snapshotReflectsAvatarMovement() {
        TickTrackingRoomHost host = new TickTrackingRoomHost("quest-room");
        TreasureQuestGame game = new TreasureQuestGame();
        game.bind(host);
        startMatchWithSinglePlayer(game);

        long entityId = game.playerEntityId(1L);
        game.queueInputCommand(1L, InputCommand.newBuilder().setMoveDown(true).build());
        game.onTick(host.nextTick());

        EntityProto proto = game.snapshotWriter().writeEntity(entityId, 0, game.componentManager());
        assertTrue(proto.hasQuestAvatar());
        assertTrue(proto.hasPosition());
        assertTrue(proto.hasDirection());
        assertEquals("cp1", proto.getQuestAvatar().getCurrentCheckpoint());
        assertEquals("Alice", proto.getQuestAvatar().getName());
        assertTrue(proto.getPosition().getY() > game.questMap().checkpoints().start().zone().centerWorldY(
                game.questMap().tileSize()));
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
