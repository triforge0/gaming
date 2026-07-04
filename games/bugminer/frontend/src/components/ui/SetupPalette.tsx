import { ITEM_DEFINITIONS, type PlacedItem } from '../../shared';

interface Props {
  items: PlacedItem[];
  selectedItemId: string | null;
  draggingItemId: string | null;
  onPickItem: (itemId: string) => void;
  onDragStart: (itemId: string) => void;
}

export default function SetupPalette({
  items,
  selectedItemId,
  draggingItemId,
  onPickItem,
  onDragStart,
}: Props) {
  const unplaced = items.filter((i) => i.position.x === 0 && i.position.y === 0);

  const grouped = unplaced.reduce<Record<string, PlacedItem[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="setup-palette">
      {Object.entries(grouped).map(([type, typeItems]) => {
        const def = ITEM_DEFINITIONS[type as keyof typeof ITEM_DEFINITIONS];
        const firstUnplaced = typeItems[0];
        const active = selectedItemId === firstUnplaced.id || draggingItemId === firstUnplaced.id;
        return (
          <button
            key={type}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('itemId', firstUnplaced.id);
              onDragStart(firstUnplaced.id);
            }}
            onClick={() => onPickItem(firstUnplaced.id)}
            className={`setup-palette-item setup-palette-${type} ${active ? 'active' : ''}`}
            title={def.label}
          >
            <span className="setup-palette-emoji">{def.emoji}</span>
            <span className="setup-palette-label">{def.label}</span>
            <span className="setup-palette-count">x{typeItems.length}</span>
          </button>
        );
      })}
      {unplaced.length === 0 && (
        <span className="setup-palette-done">✓ All items placed!</span>
      )}
    </div>
  );
}
