package com.triforge.server.application.room;

import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class RoomSessionManagerTest {

    @Test
    void displayNameTracksSetRenameAndUnregister() {
        RoomSessionManager sessions = new RoomSessionManager("room");
        EmbeddedChannel channel = new EmbeddedChannel();

        sessions.register(1L, channel);
        assertEquals("Player-1", sessions.displayNameOf(1L));

        sessions.setDisplayName(1L, "Alpha");
        assertEquals("Alpha", sessions.displayNameOf(1L));

        sessions.setDisplayName(1L, "Beta");
        assertEquals("Beta", sessions.displayNameOf(1L));

        sessions.unregister(1L);
        assertEquals("Player-1", sessions.displayNameOf(1L));
    }
}
