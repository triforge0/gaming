package com.triforge.engine.sync;

import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.FullSnapshot;

/** Snapshot filter that forwards all entities and tiles to every viewer. */
public final class PassThroughInterestFilter implements InterestFilter {

    public static final PassThroughInterestFilter INSTANCE = new PassThroughInterestFilter();

    private PassThroughInterestFilter() {
    }

    @Override
    public FullSnapshot filterFull(FullSnapshot snapshot, ViewerContext viewer) {
        return snapshot;
    }

    @Override
    public DeltaSnapshot filterDelta(DeltaSnapshot delta, ViewerContext viewer) {
        return delta;
    }
}
