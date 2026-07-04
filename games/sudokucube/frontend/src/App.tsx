import { useCallback, useEffect, useRef } from 'react';
import { GameCanvas } from './scene/GameCanvas';
import { useGame } from './state/store';
import { Hud } from './ui/Hud';
import { MenuScreen } from './ui/MenuScreen';
import { PauseOverlay } from './ui/PauseOverlay';
import { useKeyboard } from './ui/useKeyboard';
import { useState } from 'react';
import { startPresenceHeartbeat } from './presence';
import { WinModal } from './ui/WinModal';
import { Toasts } from './ui/Toasts';
import { Drawer } from './ui/Drawer';

export function App() {
  const boot = useGame((s) => s.boot);
  const tick = useGame((s) => s.tick);
  const resetCameraRef = useRef<() => void>(() => {});
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { boot(); }, [boot]);

  useEffect(() => {
    const stop = startPresenceHeartbeat();
    return stop;
  }, []);

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
      <Hud onOpenDrawer={() => setDrawerOpen(true)} />
      <MenuScreen />
      <PauseOverlay />
      <WinModal />
      <Toasts />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
