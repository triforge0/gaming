import type { CatalogEntry, LobbyStatus } from './types';

export function pickFeatured(
  entries: CatalogEntry[],
  status: LobbyStatus,
): CatalogEntry | undefined {
  const games = entries.filter((e) => e.category === 'game' && !e.comingSoon);
  if (games.length === 0) {
    return undefined;
  }

  let best = games[0];
  let bestPlayers = 0;
  for (const game of games) {
    const players = game.pluginId ? (status.byPlugin[game.pluginId]?.players ?? 0) : 0;
    if (players > bestPlayers) {
      best = game;
      bestPlayers = players;
    }
  }
  return best;
}
