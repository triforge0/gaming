package com.triforge.engine.loop;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class GameLoopTest {

    @Test
    void stopBeforeRunPreventsLoopFromStarting() throws Exception {
        GameLoop loop = new GameLoop(tick -> {
        });
        loop.start();
        loop.stop();

        Thread worker = new Thread(loop);
        worker.start();
        worker.join(500L);

        assertFalse(worker.isAlive());
        assertEquals(0L, loop.currentTick());
        assertFalse(loop.isRunning());
    }

    @Test
    void startIsIdempotent() {
        GameLoop loop = new GameLoop(tick -> {
        });
        assertTrue(loop.start());
        assertFalse(loop.start());
    }

    @Test
    void recordsTickHandlerFailure() throws Exception {
        CountDownLatch started = new CountDownLatch(1);
        RuntimeException boom = new RuntimeException("tick failed");
        GameLoop loop = new GameLoop(tick -> {
            started.countDown();
            throw boom;
        });
        assertTrue(loop.start());

        Thread worker = new Thread(loop);
        worker.start();
        assertTrue(started.await(2, TimeUnit.SECONDS));
        worker.join(2_000L);

        assertTrue(loop.failed());
        assertEquals(boom, loop.failure());
        assertFalse(loop.isRunning());
    }

    @Test
    void advancesTicksWhileRunning() throws Exception {
        AtomicInteger ticks = new AtomicInteger();
        GameLoop loop = new GameLoop(tick -> ticks.incrementAndGet());
        assertTrue(loop.start());

        Thread worker = new Thread(loop);
        worker.start();
        Thread.sleep(100L);
        loop.stop();
        worker.join(2_000L);

        assertTrue(ticks.get() >= 2, "expected at least two ticks in ~100ms");
        assertFalse(loop.isRunning());
    }
}
