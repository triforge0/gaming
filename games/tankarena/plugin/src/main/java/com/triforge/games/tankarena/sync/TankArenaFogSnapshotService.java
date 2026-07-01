package com.triforge.games.tankarena.sync;

import com.triforge.games.tankarena.map.FogVisibility;
import com.triforge.games.tankarena.map.VisibilityMap;
import com.triforge.protocol.proto.FogCellState;
import com.triforge.protocol.proto.FogSnapshot;

public final class TankArenaFogSnapshotService {

    private TankArenaFogSnapshotService() {
    }

    public static FogSnapshot toProto(VisibilityMap visibilityMap) {
        return FogSnapshot.newBuilder()
                .setWidth(visibilityMap.width())
                .setHeight(visibilityMap.height())
                .setCells(com.google.protobuf.ByteString.copyFrom(visibilityMap.cells()))
                .build();
    }

    public static FogCellState toProtoCell(byte cell) {
        return switch (cell) {
            case FogVisibility.SEEN -> FogCellState.SEEN;
            case FogVisibility.VISIBLE -> FogCellState.VISIBLE;
            default -> FogCellState.UNKNOWN;
        };
    }
}
