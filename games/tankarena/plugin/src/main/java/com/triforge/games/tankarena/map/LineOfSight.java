package com.triforge.games.tankarena.map;

public final class LineOfSight {
    private LineOfSight() {
    }

    public static boolean hasTileLineOfSight(GameMap map, int x0, int y0, int x1, int y1) {
        int dx = Math.abs(x1 - x0);
        int dy = Math.abs(y1 - y0);
        int x = x0;
        int y = y0;
        int stepX = x0 < x1 ? 1 : -1;
        int stepY = y0 < y1 ? 1 : -1;
        int error = dx - dy;

        while (true) {
            if (!(x == x0 && y == y0) && !(x == x1 && y == y1)) {
                if (!map.inBounds(x, y)) {
                    return false;
                }
                TileType tile = map.tileAt(x, y);
                if (tile.blocksVision()) {
                    return false;
                }
            }
            if (x == x1 && y == y1) {
                break;
            }
            int doubleError = error * 2;
            if (doubleError > -dy) {
                error -= dy;
                x += stepX;
            }
            if (doubleError < dx) {
                error += dx;
                y += stepY;
            }
        }
        return true;
    }

    public static boolean hasWorldLineOfSight(GameMap map, float x0, float y0, float x1, float y1) {
        return hasTileLineOfSight(
                map,
                map.worldToTileX(x0),
                map.worldToTileY(y0),
                map.worldToTileX(x1),
                map.worldToTileY(y1)
        );
    }
}
