package com.triforge.games.treasurequest.items;

import com.triforge.protocol.proto.ItemType;

import java.util.Objects;
import java.util.Set;

/** Validates whether an inventory item can be used in the current match context. */
public final class ItemUseValidator {

    private ItemUseValidator() {
    }

    public static String validate(
            ItemType item,
            long userPlayerId,
            long targetPlayerId,
            Inventory inventory,
            boolean inDuel,
            Set<Long> connectedPlayers
    ) {
        Objects.requireNonNull(item, "item");
        Objects.requireNonNull(inventory, "inventory");
        Objects.requireNonNull(connectedPlayers, "connectedPlayers");

        if (item == ItemType.ITEM_NONE) {
            return "Item is required";
        }
        if (!inventory.has(item)) {
            return "Item not in inventory";
        }
        if (inDuel) {
            return "Cannot use items during a duel";
        }

        return switch (QuestItemType.fromProto(item)) {
            case SHIELD, SPEED -> targetPlayerId == 0L || targetPlayerId == userPlayerId
                    ? null
                    : "Item can only be used on yourself";
            case FAKE_MAP, TREASURE_LOCK -> validateTargetedUse(userPlayerId, targetPlayerId, connectedPlayers);
        };
    }

    private static String validateTargetedUse(long userPlayerId, long targetPlayerId, Set<Long> connectedPlayers) {
        if (targetPlayerId == 0L) {
            return "Target player is required";
        }
        if (targetPlayerId == userPlayerId) {
            return "Target must be another player";
        }
        if (!connectedPlayers.contains(targetPlayerId)) {
            return "Target player is not in the room";
        }
        return null;
    }
}
