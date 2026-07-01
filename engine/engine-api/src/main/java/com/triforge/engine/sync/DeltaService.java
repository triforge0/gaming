package com.triforge.engine.sync;

import com.triforge.engine.game.Game;
import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.TileChange;

import java.util.List;
import java.util.Optional;

/** Tracks entity and tile baselines for delta snapshot generation. */
public interface DeltaService {

    void bindTileSync(TileBaselineSync tileSync);

    Optional<DeltaSnapshot> buildDelta(Game game, long tick, List<TileChange> tileChanges);

    void applyDelta(DeltaSnapshot delta, List<TileChange> tileChanges);

    void syncBaseline(Game game);

    void removeEntity(long entityId);

    void recordTileChanges(List<TileChange> tileChanges);
}
