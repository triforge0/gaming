package com.triforge.engine.game;

import com.triforge.engine.match.MatchController;
import com.triforge.protocol.proto.MatchPhaseUpdate;

/**
 * Per-viewer snapshot filtering and HUD enrichment callbacks implemented by the active {@link Game}.
 */
public interface RoomBroadcastView {

    long playerEntityId(long playerId);

    void viewerPosition(long playerId, float[] out);

    /** Game-specific HUD fields (e.g. Tank Arena HQ HP). Default: no-op. */
    default void enrichMatchPhaseUpdate(MatchPhaseUpdate.Builder builder, MatchController matchController) {
    }
}
