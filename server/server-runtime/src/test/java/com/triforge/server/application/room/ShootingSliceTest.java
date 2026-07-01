package com.triforge.server.application.room;

import com.triforge.games.tankarena.components.BulletComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.engine.ecs.Entity;
import com.triforge.protocol.proto.InputCommand;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class ShootingSliceTest {

    @Test
    void shootInputSpawnsBulletInRoom() throws InterruptedException {
        try (GameRoom room = GameRoom.builder("shoot-room").skipLobby(true).build()) {
            room.start();

            room.enqueueCommand(() -> TankArenaRoomSupport.spawnPlayerTank(room, 1L, "Shooter"));
            Entity tank = waitForPlayerEntity(room, 1L);

            room.enqueueCommand(() -> room.queueInputCommand(1L, InputCommand.newBuilder()
                    .setShoot(true)
                    .build()));

            assertTrue(waitForBulletCount(room, 1), "Shoot input should spawn a bullet");

            Entity bullet = findBullet(room);
            BulletComponent bulletComponent = room.componentManager().get(bullet, BulletComponent.class);
            assertEquals(tank.id(), bulletComponent.ownerEntityId());

            room.stop();
        }
    }

    private Entity waitForPlayerEntity(GameRoom room, long playerId) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            room.enqueueCommand(() -> {
            });
            Entity entity = TankArenaRoomSupport.playerEntity(room, playerId);
            if (entity != null) {
                return entity;
            }
            Thread.sleep(10);
        }
        throw new AssertionError("Player entity was not spawned in time");
    }

    private boolean waitForBulletCount(GameRoom room, int expected) throws InterruptedException {
        for (int i = 0; i < 200; i++) {
            room.enqueueCommand(() -> {
            });
            if (countBullets(room) >= expected) {
                return true;
            }
            Thread.sleep(10);
        }
        return false;
    }

    private int countBullets(GameRoom room) {
        int count = 0;
        for (int index = 0; index < room.entityManager().count(); index++) {
            long entityId = room.entityManager().idAt(index);
            if (room.componentManager().get(entityId, BulletComponent.class) != null) {
                count++;
            }
        }
        return count;
    }

    private Entity findBullet(GameRoom room) {
        for (int index = 0; index < room.entityManager().count(); index++) {
            long entityId = room.entityManager().idAt(index);
            if (room.componentManager().get(entityId, BulletComponent.class) != null) {
                return new Entity(entityId);
            }
        }
        throw new AssertionError("Expected bullet entity");
    }
}
