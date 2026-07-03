package com.triforge.server.application.room.chat;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class ChatRateLimiterTest {

    @Test
    void allowsFiveThenBlocksUntilWindowExpires() {
        ChatRateLimiter limiter = new ChatRateLimiter();

        for (int i = 0; i < ChatRateLimiter.MAX_MESSAGES; i++) {
            assertTrue(limiter.allow(1L), "message " + (i + 1));
        }
        assertFalse(limiter.allow(1L), "sixth message in window must be dropped");
    }

    @Test
    void recoversAfterWindow() throws InterruptedException {
        ChatRateLimiter limiter = new ChatRateLimiter();
        for (int i = 0; i < ChatRateLimiter.MAX_MESSAGES; i++) {
            assertTrue(limiter.allow(1L));
        }
        assertFalse(limiter.allow(1L));

        Thread.sleep(ChatRateLimiter.WINDOW_MS + 50);

        assertTrue(limiter.allow(1L), "should allow again after window elapses");
    }
}
