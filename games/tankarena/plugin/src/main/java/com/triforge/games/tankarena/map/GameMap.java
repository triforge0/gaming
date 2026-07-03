package com.triforge.games.tankarena.map;

import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.TileChange;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public final class GameMap {
    private final int width;
    private final int height;
    private final int tileSize;
    private final TileType[] tiles;
    private final float[] heights;
    private final Map<SpawnRegion, SpawnRegionDefinition> spawnRegions;
    private final List<HeadquartersDefinition> headquarters;

    public static Builder builder() {
        return new Builder();
    }

    public static Builder builder(int width, int height) {
        return new Builder().size(width, height);
    }

    private GameMap(
            int width,
            int height,
            int tileSize,
            TileType[] tiles,
            float[] heights,
            Map<SpawnRegion, SpawnRegionDefinition> spawnRegions,
            List<HeadquartersDefinition> headquarters
    ) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.tiles = tiles;
        this.heights = heights;
        this.spawnRegions = spawnRegions;
        this.headquarters = headquarters;
    }

    public static final class Builder {
        private int width;
        private int height;
        private int tileSize;
        private TileType[] tiles;
        private float[] heights;
        private Map<SpawnRegion, SpawnRegionDefinition> spawnRegions;
        private List<HeadquartersDefinition> headquarters;

        private Builder() {
        }

        public Builder size(int width, int height) {
            if (width < 1 || height < 1) {
                throw new IllegalArgumentException("Map size must be positive");
            }
            this.width = width;
            this.height = height;
            return this;
        }

        public Builder tileSize(int tileSize) {
            if (tileSize < 1) {
                throw new IllegalArgumentException("tileSize must be positive");
            }
            this.tileSize = tileSize;
            return this;
        }

        public Builder tiles(TileType[] tiles) {
            this.tiles = Objects.requireNonNull(tiles, "tiles");
            return this;
        }

        /** Optional per-cell elevation (row-major, length width*height). Null = flat. */
        public Builder heights(float[] heights) {
            this.heights = heights;
            return this;
        }

        public Builder spawnRegions(Map<SpawnRegion, SpawnRegionDefinition> spawnRegions) {
            this.spawnRegions = Objects.requireNonNull(spawnRegions, "spawnRegions");
            return this;
        }

        public Builder headquarters(List<HeadquartersDefinition> headquarters) {
            this.headquarters = Objects.requireNonNull(headquarters, "headquarters");
            return this;
        }

        public GameMap build() {
            if (width < 1 || height < 1) {
                throw new IllegalStateException("Map size is required");
            }
            if (tileSize < 1) {
                throw new IllegalStateException("tileSize is required");
            }
            Objects.requireNonNull(tiles, "tiles");
            if (tiles.length != width * height) {
                throw new IllegalArgumentException("Tile array length must equal width * height");
            }

            float[] resolvedHeights;
            if (heights == null) {
                resolvedHeights = new float[width * height]; // flat terrain
            } else if (heights.length != width * height) {
                throw new IllegalArgumentException("Height array length must equal width * height");
            } else {
                resolvedHeights = heights.clone();
            }

            Map<SpawnRegion, SpawnRegionDefinition> resolvedSpawnRegions = spawnRegions != null
                    ? new EnumMap<>(spawnRegions)
                    : SpawnRegionDefinition.defaultCorners(width, height);
            List<HeadquartersDefinition> resolvedHeadquarters = headquarters != null
                    ? new ArrayList<>(headquarters)
                    : new ArrayList<>();

            return new GameMap(
                    width,
                    height,
                    tileSize,
                    tiles.clone(),
                    resolvedHeights,
                    resolvedSpawnRegions,
                    resolvedHeadquarters
            );
        }
    }

    public List<HeadquartersDefinition> headquarters() {
        return List.copyOf(headquarters);
    }

    /** Replaces one team's HQ tiles and definition; clears any prior HQ for that team. */
    public void replaceTeamHeadquarters(HeadquartersDefinition definition) {
        Objects.requireNonNull(definition, "definition");
        Team team = definition.team();
        for (HeadquartersDefinition existing : List.copyOf(headquarters)) {
            if (existing.team() == team) {
                clearHeadquartersTiles(existing);
                headquarters.remove(existing);
            }
        }
        paintHeadquartersTiles(definition);
        headquarters.add(definition);
    }

    public void clearTeamHeadquarters(Team team) {
        for (HeadquartersDefinition existing : List.copyOf(headquarters)) {
            if (existing.team() == team) {
                clearHeadquartersTiles(existing);
                headquarters.remove(existing);
            }
        }
    }

    private void clearHeadquartersTiles(HeadquartersDefinition hq) {
        for (int tileY = hq.minTileY(); tileY <= hq.maxTileY(); tileY++) {
            for (int tileX = hq.minTileX(); tileX <= hq.maxTileX(); tileX++) {
                if (inBounds(tileX, tileY) && tiles[index(tileX, tileY)] == TileType.HQ) {
                    tiles[index(tileX, tileY)] = TileType.EMPTY;
                }
            }
        }
    }

    private void paintHeadquartersTiles(HeadquartersDefinition hq) {
        for (int tileY = hq.minTileY(); tileY <= hq.maxTileY(); tileY++) {
            for (int tileX = hq.minTileX(); tileX <= hq.maxTileX(); tileX++) {
                if (inBounds(tileX, tileY)) {
                    tiles[index(tileX, tileY)] = TileType.HQ;
                }
            }
        }
    }

    public Optional<Team> hqTeamAt(int tileX, int tileY) {
        for (HeadquartersDefinition definition : headquarters) {
            if (definition.contains(tileX, tileY)) {
                return Optional.of(definition.team());
            }
        }
        return Optional.empty();
    }

    public Optional<Team> hqTeamAtWorld(float worldX, float worldY) {
        return hqTeamAt(worldToTileX(worldX), worldToTileY(worldY));
    }

    /** Region rectangle for the given corner, or {@code null} if undefined (e.g. UNSPECIFIED). */
    public SpawnRegionDefinition spawnRegion(SpawnRegion region) {
        return spawnRegions.get(region);
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

    public TileType tileAt(int x, int y) {
        if (!inBounds(x, y)) {
            return TileType.STEEL;
        }
        return tiles[index(x, y)];
    }

    public TileType tileAtWorld(float worldX, float worldY) {
        return tileAt(worldToTileX(worldX), worldToTileY(worldY));
    }

    /** Elevation at a tile's sample point, clamped to bounds. Flat maps return 0. */
    public float cellHeight(int tileX, int tileY) {
        int cx = Math.max(0, Math.min(width - 1, tileX));
        int cy = Math.max(0, Math.min(height - 1, tileY));
        return heights[index(cx, cy)];
    }

    /**
     * Ground elevation at a world position, bilinearly interpolated between the four
     * nearest tile-center samples. Height samples sit at tile centers, so a world point
     * exactly on a tile center returns that cell's height.
     */
    public float heightAt(float worldX, float worldY) {
        float fx = worldX / tileSize - 0.5f;
        float fy = worldY / tileSize - 0.5f;
        int x0 = (int) Math.floor(fx);
        int y0 = (int) Math.floor(fy);
        float tx = fx - x0;
        float ty = fy - y0;

        float h00 = cellHeight(x0, y0);
        float h10 = cellHeight(x0 + 1, y0);
        float h01 = cellHeight(x0, y0 + 1);
        float h11 = cellHeight(x0 + 1, y0 + 1);

        float top = h00 + (h10 - h00) * tx;
        float bottom = h01 + (h11 - h01) * tx;
        return top + (bottom - top) * ty;
    }

    /** True when every cell is at elevation 0 — lets the snapshot omit the heightfield. */
    public boolean isFlat() {
        for (float h : heights) {
            if (h != 0f) {
                return false;
            }
        }
        return true;
    }

    public float[] copyHeights() {
        return heights.clone();
    }

    public int worldToTileX(float worldX) {
        return (int) Math.floor(worldX / tileSize);
    }

    public int worldToTileY(float worldY) {
        return (int) Math.floor(worldY / tileSize);
    }

    public float tileCenterX(int tileX) {
        return tileX * tileSize + tileSize / 2f;
    }

    public float tileCenterY(int tileY) {
        return tileY * tileSize + tileSize / 2f;
    }

    public boolean inBounds(int x, int y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    public boolean setTile(int x, int y, TileType type) {
        Objects.requireNonNull(type, "type");
        if (!inBounds(x, y)) {
            return false;
        }
        int index = index(x, y);
        if (tiles[index] == type) {
            return false;
        }
        tiles[index] = type;
        return true;
    }

    public boolean destroyTile(int x, int y) {
        if (!inBounds(x, y)) {
            return false;
        }
        int index = index(x, y);
        if (!tiles[index].destroyedByBullet()) {
            return false;
        }
        tiles[index] = TileType.EMPTY;
        return true;
    }

    public List<TileChange> copyTileChanges(List<TileChange> changes) {
        return new ArrayList<>(changes);
    }

    public TileType[] copyTiles() {
        return tiles.clone();
    }

    private int index(int x, int y) {
        return y * width + x;
    }
}
