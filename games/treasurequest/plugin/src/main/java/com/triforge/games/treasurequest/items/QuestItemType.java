package com.triforge.games.treasurequest.items;

import com.triforge.protocol.proto.ItemType;

import java.util.Locale;
import java.util.Objects;

/** Domain view of expedition inventory items. */
public enum QuestItemType {
    SHIELD(ItemType.ITEM_SHIELD),
    SPEED(ItemType.ITEM_SPEED),
    FAKE_MAP(ItemType.ITEM_FAKE_MAP),
    TREASURE_LOCK(ItemType.ITEM_TREASURE_LOCK);

    private final ItemType protoType;

    QuestItemType(ItemType protoType) {
        this.protoType = protoType;
    }

    public ItemType protoType() {
        return protoType;
    }

    public static QuestItemType fromRewardId(String rewardId) {
        Objects.requireNonNull(rewardId, "rewardId");
        return switch (rewardId.trim().toLowerCase(Locale.ROOT)) {
            case "shield" -> SHIELD;
            case "speed" -> SPEED;
            case "fake_map", "fakemap", "fake-map" -> FAKE_MAP;
            case "treasure_lock", "treasurelock", "treasure-lock" -> TREASURE_LOCK;
            default -> throw new IllegalArgumentException("Unknown reward item: " + rewardId);
        };
    }

    public static QuestItemType fromProto(ItemType protoType) {
        return switch (protoType) {
            case ITEM_SHIELD -> SHIELD;
            case ITEM_SPEED -> SPEED;
            case ITEM_FAKE_MAP -> FAKE_MAP;
            case ITEM_TREASURE_LOCK -> TREASURE_LOCK;
            case ITEM_NONE, UNRECOGNIZED -> throw new IllegalArgumentException("Unsupported item: " + protoType);
        };
    }
}
