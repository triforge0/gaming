package com.triforge.games.f1racing.replay;

import com.triforge.games.f1racing.physics.VehicleState;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Samples authoritative car states during PLAYING for replay export. */
public final class ReplayRecorder {

    private static final int SAMPLE_INTERVAL_TICKS = 3;

    private final List<ReplayFrame> frames = new ArrayList<>();
    private boolean active;

    public void begin() {
        frames.clear();
        active = true;
    }

    public void stop() {
        active = false;
    }

    public boolean isActive() {
        return active;
    }

    public void sample(
            long tick,
            Map<Long, Long> playerEntities,
            Map<Long, VehicleState> vehicleStates,
            Map<Long, ReplayDriverMeta> drivers
    ) {
        if (!active || tick % SAMPLE_INTERVAL_TICKS != 0) {
            return;
        }
        for (var entry : playerEntities.entrySet()) {
            long playerId = entry.getKey();
            VehicleState state = vehicleStates.get(playerId);
            if (state == null) {
                continue;
            }
            ReplayDriverMeta driver = drivers.getOrDefault(
                    playerId,
                    new ReplayDriverMeta("Driver", false, "formula-modern", "#e10600"));
            frames.add(new ReplayFrame(
                    tick,
                    playerId,
                    driver.displayName(),
                    driver.carId(),
                    driver.primaryColor(),
                    state.x(),
                    state.y(),
                    state.z(),
                    state.yaw(),
                    state.speed(),
                    driver.bot()));
        }
    }

    public List<ReplayFrame> frames() {
        return List.copyOf(frames);
    }
}
