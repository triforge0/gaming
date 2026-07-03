package com.triforge.games.treasurequest.content;

/** Route flavour: dangerous branches sit in exposed areas and reward more points (risk/reward). */
public enum CheckpointRisk {
    NORMAL,
    SAFE,
    DANGEROUS;

    public static CheckpointRisk fromString(String value) {
        if (value == null || value.isBlank()) {
            return NORMAL;
        }
        return CheckpointRisk.valueOf(value.trim().toUpperCase());
    }
}
