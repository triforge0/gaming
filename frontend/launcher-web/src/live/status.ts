import type { LobbyStatus, PluginLiveStats } from '../catalog/types';
import type { RoomsResponseDto } from './api';

export function toLobbyStatus(rooms: RoomsResponseDto): LobbyStatus {
  const byPlugin: Record<string, PluginLiveStats> = {};
  let totalPlayers = 0;

  for (const room of rooms.rooms ?? []) {
    const pluginId = room.gamePluginId;
    if (!pluginId) {
      continue;
    }
    const players = typeof room.playerCount === 'number' ? room.playerCount : 0;
    const stats = byPlugin[pluginId] ?? { rooms: 0, players: 0 };
    stats.rooms += 1;
    stats.players += players;
    byPlugin[pluginId] = stats;
    totalPlayers += players;
  }

  return { online: true, totalPlayers, byPlugin };
}
