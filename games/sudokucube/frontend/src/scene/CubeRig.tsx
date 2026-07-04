// src/scene/CubeRig.tsx
import { animated, useSprings } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Group } from 'three';
import { FACES, cellIndex } from '../core/topology';
import { useGame } from '../state/store';
import type { SkinPreset } from '../skins';
import { CellMesh } from './CellMesh';
import { FACE_NORMAL } from './layout';
import { createNumberAtlas } from './numberAtlas';
import { useReducedMotion } from './useReducedMotion';

const IDLE_SPEED = (2 * Math.PI) / 60;

/** Vị trí 6 mặt xếp thành vòng sao quanh tâm khi thắng. */
const STAR_POS: Array<[number, number, number]> = FACES.map((_, i) => {
  const a = (i / 6) * Math.PI * 2;
  return [Math.cos(a) * 3.2, Math.sin(a) * 3.2, 0];
});

export function CubeRig({ skin, idle }: { skin: SkinPreset; idle: boolean }) {
  const rig = useRef<Group>(null);
  const won = useGame((s) => s.status === 'won');
  const reduced = useReducedMotion();
  const atlas = useMemo(
    () => createNumberAtlas({
      given: skin.givenText, player: skin.playerText, correct: skin.correct, wrong: skin.wrong,
    }),
    [skin],
  );

  useEffect(() => {
    return () => atlas.dispose();
  }, [atlas]);

  const [springs, api] = useSprings(6, () => ({
    px: 0, py: 0, pz: 0, rz: 0, config: { tension: 60, friction: 18 },
  }));

  useEffect(() => {
    if (!won || reduced) {
      api.stop();
      api.start(() => ({ px: 0, py: 0, pz: 0, rz: 0, immediate: true }));
      return;
    }
    // giai đoạn 1: bay ra theo pháp tuyến; giai đoạn 2: xếp sao
    api.start((i) => ({
      to: [
        {
          px: FACE_NORMAL[FACES[i]][0] * 4,
          py: FACE_NORMAL[FACES[i]][1] * 4,
          pz: FACE_NORMAL[FACES[i]][2] * 4,
          rz: Math.PI,
        },
        { px: STAR_POS[i][0], py: STAR_POS[i][1], pz: STAR_POS[i][2], rz: Math.PI * 2 },
      ],
    }));
  }, [won, reduced, api]);

  useFrame((_, delta) => {
    if (idle && !won && rig.current) rig.current.rotation.y += IDLE_SPEED * delta;
  });

  return (
    <group ref={rig}>
      {!won && (
        <mesh>
          <boxGeometry args={[3.96, 3.96, 3.96]} />
          <meshStandardMaterial color={skin.coreColor} roughness={0.8} />
        </mesh>
      )}
      {FACES.map((face, fi) => (
        <animated.group
          key={face}
          position-x={springs[fi].px}
          position-y={springs[fi].py}
          position-z={springs[fi].pz}
          rotation-z={springs[fi].rz}
        >
          {Array.from({ length: 16 }, (_, k) => {
            const i = cellIndex(face, Math.floor(k / 4), k % 4);
            return <CellMesh key={i} index={i} skin={skin} atlas={atlas} />;
          })}
        </animated.group>
      ))}
    </group>
  );
}
