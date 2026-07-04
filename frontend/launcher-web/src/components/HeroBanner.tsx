import type { CSSProperties } from 'react';
import type { CatalogEntry, PluginLiveStats } from '../catalog/types';
import { LiveBadge } from './LiveBadge';
import { trackEvent } from '../lib/mixpanel';

export function HeroBanner({ entry, stats }: { entry: CatalogEntry; stats?: PluginLiveStats }) {
  const Art = entry.Art;

  const handlePlayClick = () => {
    trackEvent('Game Clicked', {
      gameId: entry.id,
      gameTitle: entry.title,
      category: entry.category,
      path: entry.path,
      source: 'hero',
    }, { transport: 'sendBeacon' });
  };

  return (
    <section className="hero" style={{ '--accent': entry.accent } as CSSProperties}>
      <div className="hero-art" aria-hidden="true">
        <Art />
      </div>
      <div className="hero-info">
        <h2 className="hero-title">{entry.title}</h2>
        <p className="hero-desc">{entry.description}</p>
        <div className="hero-actions">
          <a
            className="hero-play"
            href={entry.path}
            aria-label={`Chơi ${entry.title}`}
            onClick={handlePlayClick}
          >
            ▶ CHƠI NGAY
          </a>
          <LiveBadge stats={stats} />
        </div>
      </div>
    </section>
  );
}
