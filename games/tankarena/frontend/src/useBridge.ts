import { useEffect, useState } from 'react';
import { GameBridge, UiState } from './net/GameBridge';

/** Subscribes a component to the bridge's UI state, re-rendering only on UI changes. */
export function useUiState(bridge: GameBridge | null): UiState | null {
  const [state, setState] = useState<UiState | null>(bridge ? bridge.snapshotUi() : null);

  useEffect(() => {
    if (!bridge) {
      setState(null);
      return;
    }
    return bridge.subscribe(setState);
  }, [bridge]);

  return state;
}
