import type { CSSProperties } from 'react';
import type { CatalogEntry, Category, PluginLiveStats } from '../catalog/types';
import { LiveBadge } from './LiveBadge';
import { trackEvent } from '../lib/mixpanel';

export const CATEGORY_LABELS: Record<Category, string> = {
  game: 'Game',
  utility: 'Tiện ích',
  education: 'Học tập',
  arcade: 'Arcade',
};

export function GameCard({ entry, stats }: { entry: CatalogEntry; stats?: PluginLiveStats }) {
  const Art = entry.Art;
  const style = { '--accent': entry.accent } as CSSProperties;

  const handlePlayClick = () => {
    trackEvent('Game Clicked', {
      gameId: entry.id,
      gameTitle: entry.title,
      category: entry.category,
      path: entry.path,
      source: 'card',
    }, { transport: 'sendBeacon' });
  };

  const body = (
    <>
      <div className="card-art">
        <Art />
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <span className="card-title">{entry.title}</span>
          <span className="tag">{CATEGORY_LABELS[entry.category]}</span>
        </div>
        <p className="card-desc">{entry.description}</p>
        {entry.comingSoon ? (
          <span className="coming-soon">Sắp ra mắt</span>
        ) : (
          <LiveBadge stats={stats} />
        )}
      </div>
    </>
  );

  if (entry.comingSoon) {
    return (
      <div className="game-card is-coming-soon" style={style}>
        {body}
      </div>
    );
  }
  return (
    <a className="game-card" href={entry.path} style={style} onClick={handlePlayClick}>
      {body}
    </a>
  );
}
