package com.triforge.server.application.room;

import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.engine.ecs.Entity;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertTrue;

public final class MovementSliceTest {

    private static final float FIXED_DELTA = TankComponent.DEFAULT_SPEED / 60f;

    @Test
    void inputCommandMovesPlayerAuthoritatively() throws InterruptedException {
        try (GameRoom room = GameRoom.builder("movement-room").skipLobby(true).build()) {
            room.start();

            room.enqueueCommand(() -> TankArenaRoomSupport.spawnPlayerTank(room, 1L, "Mover"));
            Entity tank = waitForPlayerEntity(room, 1L);
            float startY = readY(room, tank);

            room.enqueueCommand(() -> room.queueInputCommand(1L, InputCommand.newBuilder()
                    .setMoveUp(true)
                    .build()));

            assertTrue(waitUntilY(room, tank, startY - FIXED_DELTA), "Tank should move up after input");

            room.stop();
        }
    }

    @Test
    void deltaServiceDetectsPositionChange() throws InterruptedException {
        try (GameRoom room = GameRoom.builder("delta-room").skipLobby(true).build()) {
            room.start();

            room.enqueueCommand(() -> TankArenaRoomSupport.spawnPlayerTank(room, 1L, "Delta"));
            Entity tank = waitForPlayerEntity(room, 1L);
            room.enqueueCommand(() -> room.deltaService().syncBaseline(room.game()));
            waitForBaselineSync(room);

            room.enqueueCommand(() -> room.queueInputCommand(1L, InputCommand.newBuilder()
                    .setMoveLeft(true)
                    .build()));

            float startX = readX(room, tank);
            assertTrue(waitUntilX(room, tank, startX - FIXED_DELTA), "Tank should move left");
            assertTrue(pollUntilDeltaChanges(room), "Delta should include moved entity");

            room.stop();
        }
    }

    private Entity waitForPlayerEntity(GameRoom room, long playerId) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            Entity entity = pollOnRoomThread(room, () -> TankArenaRoomSupport.playerEntity(room, playerId));
            if (entity != null) {
                return entity;
            }
            Thread.sleep(10);
        }
        throw new AssertionError("Player entity was not spawned in time");
    }

    private void waitForBaselineSync(GameRoom room) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            pollOnRoomThread(room, () -> null);
            Thread.sleep(10);
        }
    }

    private float readY(GameRoom room, Entity tank) throws InterruptedException {
        Float y = pollOnRoomThread(room, () -> {
            PositionComponent position = room.componentManager().get(tank, PositionComponent.class);
            return position != null ? position.y() : null;
        });
        if (y == null) {
            throw new AssertionError("Missing position for tank " + tank.id());
        }
        return y;
    }

    private float readX(GameRoom room, Entity tank) throws InterruptedException {
        Float x = pollOnRoomThread(room, () -> {
            PositionComponent position = room.componentManager().get(tank, PositionComponent.class);
            return position != null ? position.x() : null;
        });
        if (x == null) {
            throw new AssertionError("Missing position for tank " + tank.id());
        }
        return x;
    }

    private boolean waitUntilY(GameRoom room, Entity tank, float expectedY) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            Boolean matched = pollOnRoomThread(room, () -> {
                PositionComponent position = room.componentManager().get(tank, PositionComponent.class);
                return position != null && Math.abs(position.y() - expectedY) < 0.001f;
            });
            if (Boolean.TRUE.equals(matched)) {
                return true;
            }
            Thread.sleep(10);
        }
        return false;
    }

    private boolean waitUntilX(GameRoom room, Entity tank, float expectedX) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            Boolean matched = pollOnRoomThread(room, () -> {
                PositionComponent position = room.componentManager().get(tank, PositionComponent.class);
                return position != null && Math.abs(position.x() - expectedX) < 0.001f;
            });
            if (Boolean.TRUE.equals(matched)) {
                return true;
            }
            Thread.sleep(10);
        }
        return false;
    }

    private boolean pollUntilDeltaChanges(GameRoom room) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            Boolean changed = pollOnRoomThread(room, () ->
                    room.deltaService().buildDelta(room.game(), room.currentTick(), java.util.List.of()).isPresent());
            if (Boolean.TRUE.equals(changed)) {
                return true;
            }
            Thread.sleep(10);
        }
        return false;
    }

    private <T> T pollOnRoomThread(GameRoom room, Supplier<T> supplier) throws InterruptedException {
        return pollOnRoomThread(room, supplier, 100);
    }

    private <T> T pollOnRoomThread(GameRoom room, Supplier<T> supplier, long timeoutMs)
            throws InterruptedException {
        AtomicReference<T> ref = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        room.enqueueCommand(() -> {
            ref.set(supplier.get());
            latch.countDown();
        });
        latch.await(timeoutMs, TimeUnit.MILLISECONDS);
        return ref.get();
    }
}
