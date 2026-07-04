import { useCallback, useEffect, useRef } from 'react';
import { GameCanvas } from './scene/GameCanvas';
import { useGame } from './state/store';
import { Hud } from './ui/Hud';
import { MenuScreen } from './ui/MenuScreen';
import { PauseOverlay } from './ui/PauseOverlay';
import { useKeyboard } from './ui/useKeyboard';

export function App() {
  const boot = useGame((s) => s.boot);
  const tick = useGame((s) => s.tick);
  const resetCameraRef = useRef<() => void>(() => {});

  useEffect(() => { boot(); }, [boot]);

  // tick theo đồng hồ thật để không lệch khi tab throttle
  useEffect(() => {
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      tick(now - last);
      last = now;
    }, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  useKeyboard(useCallback(() => resetCameraRef.current(), []));

  return (
    <div className="app-root">
      <GameCanvas onReady={(fn) => { resetCameraRef.current = fn; }} />
      <Hud />
      <MenuScreen />
      <PauseOverlay />
    </div>
  );
}
