package com.triforge.games.treasurequest.content;

import java.util.Objects;

/**
 * The 2D adventure world: a tile grid plus the checkpoint graph and treasure zone. Movement,
 * collision, checkpoint detection, and the map snapshot all read from this. Tiles are immutable
 * (no destruction in TreasureQuest), so instances are safe to share within a room.
 */
public final class QuestMap {

    private final int width;
    private final int height;
    private final int tileSize;
    private final QuestTileType[] tiles;
    private final CheckpointGraph checkpoints;
    private final TreasureZone treasure;

    public QuestMap(
            int width,
            int height,
            int tileSize,
            QuestTileType[] tiles,
            CheckpointGraph checkpoints,
            TreasureZone treasure
    ) {
        if (width < 1 || height < 1) {
            throw new IllegalArgumentException("Map size must be positive");
        }
        if (tileSize < 1) {
            throw new IllegalArgumentException("tileSize must be positive");
        }
        Objects.requireNonNull(tiles, "tiles");
        if (tiles.length != width * height) {
            throw new IllegalArgumentException("Tile array length must equal width * height");
        }
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.tiles = tiles.clone();
        this.checkpoints = Objects.requireNonNull(checkpoints, "checkpoints");
        this.treasure = Objects.requireNonNull(treasure, "treasure");

        validateZonesWithinBounds();
    }

    private void validateZonesWithinBounds() {
        for (Checkpoint checkpoint : checkpoints.all()) {
            if (!checkpoint.zone().withinMap(width, height)) {
                throw new IllegalArgumentException(
                        "Checkpoint '" + checkpoint.id() + "' zone is outside the map bounds");
            }
        }
        if (!treasure.zone().withinMap(width, height)) {
            throw new IllegalArgumentException("Treasure zone is outside the map bounds");
        }
    }

    public int width() {
        return width;
    }

    public int height() {
        return height;
    }

    public int tileSize() {
        return tileSize;
    }

    public float worldWidth() {
        return width * (float) tileSize;
    }

    public float worldHeight() {
        return height * (float) tileSize;
    }

    public CheckpointGraph checkpoints() {
        return checkpoints;
    }

    public TreasureZone treasure() {
        return treasure;
    }

    public boolean inBounds(int tileX, int tileY) {
        return tileX >= 0 && tileX < width && tileY >= 0 && tileY < height;
    }

    /** Out-of-bounds reads as a solid WALL so the border blocks movement. */
    public QuestTileType tileAt(int tileX, int tileY) {
        if (!inBounds(tileX, tileY)) {
            return QuestTileType.WALL;
        }
        return tiles[tileY * width + tileX];
    }

    public QuestTileType tileAtWorld(float worldX, float worldY) {
        return tileAt((int) Math.floor(worldX / tileSize), (int) Math.floor(worldY / tileSize));
    }

    public boolean blocksMovementAtWorld(float worldX, float worldY) {
        return tileAtWorld(worldX, worldY).blocksMovement();
    }

    public float tileCenterX(int tileX) {
        return tileX * tileSize + tileSize / 2f;
    }

    public float tileCenterY(int tileY) {
        return tileY * tileSize + tileSize / 2f;
    }

    public int worldToTileX(float worldX) {
        return (int) Math.floor(worldX / tileSize);
    }

    public int worldToTileY(float worldY) {
        return (int) Math.floor(worldY / tileSize);
    }

    /** Row-major copy of the grid as protobuf tile types, for {@code MapSnapshot} (Task 5). */
    public com.triforge.protocol.proto.TileType[] toProtoTiles() {
        com.triforge.protocol.proto.TileType[] out = new com.triforge.protocol.proto.TileType[tiles.length];
        for (int i = 0; i < tiles.length; i++) {
            out[i] = tiles[i].toProto();
        }
        return out;
    }
}
