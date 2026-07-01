package com.triforge.engine.loop;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.LockSupport;
import java.util.function.LongConsumer;

public final class GameLoop implements Runnable {
    public static final long TPS = 60L;
    public static final long TICK_INTERVAL_NANOS = 1_000_000_000L / TPS;

    private final LongConsumer tickHandler;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final AtomicLong tickCounter = new AtomicLong();
    private volatile Throwable failure;

    public GameLoop(LongConsumer tickHandler) {
        this.tickHandler = Objects.requireNonNull(tickHandler, "tickHandler");
    }

    public void start() {
        running.set(true);
    }

    public void stop() {
        running.set(false);
    }

    public boolean isRunning() {
        return running.get();
    }

    public long currentTick() {
        return tickCounter.get();
    }

    public Throwable failure() {
        return failure;
    }

    @Override
    public void run() {
        start();

        long nextTickTime = System.nanoTime();

        while (running.get() && !Thread.currentThread().isInterrupted()) {
            long tick = tickCounter.incrementAndGet();

            try {
                tickHandler.accept(tick);
            } catch (Throwable throwable) {
                failure = throwable;
                running.set(false);
                break;
            }

            nextTickTime += TICK_INTERVAL_NANOS;
            long sleepNanos = nextTickTime - System.nanoTime();
            if (sleepNanos > 0L) {
                LockSupport.parkNanos(sleepNanos);
            }
        }
    }
}
