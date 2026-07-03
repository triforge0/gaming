package com.triforge.games.treasurequest;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.games.treasurequest.components.DirectionComponent;
import com.triforge.games.treasurequest.components.PositionComponent;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.protocol.proto.DirectionComponentProto;
import com.triforge.protocol.proto.EntityProto;
import com.triforge.protocol.proto.PositionComponentProto;
import com.triforge.protocol.proto.QuestAvatarComponentProto;

/** TreasureQuest entity → protobuf mapping for full/delta snapshots. */
public final class QuestSnapshotWriter implements EntitySnapshotWriter {

    public static final QuestSnapshotWriter INSTANCE = new QuestSnapshotWriter();

    private QuestSnapshotWriter() {
    }

    @Override
    public EntityProto writeEntity(long entityId, int entityIndex, ComponentManager componentManager) {
        EntityProto.Builder builder = EntityProto.newBuilder().setEntityId(entityId);

        QuestAvatarComponent avatar = componentManager.getAt(entityIndex, QuestAvatarComponent.class);
        if (avatar != null) {
            builder.setQuestAvatar(toQuestAvatarProto(avatar));
        }

        PositionComponent position = componentManager.getAt(entityIndex, PositionComponent.class);
        if (position != null) {
            builder.setPosition(toPositionProto(position));
        }

        DirectionComponent direction = componentManager.getAt(entityIndex, DirectionComponent.class);
        if (direction != null) {
            builder.setDirection(toDirectionProto(direction));
        }

        return builder.build();
    }

    private static QuestAvatarComponentProto toQuestAvatarProto(QuestAvatarComponent avatar) {
        return QuestAvatarComponentProto.newBuilder()
                .setPlayerId(avatar.playerId())
                .setName(avatar.name())
                .setScore(avatar.score())
                .setCurrentCheckpoint(avatar.currentCheckpoint())
                .setCheckpointsCleared(avatar.checkpointsCleared())
                .setShielded(avatar.shielded())
                .setPvpCooldown(avatar.pvpCooldown())
                .setStealImmune(avatar.stealImmune())
                .setInDuel(avatar.inDuel())
                .build();
    }

    private static PositionComponentProto toPositionProto(PositionComponent position) {
        return PositionComponentProto.newBuilder()
                .setX(position.x())
                .setY(position.y())
                .build();
    }

    private static DirectionComponentProto toDirectionProto(DirectionComponent direction) {
        return DirectionComponentProto.newBuilder()
                .setDirection(direction.direction())
                .build();
    }
}
