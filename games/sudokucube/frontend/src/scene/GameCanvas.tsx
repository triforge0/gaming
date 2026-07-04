// src/scene/GameCanvas.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/store';
import { SKINS } from '../skins';
import { CubeRig } from './CubeRig';
import { Effects } from './Effects';
import { Particles } from './Particles';

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const IDLE_DELAY_MS = 5000;

export function GameCanvas({ onReady }: { onReady?: (resetCamera: () => void) => void }) {
  const skinId = useGame((s) => s.persisted.skins.selected);
  const status = useGame((s) => s.status);
  const select = useGame((s) => s.select);
  const skin = SKINS[skinId];
  const [idle, setIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    onReady?.(() => controls.current?.reset());
  }, [onReady]);

  function poke() {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_DELAY_MS);
  }

  useEffect(() => () => { if (idleTimer.current) clearTimeout(idleTimer.current); }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [6, 5, 7], fov: 40 }}
      style={{ background: skin.background }}
      onPointerDown={poke}
      onPointerMissed={() => select(null)}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} color={skin.lightTints[0]} intensity={40} />
      <pointLight position={[-6, 6, -6]} color={skin.lightTints[1]} intensity={40} />
      <pointLight position={[-6, -6, 6]} color={skin.lightTints[2]} intensity={40} />
      <pointLight position={[6, -6, -6]} color={skin.lightTints[3]} intensity={40} />
      <directionalLight position={[4, 10, 4]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
      <CubeRig skin={skin} idle={idle && status === 'playing'} />
      <Particles skin={skin} />
      <Effects />
      <OrbitControls ref={controls} enablePan={false} minDistance={6} maxDistance={14} enableDamping onStart={poke} />
    </Canvas>
  );
}
