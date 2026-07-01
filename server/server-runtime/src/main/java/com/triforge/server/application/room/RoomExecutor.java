package com.triforge.server.application.room;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicBoolean;

public final class RoomExecutor implements AutoCloseable {
    private final ExecutorService executor;
    private final AtomicBoolean started = new AtomicBoolean(false);
    private final AtomicBoolean stopped = new AtomicBoolean(false);

    public RoomExecutor(String roomId) {
        Objects.requireNonNull(roomId, "roomId");
        this.executor = Executors.newSingleThreadExecutor(threadFactory(roomId));
    }

    public void start(Runnable task) {
        Objects.requireNonNull(task, "task");
        if (!started.compareAndSet(false, true)) {
            throw new IllegalStateException("Room executor already started");
        }
        executor.submit(task);
    }

    public void stop() {
        if (stopped.compareAndSet(false, true)) {
            executor.shutdownNow();
        }
    }

    public boolean isStarted() {
        return started.get();
    }

    public boolean isStopped() {
        return stopped.get();
    }

    @Override
    public void close() {
        stop();
    }

    private static ThreadFactory threadFactory(String roomId) {
        return runnable -> {
            Thread thread = new Thread(runnable);
            thread.setName("room-" + roomId + "-executor");
            thread.setDaemon(true);
            thread.setUncaughtExceptionHandler((t, e) -> {
                // Intentionally left minimal for MVP.
            });
            return thread;
        };
    }
}
