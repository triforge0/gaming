package com.triforge.games.tankarena.sync;

import com.triforge.engine.game.Game;
import com.triforge.engine.sync.TileBaselineSync;
import com.triforge.games.tankarena.TankArenaGame;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.protocol.proto.TileChange;

import java.util.Map;

public final class TankArenaTileBaselineSync implements TileBaselineSync {

    @Override
    public void syncBaseline(Game game, Map<Integer, Object> storage) {
        GameMap map = ((TankArenaGame) game).gameMap();
        for (int y = 0; y < map.height(); y++) {
            for (int x = 0; x < map.width(); x++) {
                storage.put(tileKey(x, y), map.tileAt(x, y));
            }
        }
    }

    @Override
    public void recordTileChange(TileChange change, Map<Integer, Object> storage) {
        storage.put(tileKey(change.getX(), change.getY()),
                TankArenaMapSnapshotService.fromProtoTile(change.getTile()));
    }

    private static int tileKey(int x, int y) {
        return (x << 16) | y;
    }
}
