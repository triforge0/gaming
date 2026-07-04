// src/scene/GameCanvas.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGame } from '../state/store';
import { SKINS } from '../skins';
import { CubeRig } from './CubeRig';
import { Effects } from './Effects';
import { Particles } from './Particles';

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function GameCanvas({ onReady }: { onReady?: (resetCamera: () => void) => void }) {
  const skinId = useGame((s) => s.persisted.skins.selected);
  const status = useGame((s) => s.status);
  const select = useGame((s) => s.select);
  const skin = SKINS[skinId];
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    onReady?.(() => controls.current?.reset());
  }, [onReady]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!controls.current || document.activeElement?.tagName === 'INPUT') return;
      const c = controls.current;
      const cam = c.object;
      const target = c.target;
      let handled = true;

      const offset = cam.position.clone().sub(target);
      const rightAxis = new THREE.Vector3(0, 1, 0).cross(offset).normalize();

      switch (e.key.toLowerCase()) {
        case 'w': offset.applyAxisAngle(rightAxis, -0.2); break;
        case 's': offset.applyAxisAngle(rightAxis, 0.2); break;
        case 'a': offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.2); break;
        case 'd': offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.2); break;
        case '+': case '=':
          if (offset.length() > c.minDistance) offset.multiplyScalar(0.9);
          break;
        case '-': case '_':
          if (offset.length() < c.maxDistance) offset.multiplyScalar(1.1);
          break;
        default: handled = false;
      }

      if (handled) {
        e.preventDefault();
        cam.position.copy(target).add(offset);
        c.update();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [6, 5, 7], fov: 40 }}
      style={{ background: skin.background }}
      onPointerMissed={() => select(null)}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} color={skin.lightTints[0]} intensity={40} />
      <pointLight position={[-6, 6, -6]} color={skin.lightTints[1]} intensity={40} />
      <pointLight position={[-6, -6, 6]} color={skin.lightTints[2]} intensity={40} />
      <pointLight position={[6, -6, -6]} color={skin.lightTints[3]} intensity={40} />
      <directionalLight position={[4, 10, 4]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
      <CubeRig skin={skin} idle={status === 'menu'} />
      <Particles skin={skin} />
      <Effects />
      <OrbitControls ref={controls} enablePan={false} minDistance={6} maxDistance={14} enableDamping rotateSpeed={0.7} />
    </Canvas>
  );
}
