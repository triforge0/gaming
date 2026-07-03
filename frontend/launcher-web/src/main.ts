interface GameEntry {
  id: string;
  title: string;
  description: string;
  path: string;
}

const GAMES: GameEntry[] = [
  {
    id: 'tankarena',
    title: 'Tank Arena',
    description: 'LAN Battle City — 4–16 players, authoritative host.',
    path: '/games/tankarena/',
  },
  {
    id: 'treasurequest',
    title: 'Treasure Quest',
    description: 'Educational expedition — quiz checkpoints, branching paths, shared treasure.',
    path: '/games/treasurequest/',
  },
  {
    id: 'oanquan',
    title: 'Ô ăn quan',
    description: 'Vietnamese mancala — 2-player turn-based board game on a 3D board.',
    path: '/games/oanquan/',
  },
];

function renderGames(): void {
  const container = document.getElementById('games');
  if (!container) {
    return;
  }

  container.replaceChildren(
    ...GAMES.map((game) => {
      const link = document.createElement('a');
      link.className = 'game-card';
      link.href = game.path;
      link.innerHTML = `<h2>${game.title}</h2><p>${game.description}</p>`;
      return link;
    }),
  );
}

renderGames();
