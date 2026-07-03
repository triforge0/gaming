package com.triforge.engine.loop;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.LockSupport;
import java.util.function.LongConsumer;

public final class GameLoop implements Runnable {
    public static final long TPS = 60L;
    public static final long TICK_INTERVAL_NANOS = 1_000_000_000L / TPS;
    private static final long MAX_CATCH_UP_NANOS = TICK_INTERVAL_NANOS * 5L;

    private final LongConsumer tickHandler;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final AtomicLong tickCounter = new AtomicLong();
    private final AtomicReference<Thread> thread = new AtomicReference<>();
    private final AtomicReference<Throwable> failure = new AtomicReference<>();

    public GameLoop(LongConsumer tickHandler) {
        this.tickHandler = Objects.requireNonNull(tickHandler, "tickHandler");
    }

    /** Marks the loop as running. Returns false if already started. */
    public boolean start() {
        return running.compareAndSet(false, true);
    }

    public void stop() {
        running.set(false);
        Thread active = thread.get();
        if (active != null) {
            active.interrupt();
        }
    }

    public boolean isRunning() {
        return running.get();
    }

    public long currentTick() {
        return tickCounter.get();
    }

    public Throwable failure() {
        return failure.get();
    }

    public boolean failed() {
        return failure.get() != null;
    }

    @Override
    public void run() {
        if (!running.get()) {
            return;
        }

        Thread current = Thread.currentThread();
        thread.set(current);
        long nextTickTime = System.nanoTime();

        try {
            while (running.get() && !current.isInterrupted()) {
                long tick = tickCounter.incrementAndGet();

                try {
                    tickHandler.accept(tick);
                } catch (RuntimeException exception) {
                    failure.set(exception);
                    break;
                }

                nextTickTime += TICK_INTERVAL_NANOS;
                long sleepNanos = nextTickTime - System.nanoTime();
                if (sleepNanos > 0L) {
                    LockSupport.parkNanos(sleepNanos);
                } else if (sleepNanos < -MAX_CATCH_UP_NANOS) {
                    nextTickTime = System.nanoTime();
                }
            }
        } finally {
            running.set(false);
            thread.set(null);
        }
    }
}
