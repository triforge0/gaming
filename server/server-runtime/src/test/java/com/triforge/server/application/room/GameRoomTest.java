package com.triforge.server.application.room;

import org.junit.jupiter.api.Test;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public final class GameRoomTest {

    @Test
    public void testConcurrentIsolatedRooms() throws InterruptedException {
        ConcurrentHashMap<String, String> roomExecutionThreads = new ConcurrentHashMap<>();
        CountDownLatch latch = new CountDownLatch(2);

        // Create Room A and Room B
        try (GameRoom roomA = GameRoom.builder("room-A").tickHandler(tick -> {}).build();
             GameRoom roomB = GameRoom.builder("room-B").tickHandler(tick -> {}).build()) {

            // Start rooms (spawns separate threads)
            roomA.start();
            roomB.start();

            assertTrue(roomA.isRunning());
            assertTrue(roomB.isRunning());

            // Enqueue commands that capture thread names
            roomA.enqueueCommand(() -> {
                String threadName = Thread.currentThread().getName();
                roomExecutionThreads.put("room-A", threadName);
                latch.countDown();
            });

            roomB.enqueueCommand(() -> {
                String threadName = Thread.currentThread().getName();
                roomExecutionThreads.put("room-B", threadName);
                latch.countDown();
            });

            // Wait up to 1 second for commands to execute inside their loops
            boolean completed = latch.await(1, TimeUnit.SECONDS);
            assertTrue(completed, "Commands should have been executed in time");

            // Stop rooms
            roomA.stop();
            roomB.stop();

            assertFalse(roomA.isRunning());
            assertFalse(roomB.isRunning());

            // Verify thread naming and isolation
            String threadAName = roomExecutionThreads.get("room-A");
            String threadBName = roomExecutionThreads.get("room-B");

            assertNotNull(threadAName);
            assertNotNull(threadBName);
            
            // Expected thread naming scheme: "room-[roomId]-executor"
            assertEquals("room-room-A-executor", threadAName);
            assertEquals("room-room-B-executor", threadBName);
            assertNotEquals(threadAName, threadBName, "Each room must execute on separate, isolated threads");
        }
    }
}
