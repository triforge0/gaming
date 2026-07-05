package com.triforge.games.f1racing.replay;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ReplayFrame(
        long tick,
        long playerId,
        String displayName,
        String carId,
        String primaryColor,
        float x,
        float y,
        float z,
        float yaw,
        float speed,
        boolean bot
) {
}
