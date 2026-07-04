import { useSyncExternalStore } from 'react';
import { useGame } from '../state/store';

const query = window.matchMedia('(prefers-reduced-motion: reduce)');

function subscribe(cb: () => void) {
  query.addEventListener('change', cb);
  return () => query.removeEventListener('change', cb);
}

export function useReducedMotion(): boolean {
  const system = useSyncExternalStore(subscribe, () => query.matches);
  const setting = useGame((s) => s.persisted.settings.reducedMotion);
  return setting === 'on' || (setting === 'auto' && system);
}
