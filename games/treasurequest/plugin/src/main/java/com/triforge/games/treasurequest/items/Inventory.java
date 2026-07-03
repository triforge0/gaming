package com.triforge.games.treasurequest.items;

import com.triforge.protocol.proto.InventoryItemProto;
import com.triforge.protocol.proto.ItemType;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/** Stack counts for each {@link ItemType}. */
public final class Inventory {

    private final EnumMap<ItemType, Integer> counts = new EnumMap<>(ItemType.class);

    public static Inventory empty() {
        return new Inventory();
    }

    public void grant(ItemType item, int amount) {
        if (item == null || item == ItemType.ITEM_NONE || amount <= 0) {
            return;
        }
        counts.merge(item, amount, Integer::sum);
    }

    public boolean consume(ItemType item) {
        if (item == null || item == ItemType.ITEM_NONE) {
            return false;
        }
        int current = counts.getOrDefault(item, 0);
        if (current <= 0) {
            return false;
        }
        if (current == 1) {
            counts.remove(item);
        } else {
            counts.put(item, current - 1);
        }
        return true;
    }

    public int count(ItemType item) {
        return counts.getOrDefault(item, 0);
    }

    public boolean has(ItemType item) {
        return count(item) > 0;
    }

    public List<InventoryItemProto> toProto() {
        List<InventoryItemProto> items = new ArrayList<>();
        for (Map.Entry<ItemType, Integer> entry : counts.entrySet()) {
            if (entry.getValue() > 0) {
                items.add(InventoryItemProto.newBuilder()
                        .setItem(entry.getKey())
                        .setCount(entry.getValue())
                        .build());
            }
        }
        return items;
    }
}
