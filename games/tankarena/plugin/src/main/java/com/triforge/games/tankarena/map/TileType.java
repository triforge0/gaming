package com.triforge.games.tankarena.map;

/**
 * Canonical Battle City tile vocabulary. STEEL doubles as the solid map border / out-of-bounds
 * sentinel; TREE is the cover tile (hides a tank, blocks vision, but is passable and lets bullets
 * through). The legacy generic WALL/COVER names were merged into STEEL/TREE.
 */
public enum TileType {
    EMPTY,
    BRICK,
    STEEL,
    WATER,
    TREE,
    HQ;

    public boolean blocksTank() {
        return this == BRICK || this == STEEL || this == WATER || this == HQ;
    }

    public boolean blocksTank(MapConfig config) {
        if (blocksTank()) {
            return true;
        }
        return providesCover() && config.coverBlocksMovement();
    }

    public boolean blocksBullet() {
        return this == BRICK || this == STEEL || this == WATER || this == HQ;
    }

    public boolean destroyedByBullet() {
        return this == BRICK;
    }

    public boolean isHeadquarters() {
        return this == HQ;
    }

    /** Whether sight cannot pass through this tile: solid tiles (steel/brick) and cover (trees). */
    public boolean blocksVision() {
        return this == STEEL || this == BRICK || this == TREE;
    }

    /** Cover tiles hide a tank standing on them; detection then needs short range or a clear ray. */
    public boolean providesCover() {
        return this == TREE || this == BRICK;
    }
}
