package com.triforge.games.f1racing;

import com.triforge.protocol.proto.F1CollisionMode;
import com.triforge.protocol.proto.F1DamageMode;
import com.triforge.protocol.proto.F1RoomConfig;
import com.triforge.protocol.proto.F1SetRoomConfig;
import com.triforge.protocol.proto.F1TimeOfDay;
import com.triforge.protocol.proto.F1Weather;

/** Authoritative room settings for a match; host-mutable in LOBBY. */
final class F1RoomConfigState {

    private String trackId = F1Constants.DEFAULT_TRACK_ID;
    private String trackDisplayName = "City Loop";
    private int lapCount = F1Constants.DEFAULT_LAP_COUNT;
    private int maxPlayers = F1Constants.DEFAULT_MAX_PLAYERS;
    private int botCount;
    private String password = "";
    private F1CollisionMode collision = F1CollisionMode.F1_COLLISION_ON;
    private F1DamageMode damage = F1DamageMode.F1_DAMAGE_NONE;
    private F1Weather weather = F1Weather.F1_WEATHER_SUNNY;
    private F1TimeOfDay timeOfDay = F1TimeOfDay.F1_TIME_NOON;
    private boolean enableQualifying = true;
    private int qualifyingDurationSec = F1Constants.DEFAULT_QUALIFYING_DURATION_SEC;

    int maxPlayers() {
        return maxPlayers;
    }

    int botCount() {
        return botCount;
    }

    boolean passwordMatches(String candidate) {
        if (password == null || password.isBlank()) {
            return true;
        }
        return password.equals(candidate == null ? "" : candidate);
    }

    boolean passwordProtected() {
        return password != null && !password.isBlank();
    }

    void setTrackDisplayName(String trackDisplayName) {
        if (trackDisplayName != null && !trackDisplayName.isBlank()) {
            this.trackDisplayName = trackDisplayName.trim();
        }
    }

    void applyHostConfig(F1SetRoomConfig config) {
        if (!config.getTrackId().isBlank()) {
            trackId = config.getTrackId().trim();
        }
        enableQualifying = config.getEnableQualifying();
        if (config.getLapCount() > 0) {
            lapCount = config.getLapCount();
        }
        if (config.getMaxPlayers() > 0) {
            maxPlayers = Math.min(
                    Math.max(1, config.getMaxPlayers()),
                    F1Constants.ABSOLUTE_MAX_PLAYERS);
        }
        if (config.getBotCount() <= maxPlayers) {
            botCount = config.getBotCount();
        }
        password = config.getPassword();
        if (config.getCollision() != F1CollisionMode.UNRECOGNIZED) {
            collision = config.getCollision();
        }
        if (config.getDamage() != F1DamageMode.UNRECOGNIZED) {
            damage = config.getDamage();
        }
        if (config.getWeather() != F1Weather.UNRECOGNIZED) {
            weather = config.getWeather();
        }
        if (config.getTimeOfDay() != F1TimeOfDay.UNRECOGNIZED) {
            timeOfDay = config.getTimeOfDay();
        }
        if (config.getQualifyingDurationSec() > 0) {
            qualifyingDurationSec = config.getQualifyingDurationSec();
        }
    }

    void applySoloPreset(F1SoloMode mode, String soloTrackId) {
        trackId = soloTrackId == null || soloTrackId.isBlank()
                ? F1Constants.DEFAULT_TRACK_ID
                : soloTrackId.trim();
        password = "";
        collision = F1CollisionMode.F1_COLLISION_OFF;
        switch (mode) {
            case PRACTICE -> {
                enableQualifying = false;
                botCount = 0;
                lapCount = 999;
                maxPlayers = 1;
            }
            case TIME_TRIAL -> {
                enableQualifying = true;
                qualifyingDurationSec = 600;
                botCount = 0;
                lapCount = 1;
                maxPlayers = 1;
            }
            case RACE_BOTS -> {
                enableQualifying = false;
                botCount = 3;
                lapCount = F1Constants.DEFAULT_LAP_COUNT;
                collision = F1CollisionMode.F1_COLLISION_ON;
                maxPlayers = 4;
            }
        }
    }

    F1RoomConfig toProto() {
        return F1RoomConfig.newBuilder()
                .setTrackId(trackId)
                .setTrackDisplayName(trackDisplayName)
                .setLapCount(lapCount)
                .setMaxPlayers(maxPlayers)
                .setBotCount(botCount)
                .setPasswordProtected(passwordProtected())
                .setCollision(collision)
                .setDamage(damage)
                .setWeather(weather)
                .setTimeOfDay(timeOfDay)
                .setEnableQualifying(enableQualifying)
                .setQualifyingDurationSec(qualifyingDurationSec)
                .build();
    }
}
