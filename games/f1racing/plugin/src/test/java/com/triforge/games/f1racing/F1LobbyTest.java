package com.triforge.games.f1racing;

import com.triforge.protocol.proto.F1SetRoomConfig;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class F1LobbyTest {

    @Test
    void firstPlayerIsHostAndConfigApplies() {
        F1Lobby lobby = new F1Lobby();
        lobby.addPlayer(1L, "Host", true);

        assertTrue(lobby.isHost(1L));

        F1RoomConfigState config = new F1RoomConfigState();
        config.applyHostConfig(F1SetRoomConfig.newBuilder().setMaxPlayers(1).build());

        assertEquals(1, config.maxPlayers());
    }
}
