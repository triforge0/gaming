package com.triforge.games.treasurequest.content;

/** Tile-coordinate rectangle (top-left origin, size in tiles). Used for checkpoint + treasure zones. */
public record Rect(int x, int y, int w, int h) {

    public Rect {
        if (w <= 0 || h <= 0) {
            throw new IllegalArgumentException("Rect size must be positive: w=" + w + ", h=" + h);
        }
    }

    public boolean containsTile(int tileX, int tileY) {
        return tileX >= x && tileX < x + w && tileY >= y && tileY < y + h;
    }

    public boolean withinMap(int mapWidth, int mapHeight) {
        return x >= 0 && y >= 0 && x + w <= mapWidth && y + h <= mapHeight;
    }

    public boolean containsWorld(float worldX, float worldY, int tileSize) {
        return containsTile((int) Math.floor(worldX / tileSize), (int) Math.floor(worldY / tileSize));
    }

    public float centerWorldX(int tileSize) {
        return (x + w / 2f) * tileSize;
    }

    public float centerWorldY(int tileSize) {
        return (y + h / 2f) * tileSize;
    }
}
