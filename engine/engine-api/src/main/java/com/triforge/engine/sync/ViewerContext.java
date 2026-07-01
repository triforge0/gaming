package com.triforge.engine.sync;

/** Per-client viewpoint used by {@link InterestFilter} when trimming snapshots. */
public record ViewerContext(long playerId, long entityId, float x, float y) {
}
