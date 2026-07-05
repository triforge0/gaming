package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerPlacedItem;

final class PlacedItemProto {
    private PlacedItemProto() {}

    static BugMinerPlacedItem toProto(PlacedItem item) {
        BugMinerPlacedItem.Builder b = BugMinerPlacedItem.newBuilder()
                .setId(item.id)
                .setType(item.type)
                .setX(item.x)
                .setY(item.y)
                .setCollected(item.collected)
                .setScale(item.scale)
                .setMoving(item.moving)
                .setVx(item.vx)
                .setVy(item.vy);
        return b.build();
    }
}
