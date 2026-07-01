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
