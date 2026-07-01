package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.Team;

import java.util.Objects;

/** Tile-space rectangle for a team's headquarters (eagle/base). */
public final class HeadquartersDefinition {
    public static final int DEFAULT_MAX_HP = 5;

    private final Team team;
    private final int minTileX;
    private final int minTileY;
    private final int maxTileX;
    private final int maxTileY;
    private final int maxHp;

    public static HeadquartersDefinition rect(Team team, int x, int y, int width, int height) {
        return rect(team, x, y, width, height, DEFAULT_MAX_HP);
    }

    public static HeadquartersDefinition rect(Team team, int x, int y, int width, int height, int maxHp) {
        if (width < 1 || height < 1) {
            throw new IllegalArgumentException("HQ size must be at least 1x1");
        }
        if (maxHp < 1) {
            throw new IllegalArgumentException("HQ maxHp must be positive");
        }
        Team playableTeam = Objects.requireNonNull(team, "team");
        if (!playableTeam.isPlayable()) {
            throw new IllegalArgumentException("HQ team must be RED or BLUE");
        }
        return new HeadquartersDefinition(
                playableTeam,
                x,
                y,
                x + width - 1,
                y + height - 1,
                maxHp
        );
    }

    private HeadquartersDefinition(
            Team team,
            int minTileX,
            int minTileY,
            int maxTileX,
            int maxTileY,
            int maxHp
    ) {
        this.team = team;
        this.minTileX = minTileX;
        this.minTileY = minTileY;
        this.maxTileX = maxTileX;
        this.maxTileY = maxTileY;
        this.maxHp = maxHp;
    }

    public Team team() {
        return team;
    }

    public int minTileX() {
        return minTileX;
    }

    public int minTileY() {
        return minTileY;
    }

    public int maxTileX() {
        return maxTileX;
    }

    public int maxTileY() {
        return maxTileY;
    }

    public int maxHp() {
        return maxHp;
    }

    public boolean contains(int tileX, int tileY) {
        return tileX >= minTileX && tileX <= maxTileX && tileY >= minTileY && tileY <= maxTileY;
    }

    public boolean containsWorld(float worldX, float worldY, int tileSize) {
        int tileX = (int) Math.floor(worldX / tileSize);
        int tileY = (int) Math.floor(worldY / tileSize);
        return contains(tileX, tileY);
    }
}
