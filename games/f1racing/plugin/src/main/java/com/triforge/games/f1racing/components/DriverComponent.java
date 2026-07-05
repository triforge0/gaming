package com.triforge.games.f1racing.components;

import com.triforge.engine.ecs.Component;

public final class DriverComponent implements Component {
    private final long playerId;
    private final String name;
    private final boolean bot;
    private String carId;
    private String primaryColor;

    public DriverComponent(long playerId, String name, boolean bot, String carId, String primaryColor) {
        this.playerId = playerId;
        this.name = name;
        this.bot = bot;
        this.carId = carId == null || carId.isBlank() ? "formula-modern" : carId;
        this.primaryColor = primaryColor == null || primaryColor.isBlank() ? "#e10600" : primaryColor;
    }

    public long playerId() {
        return playerId;
    }

    public String name() {
        return name;
    }

    public boolean bot() {
        return bot;
    }

    public String carId() {
        return carId;
    }

    public String primaryColor() {
        return primaryColor;
    }

    public void setCosmetics(String carId, String primaryColor) {
        if (carId != null && !carId.isBlank()) {
            this.carId = carId;
        }
        if (primaryColor != null && !primaryColor.isBlank()) {
            this.primaryColor = primaryColor;
        }
    }
}
