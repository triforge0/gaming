package com.triforge.engine.sync;

import com.triforge.protocol.proto.DeltaSnapshot;
import com.triforge.protocol.proto.FullSnapshot;

/** Game plugin hook: per-viewer snapshot filtering (fog-of-war, interest management, etc.). */
public interface InterestFilter {

    FullSnapshot filterFull(FullSnapshot snapshot, ViewerContext viewer);

    DeltaSnapshot filterDelta(DeltaSnapshot delta, ViewerContext viewer);
}
