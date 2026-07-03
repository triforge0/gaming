package com.triforge.games.treasurequest.sync;

import com.triforge.games.treasurequest.content.QuestMap;
import com.triforge.protocol.proto.MapSnapshot;

public final class QuestMapSnapshotService {

    private QuestMapSnapshotService() {
    }

    public static MapSnapshot toProto(QuestMap map) {
        MapSnapshot.Builder builder = MapSnapshot.newBuilder()
                .setWidth(map.width())
                .setHeight(map.height())
                .setTileSize(map.tileSize());
        for (com.triforge.protocol.proto.TileType tile : map.toProtoTiles()) {
            builder.addTiles(tile);
        }
        return builder.build();
    }
}
