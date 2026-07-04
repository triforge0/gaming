// src/scene/CubeRig.tsx
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import { CELL_COUNT } from '../core/topology';
import type { SkinPreset } from '../skins';
import { CellMesh } from './CellMesh';
import { createNumberAtlas } from './numberAtlas';

const IDLE_SPEED = (2 * Math.PI) / 60; // 360°/60s theo spec

export function CubeRig({ skin, idle }: { skin: SkinPreset; idle: boolean }) {
  const rig = useRef<Group>(null);
  const [atlas, setAtlas] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const tex = createNumberAtlas({
      given: skin.givenText, player: skin.playerText, correct: skin.correct, wrong: skin.wrong,
    });
    setAtlas(tex);
    return () => tex.dispose();
  }, [skin]);

  useFrame((_, delta) => {
    if (idle && rig.current) rig.current.rotation.y += IDLE_SPEED * delta;
  });

  return (
    <group ref={rig}>
      {/* lõi đặc để khe giữa các ô không nhìn xuyên */}
      <mesh>
        <boxGeometry args={[3.96, 3.96, 3.96]} />
        <meshStandardMaterial color={skin.coreColor} roughness={0.8} />
      </mesh>
      {atlas && Array.from({ length: CELL_COUNT }, (_, i) => (
        <CellMesh key={i} index={i} skin={skin} atlas={atlas} />
      ))}
    </group>
  );
}
