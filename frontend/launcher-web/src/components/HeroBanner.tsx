import type { CSSProperties } from 'react';
import type { CatalogEntry, PluginLiveStats } from '../catalog/types';
import { LiveBadge } from './LiveBadge';

export function HeroBanner({ entry, stats }: { entry: CatalogEntry; stats?: PluginLiveStats }) {
  const Art = entry.Art;
  return (
    <section className="hero" style={{ '--accent': entry.accent } as CSSProperties}>
      <div className="hero-art" aria-hidden="true">
        <Art />
      </div>
      <div className="hero-info">
        <h2 className="hero-title">{entry.title}</h2>
        <p className="hero-desc">{entry.description}</p>
        <div className="hero-actions">
          <a className="hero-play" href={entry.path} aria-label={`Chơi ${entry.title}`}>▶ CHƠI NGAY</a>
          <LiveBadge stats={stats} />
        </div>
      </div>
    </section>
  );
}
