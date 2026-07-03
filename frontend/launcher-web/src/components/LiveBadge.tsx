import type { PluginLiveStats } from '../catalog/types';

export function LiveBadge({ stats }: { stats?: PluginLiveStats }) {
  if (!stats || stats.rooms === 0) {
    return null;
  }
  return (
    <span className="live-badge">
      ● {stats.rooms} phòng · {stats.players} người
    </span>
  );
}
