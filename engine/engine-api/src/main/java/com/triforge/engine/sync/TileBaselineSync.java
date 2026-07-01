package com.triforge.engine.sync;

import com.triforge.engine.game.Game;
import com.triforge.protocol.proto.TileChange;

import java.util.Map;

/** Optional hook for tile-based delta baselines; no-op for games without a tile map. */
public interface TileBaselineSync {

    void syncBaseline(Game game, Map<Integer, Object> storage);

    void recordTileChange(TileChange change, Map<Integer, Object> storage);

    static TileBaselineSync noop() {
        return new TileBaselineSync() {
            @Override
            public void syncBaseline(Game game, Map<Integer, Object> storage) {
            }

            @Override
            public void recordTileChange(TileChange change, Map<Integer, Object> storage) {
            }
        };
    }
}
