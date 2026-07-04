import { useEffect } from 'react';
import { GameCanvas } from './scene/GameCanvas';
import { useGame } from './state/store';
import { Hud } from './ui/Hud';
import { MenuScreen } from './ui/MenuScreen';

export function App() {
  const boot = useGame((s) => s.boot);
  const tick = useGame((s) => s.tick);

  useEffect(() => { boot(); }, [boot]);

  useEffect(() => {
    const timer = setInterval(() => tick(1000), 1000);
    return () => clearInterval(timer);
  }, [tick]);

  return (
    <div className="app-root">
      <GameCanvas />
      <Hud />
      <MenuScreen />
    </div>
  );
}
