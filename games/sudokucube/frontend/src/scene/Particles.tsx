import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { cellAt } from '../core/topology';
import { useGame } from '../state/store';
import type { SkinPreset } from '../skins';
import { cellWorldPosition } from './layout';

const COUNT = 200;
const LIFE = 0.8; // giây

export function Particles({ skin }: { skin: SkinPreset }) {
  const points = useRef<THREE.Points>(null);
  const data = useMemo(() => ({
    positions: new Float32Array(COUNT * 3),
    velocities: new Float32Array(COUNT * 3),
    life: new Float32Array(COUNT).fill(0),
    cursor: 0,
  }), []);

  useEffect(() => useGame.subscribe((s, prev) => {
    const fx = s.cellFx;
    if (!fx || fx === prev.cellFx || fx.kind === 'wrong') return;
    const { face, row, col } = cellAt(fx.index);
    const [x, y, z] = cellWorldPosition(face, row, col);
    for (let k = 0; k < 12; k++) {
      const i = data.cursor = (data.cursor + 1) % COUNT;
      data.positions.set([x, y, z], i * 3);
      data.velocities.set([
        (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3,
      ], i * 3);
      data.life[i] = LIFE;
    }
  }), [data]);

  useFrame((_, dt) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    for (let i = 0; i < COUNT; i++) {
      if (data.life[i] <= 0) continue;
      data.life[i] -= dt;
      for (let a = 0; a < 3; a++) data.positions[i * 3 + a] += data.velocities[i * 3 + a] * dt;
      if (data.life[i] <= 0) data.positions.set([0, -100, 0], i * 3); // giấu hạt chết
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={skin.particle} transparent opacity={0.9} />
    </points>
  );
}
