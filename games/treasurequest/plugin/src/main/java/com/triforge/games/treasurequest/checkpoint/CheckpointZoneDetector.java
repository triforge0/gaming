package com.triforge.games.treasurequest.checkpoint;

import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.CheckpointGraph;
import com.triforge.games.treasurequest.content.QuestMap;
import com.triforge.games.treasurequest.content.Rect;
import com.triforge.games.treasurequest.world.WorldBounds;

import java.util.Objects;

/** Tests avatar AABB overlap against checkpoint zones on the quest map. */
public final class CheckpointZoneDetector {

    private final QuestMap questMap;

    public CheckpointZoneDetector(QuestMap questMap) {
        this.questMap = Objects.requireNonNull(questMap, "questMap");
    }

    public boolean isInCurrentCheckpointZone(CheckpointGraph graph, String currentCheckpointId, float centerX, float centerY) {
        Checkpoint checkpoint = graph.get(currentCheckpointId);
        if (checkpoint == null) {
            return false;
        }
        return avatarOverlapsZone(checkpoint.zone(), centerX, centerY);
    }

    public boolean isInCheckpointZone(Checkpoint checkpoint, float centerX, float centerY) {
        Objects.requireNonNull(checkpoint, "checkpoint");
        return avatarOverlapsZone(checkpoint.zone(), centerX, centerY);
    }

    public boolean avatarOverlapsZone(Rect zone, float centerX, float centerY) {
        float half = WorldBounds.AVATAR_HALF_SIZE;
        float avatarMinX = centerX - half;
        float avatarMaxX = centerX + half;
        float avatarMinY = centerY - half;
        float avatarMaxY = centerY + half;

        int tileSize = questMap.tileSize();
        float zoneMinX = zone.x() * tileSize;
        float zoneMaxX = (zone.x() + zone.w()) * tileSize;
        float zoneMinY = zone.y() * tileSize;
        float zoneMaxY = (zone.y() + zone.h()) * tileSize;

        return avatarMaxX > zoneMinX
                && avatarMinX < zoneMaxX
                && avatarMaxY > zoneMinY
                && avatarMinY < zoneMaxY;
    }
}
