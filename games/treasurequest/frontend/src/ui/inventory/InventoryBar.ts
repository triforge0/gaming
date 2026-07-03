import { GameClient, ItemTypeValue, toNum } from '@triforge/shared-ui';
import { itemMeta, sortedInventoryItems } from './itemMeta';

export interface InventoryPlayerOption {
  playerId: number;
  name: string;
}

type OtherPlayersProvider = () => InventoryPlayerOption[];

export class InventoryBar {
  private readonly root: HTMLDivElement;
  private readonly slotsEl: HTMLDivElement;
  private readonly pickerEl: HTMLDivElement;
  private readonly pickerTitleEl: HTMLDivElement;
  private readonly pickerListEl: HTMLDivElement;

  private pendingItem?: ItemTypeValue;
  private enabled = true;

  constructor(
    private readonly client: GameClient,
    private readonly otherPlayers: OtherPlayersProvider,
  ) {
    this.root = document.createElement('div');
    this.root.style.cssText =
      'position:absolute;left:50%;bottom:36px;transform:translateX(-50%);display:none;' +
      'padding:8px 10px;border-radius:10px;background:rgba(0,0,0,0.78);border:1px solid #333;' +
      'font-family:monospace;z-index:22;max-width:min(640px,96vw);';

    this.slotsEl = document.createElement('div');
    this.slotsEl.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;';

    this.pickerEl = document.createElement('div');
    this.pickerEl.style.cssText =
      'position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%);' +
      'min-width:220px;padding:10px 12px;border-radius:10px;background:rgba(18,18,24,0.98);' +
      'border:1px solid #555;display:none;';

    this.pickerTitleEl = document.createElement('div');
    this.pickerTitleEl.style.cssText = 'font-size:12px;color:#ccc;margin-bottom:8px;';

    this.pickerListEl = document.createElement('div');
    this.pickerListEl.style.cssText = 'display:flex;flex-direction:column;gap:6px;max-height:180px;overflow:auto;';

    this.pickerEl.append(this.pickerTitleEl, this.pickerListEl);
    this.root.append(this.slotsEl, this.pickerEl);
    document.body.appendChild(this.root);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.slotsEl.querySelectorAll('button').forEach((button) => {
      (button as HTMLButtonElement).disabled = !enabled;
    });
  }

  update(items: Array<{ item?: ItemTypeValue | null; count?: number | null }>): void {
    this.slotsEl.replaceChildren();
    const sorted = sortedInventoryItems(items);
    if (sorted.length === 0) {
      this.root.style.display = 'none';
      this.hidePicker();
      return;
    }

    this.root.style.display = 'block';
    for (const entry of sorted) {
      const meta = itemMeta(entry.item);
      if (!meta) {
        continue;
      }
      this.slotsEl.append(this.slotButton(entry.item, entry.count, meta));
    }
  }

  destroy(): void {
    this.hidePicker();
    this.root.remove();
  }

  private slotButton(item: ItemTypeValue, count: number, meta: NonNullable<ReturnType<typeof itemMeta>>): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = `${meta.label} ×${count} — ${meta.hint}`;
    btn.disabled = !this.enabled;
    btn.style.cssText =
      `position:relative;padding:8px 12px 8px 10px;border:1px solid ${meta.color};` +
      `border-radius:8px;background:rgba(255,255,255,0.06);color:${meta.color};` +
      'cursor:pointer;font-family:monospace;font-size:12px;';
    btn.textContent = meta.short;

    const badge = document.createElement('span');
    badge.textContent = String(count);
    badge.style.cssText =
      'position:absolute;top:-6px;right:-6px;min-width:16px;height:16px;padding:0 4px;' +
      'border-radius:999px;background:#222;color:#eee;font-size:10px;line-height:16px;text-align:center;';
    btn.appendChild(badge);

    btn.onclick = () => this.useItem(item, meta);
    return btn;
  }

  private useItem(item: ItemTypeValue, meta: NonNullable<ReturnType<typeof itemMeta>>): void {
    if (!this.enabled) {
      return;
    }
    if (!meta.needsTarget) {
      this.client.sendItemUse(item, 0);
      return;
    }
    this.showPicker(item, meta);
  }

  private showPicker(item: ItemTypeValue, meta: NonNullable<ReturnType<typeof itemMeta>>): void {
    const options = this.otherPlayers().filter((player) => player.playerId !== this.client.selfPlayerId);
    this.pendingItem = item;
    this.pickerTitleEl.textContent = `${meta.label}: choose target`;
    this.pickerListEl.replaceChildren();

    if (options.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No other players nearby in room';
      empty.style.cssText = 'font-size:11px;color:#888;';
      this.pickerListEl.append(empty);
    } else {
      for (const option of options) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = option.name;
        btn.style.cssText =
          'padding:6px 10px;border:1px solid #444;border-radius:6px;background:#1a1a22;color:#eee;' +
          'cursor:pointer;font-family:monospace;font-size:12px;text-align:left;';
        btn.onclick = () => {
          if (this.pendingItem != null) {
            this.client.sendItemUse(this.pendingItem, option.playerId);
          }
          this.hidePicker();
        };
        this.pickerListEl.append(btn);
      }
    }

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancel';
    cancel.style.cssText =
      'margin-top:8px;padding:4px 8px;border:none;background:transparent;color:#888;' +
      'cursor:pointer;font-family:monospace;font-size:11px;';
    cancel.onclick = () => this.hidePicker();
    this.pickerListEl.append(cancel);

    this.pickerEl.style.display = 'block';
  }

  private hidePicker(): void {
    this.pendingItem = undefined;
    this.pickerEl.style.display = 'none';
    this.pickerListEl.replaceChildren();
  }
}

export function inventoryFromPlayerState(
  inventory: Array<{ item?: ItemTypeValue | null; count?: unknown }> | null | undefined,
): Array<{ item?: ItemTypeValue | null; count?: number | null }> {
  if (!inventory) {
    return [];
  }
  return inventory.map((entry) => ({
    item: entry.item ?? null,
    count: toNum(entry.count),
  }));
}
