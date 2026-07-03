import { describe, it, expect } from 'vitest';
import { toLobbyStatus } from './status';

describe('toLobbyStatus', () => {
  it('gộp phòng và người chơi theo gamePluginId', () => {
    const status = toLobbyStatus({
      rooms: [
        { gamePluginId: 'tankarena', playerCount: 3 },
        { gamePluginId: 'tankarena', playerCount: 2 },
        { gamePluginId: 'demo', playerCount: 1 },
      ],
    });
    expect(status.online).toBe(true);
    expect(status.totalPlayers).toBe(6);
    expect(status.byPlugin['tankarena']).toEqual({ rooms: 2, players: 5 });
    expect(status.byPlugin['demo']).toEqual({ rooms: 1, players: 1 });
  });

  it('chịu được response thiếu field (defensive parse, không throw)', () => {
    expect(toLobbyStatus({})).toEqual({ online: true, totalPlayers: 0, byPlugin: {} });
    expect(toLobbyStatus({ rooms: [{}] })).toEqual({ online: true, totalPlayers: 0, byPlugin: {} });
    expect(toLobbyStatus({ rooms: [{ gamePluginId: 'x' }] }).byPlugin['x']).toEqual({ rooms: 1, players: 0 });
  });

  it('phòng 0 người vẫn được đếm là phòng', () => {
    const status = toLobbyStatus({ rooms: [{ gamePluginId: 'x', playerCount: 0 }] });
    expect(status.byPlugin['x']).toEqual({ rooms: 1, players: 0 });
    expect(status.totalPlayers).toBe(0);
  });
});
