import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { getLevelById } from '../../shared';
import type { BattleArenaState } from '../../shared';
import BattleMineWorld from './BattleMineWorld';
import SceneCamera from './SceneCamera';

interface Props {
  battle: BattleArenaState;
  phase: string;
}

export default function BattleMineScene({ battle, phase }: Props) {
  const level = getLevelById(battle.levelId);

  return (
    <Canvas
      camera={{ fov: 48, near: 1, far: 2500 }}
      style={{ width: '100%', height: '100%', display: 'block', background: '#5c4730' }}
      shadows
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#5c4730');
      }}
    >
      <SceneCamera />
      <Suspense fallback={null}>
        <BattleMineWorld
          theme={level.theme}
          items={battle.items}
          hookA={battle.hookA}
          hookB={battle.hookB}
          bombs={battle.bombs}
          phase={phase}
        />
      </Suspense>
    </Canvas>
  );
}
