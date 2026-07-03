import { useEffect, useRef, useState } from 'react';
import { OFFLINE_STATUS, type LobbyStatus } from '../catalog/types';
import { fetchRooms } from './api';
import { toLobbyStatus } from './status';

export function useLobbyStatus(pollMs = 5000): LobbyStatus {
  const [status, setStatus] = useState<LobbyStatus>(OFFLINE_STATUS);
  const wasOnline = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (document.visibilityState === 'hidden') {
        return;
      }
      try {
        const rooms = await fetchRooms();
        if (!cancelled) {
          setStatus(toLobbyStatus(rooms));
          wasOnline.current = true;
        }
      } catch {
        if (!cancelled) {
          if (wasOnline.current) {
            console.warn('Lobby API unreachable — switching to offline mode');
            wasOnline.current = false;
          }
          setStatus(OFFLINE_STATUS);
        }
      }
    }

    poll();
    const timer = setInterval(poll, pollMs);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        poll();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [pollMs]);

  return status;
}
