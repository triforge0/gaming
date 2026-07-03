package com.triforge.server.application.room.chat;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Sliding-window limiter: at most five messages per two seconds per player. */
public final class ChatRateLimiter {
    static final int MAX_MESSAGES = 5;
    static final long WINDOW_MS = 2000L;

    private final Map<Long, Deque<Long>> timestampsByPlayer = new ConcurrentHashMap<>();

    public boolean allow(long playerId) {
        long now = System.currentTimeMillis();
        Deque<Long> timestamps = timestampsByPlayer.computeIfAbsent(playerId, ignored -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_MS) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= MAX_MESSAGES) {
                return false;
            }
            timestamps.addLast(now);
            return true;
        }
    }
}
