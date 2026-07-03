import type { LobbyStatus } from '../catalog/types';

export function TopNav({ status }: { status: LobbyStatus }) {
  return (
    <nav className="top-nav">
      <span className="logo">▲ TRIFORGE</span>
      <span className={status.online ? 'status-pill is-online' : 'status-pill'}>
        {status.online ? `● ${status.totalPlayers} người đang chơi` : '○ offline'}
      </span>
    </nav>
  );
}
