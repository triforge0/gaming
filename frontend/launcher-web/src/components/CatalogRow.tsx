import type { CatalogEntry, LobbyStatus } from '../catalog/types';
import { GameCard } from './GameCard';

export function CatalogRow({
  title,
  entries,
  status,
}: {
  title: string;
  entries: CatalogEntry[];
  status: LobbyStatus;
}) {
  if (entries.length === 0) {
    return null;
  }
  return (
    <section className="catalog-row">
      <h2 className="row-title">{title}</h2>
      <div className="cards-grid">
        {entries.map((entry) => (
          <GameCard
            key={entry.id}
            entry={entry}
            stats={entry.pluginId ? status.byPlugin[entry.pluginId] : undefined}
          />
        ))}
      </div>
    </section>
  );
}
