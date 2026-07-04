import { REGISTRY } from './catalog/registry';
import { pickFeatured } from './catalog/featured';
import { useLobbyStatus } from './live/useLobbyStatus';
import { TopNav } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { CatalogRow } from './components/CatalogRow';

export default function App() {
  const status = useLobbyStatus();
  const featured = pickFeatured(REGISTRY, status);
  const games = REGISTRY.filter((e) => e.category === 'game');
  const miniApps = REGISTRY.filter((e) => e.category !== 'game');

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
