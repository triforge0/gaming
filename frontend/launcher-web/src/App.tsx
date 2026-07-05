import { useState, useEffect } from 'react';
import { REGISTRY } from './catalog/registry';
import { pickFeatured } from './catalog/featured';
import { useLobbyStatus } from './live/useLobbyStatus';
import { TopNav } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { CatalogRow } from './components/CatalogRow';
import { IframePlayer } from './components/IframePlayer';

export default function App() {
  const [playId, setPlayId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('play');
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setPlayId(params.get('play'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleClosePlayer = () => {
    window.history.pushState({}, '', '/');
    setPlayId(null);
  };

  const status = useLobbyStatus();
  const featured = pickFeatured(REGISTRY, status);
  const games = REGISTRY.filter((e) => e.category === 'game');
  const miniApps = REGISTRY.filter((e) => e.category !== 'game');

  if (playId) {
    const game = REGISTRY.find((e) => e.id === playId);
    if (game && game.isHtmlEmbed) {
      return <IframePlayer entry={game} onClose={handleClosePlayer} />;
    }
  }

  return (
    <div className="shell">
      <TopNav status={status} />
      <main>
        {featured && (
          <HeroBanner
            entry={featured}
            stats={featured.pluginId ? status.byPlugin[featured.pluginId] : undefined}
          />
        )}
        <CatalogRow title="GAMES" entries={games} status={status} />
        <CatalogRow title="MINI APPS" entries={miniApps} status={status} />
      </main>
      <footer className="site-footer">
        <p>Made with ❤️ just for fun, chill &amp; AI vibes by the HCM team.</p>
      </footer>
    </div>
  );
}
