package com.triforge.games.f1racing;

import com.triforge.protocol.proto.F1SetRoomConfig;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class F1RoomConfigStateTest {

    @Test
    void qualifyingToggleAppliesEvenWhenTrackIdOmitted() {
        F1RoomConfigState config = new F1RoomConfigState();
        assertTrue(config.toProto().getEnableQualifying(), "defaults to qualifying on");

        // Host toggles qualifying off without re-sending the track id (as the lobby "Apply" panel does).
        config.applyHostConfig(F1SetRoomConfig.newBuilder()
                .setLapCount(3)
                .setEnableQualifying(false)
                .build());

        assertFalse(config.toProto().getEnableQualifying(), "toggle must apply without a track id");
    }
}
