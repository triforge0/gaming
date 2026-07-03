import { describe, it, expect } from 'vitest';
import { pickFeatured } from './featured';
import { OFFLINE_STATUS, type CatalogEntry, type LobbyStatus } from './types';

const NullArt = () => null;

function mk(over: Partial<CatalogEntry>): CatalogEntry {
  return {
    id: 'x',
    title: 'X',
    description: '',
    category: 'game',
    path: '/x/',
    accent: '#fff',
    Art: NullArt,
    ...over,
  };
}

function status(byPlugin: LobbyStatus['byPlugin']): LobbyStatus {
  return { online: true, totalPlayers: 0, byPlugin };
}

describe('pickFeatured', () => {
  const tank = mk({ id: 'tankarena', pluginId: 'tankarena' });
  const quest = mk({ id: 'treasurequest', pluginId: 'treasurequest' });

  it('chọn game có nhiều người chơi nhất', () => {
    const s = status({
      tankarena: { rooms: 1, players: 2 },
      treasurequest: { rooms: 1, players: 5 },
    });
    expect(pickFeatured([tank, quest], s)?.id).toBe('treasurequest');
  });

  it('offline hoặc không ai chơi → game đầu tiên', () => {
    expect(pickFeatured([tank, quest], OFFLINE_STATUS)?.id).toBe('tankarena');
  });

  it('hoà → giữ game đầu tiên (ổn định, không nhấp nháy hero)', () => {
    const s = status({
      tankarena: { rooms: 1, players: 3 },
      treasurequest: { rooms: 1, players: 3 },
    });
    expect(pickFeatured([tank, quest], s)?.id).toBe('tankarena');
  });

  it('bỏ qua mini apps và entry comingSoon', () => {
    const app = mk({ id: 'scoreboard', category: 'utility' });
    const soon = mk({ id: 'soon', comingSoon: true });
    expect(pickFeatured([app, soon, quest], OFFLINE_STATUS)?.id).toBe('treasurequest');
    expect(pickFeatured([app, soon], OFFLINE_STATUS)).toBeUndefined();
  });
});
