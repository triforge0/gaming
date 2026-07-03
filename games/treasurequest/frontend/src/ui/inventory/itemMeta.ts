import { ItemType, ItemTypeValue } from '@triforge/shared-ui';

export interface ItemMeta {
  label: string;
  short: string;
  needsTarget: boolean;
  color: string;
  hint: string;
}

const META: Partial<Record<ItemTypeValue, ItemMeta>> = {
  [ItemType.ITEM_SHIELD]: {
    label: 'Shield',
    short: 'SHD',
    needsTarget: false,
    color: '#4ecdc4',
    hint: 'Block PvP for 5 min',
  },
  [ItemType.ITEM_SPEED]: {
    label: 'Speed',
    short: 'SPD',
    needsTarget: false,
    color: '#74c0fc',
    hint: 'Move faster + longer quiz timer',
  },
  [ItemType.ITEM_FAKE_MAP]: {
    label: 'Fake Map',
    short: 'MAP',
    needsTarget: true,
    color: '#ffd166',
    hint: 'Send a decoy hint to a rival',
  },
  [ItemType.ITEM_TREASURE_LOCK]: {
    label: 'Treasure Lock',
    short: 'LOCK',
    needsTarget: true,
    color: '#ff6b6b',
    hint: 'Block boss/treasure access briefly',
  },
};

export function itemMeta(item: ItemTypeValue | null | undefined): ItemMeta | undefined {
  if (item == null) {
    return undefined;
  }
  return META[item];
}

export function sortedInventoryItems(
  items: Array<{ item?: ItemTypeValue | null; count?: number | null }>,
): Array<{ item: ItemTypeValue; count: number }> {
  const order = [
    ItemType.ITEM_SHIELD,
    ItemType.ITEM_SPEED,
    ItemType.ITEM_FAKE_MAP,
    ItemType.ITEM_TREASURE_LOCK,
  ];
  const counts = new Map<ItemTypeValue, number>();
  for (const entry of items) {
    if (entry.item == null || entry.item === ItemType.ITEM_NONE) {
      continue;
    }
    const count = entry.count ?? 0;
    if (count <= 0) {
      continue;
    }
    counts.set(entry.item, count);
  }
  return order
    .filter((item) => counts.has(item))
    .map((item) => ({ item, count: counts.get(item) ?? 0 }));
}
