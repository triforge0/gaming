package com.triforge.server.application.room;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicInteger;

public final class RoomCommandQueue {
    private final ConcurrentLinkedQueue<Runnable> queue = new ConcurrentLinkedQueue<>();
    private final AtomicInteger size = new AtomicInteger();

    public void offer(Runnable command) {
        Objects.requireNonNull(command, "command");
        queue.offer(command);
        size.incrementAndGet();
    }

    public Runnable poll() {
        Runnable command = queue.poll();
        if (command != null) {
            size.decrementAndGet();
        }
        return command;
    }

    public List<Runnable> drainAll() {
        ArrayList<Runnable> drained = new ArrayList<>();
        for (Runnable command; (command = poll()) != null; ) {
            drained.add(command);
        }
        return drained;
    }

    public List<Runnable> drainUpTo(int maxCommands) {
        if (maxCommands < 0) {
            throw new IllegalArgumentException("maxCommands must be >= 0");
        }

        ArrayList<Runnable> drained = new ArrayList<>(Math.min(maxCommands, size()));
        for (int i = 0; i < maxCommands; i++) {
            Runnable command = poll();
            if (command == null) {
                break;
            }
            drained.add(command);
        }
        return drained;
    }

    public int size() {
        return size.get();
    }

    public boolean isEmpty() {
        return size() == 0;
    }

    public void clear() {
        while (poll() != null) {
            // Drain the queue.
        }
    }
}
