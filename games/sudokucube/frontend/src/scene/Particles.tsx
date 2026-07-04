import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { cellAt } from '../core/topology';
import { useGame } from '../state/store';
import type { SkinPreset } from '../skins';
import { cellWorldPosition, FACE_NORMAL } from './layout';

const COUNT = 1200;
const LIFE = 2.5; // giây

const CONFETTI_COLORS = [
  new THREE.Color('#ef4444'), // red
  new THREE.Color('#f59e0b'), // orange
  new THREE.Color('#10b981'), // green
  new THREE.Color('#3b82f6'), // blue
  new THREE.Color('#8b5cf6'), // purple
  new THREE.Color('#ec4899'), // pink
  new THREE.Color('#facc15'), // yellow
];

export function Particles({ skin }: { skin: SkinPreset }) {
  const points = useRef<THREE.Points>(null);
  const data = useMemo(() => ({
    positions: new Float32Array(COUNT * 3).fill(-100),
    velocities: new Float32Array(COUNT * 3),
    colors: new Float32Array(COUNT * 3),
    life: new Float32Array(COUNT).fill(0),
    cursor: 0,
  }), []);

  useEffect(() => useGame.subscribe((s, prev) => {
    // 1. Hiệu ứng nhỏ khi điền đúng số
    const fx = s.cellFx;
    if (fx && fx !== prev.cellFx && fx.kind !== 'wrong') {
      const { face, row, col } = cellAt(fx.index);
      const [x, y, z] = cellWorldPosition(face, row, col);
      const color = new THREE.Color(skin.particle);
      for (let k = 0; k < 12; k++) {
        const i = data.cursor = (data.cursor + 1) % COUNT;
        data.positions.set([x, y, z], i * 3);
        data.velocities.set([
          (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4 + 1.5, (Math.random() - 0.5) * 4,
        ], i * 3);
        data.colors.set([color.r, color.g, color.b], i * 3);
        data.life[i] = LIFE * 0.4;
      }
    }

    // 2. Hiệu ứng Confetti khi hoàn thành 1 mặt
    const newLocked = s.lockedFaces.filter(f => !prev.lockedFaces.includes(f));
    for (const face of newLocked) {
      const n = FACE_NORMAL[face];
      // Bắn ra từ trung tâm mặt đó
      const cx = n[0] * 2.2, cy = n[1] * 2.2, cz = n[2] * 2.2;
      for (let k = 0; k < 150; k++) {
        const i = data.cursor = (data.cursor + 1) % COUNT;
        // Xuất hiện rải rác quanh mặt
        data.positions.set([cx + (Math.random()-0.5)*3, cy + (Math.random()-0.5)*3, cz + (Math.random()-0.5)*3], i * 3);
        
        // Vận tốc văng ra theo chiều normal và hơi hất lên trên
        const vx = n[0] * 6 + (Math.random() - 0.5) * 10;
        const vy = n[1] * 6 + (Math.random() - 0.5) * 10 + 4; // hất lên trên 1 chút
        const vz = n[2] * 6 + (Math.random() - 0.5) * 10;
        data.velocities.set([vx, vy, vz], i * 3);
        
        // Màu ngẫu nhiên rực rỡ
        const c = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        data.colors.set([c.r, c.g, c.b], i * 3);
        data.life[i] = LIFE + Math.random() * 0.5;
      }
    }
  }), [data, skin.particle]);

  useFrame((_, dt) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    for (let i = 0; i < COUNT; i++) {
      if (data.life[i] <= 0) continue;
      data.life[i] -= dt;
      
      // Trọng lực kéo hạt rơi xuống
      data.velocities[i * 3 + 1] -= dt * 12;
      
      // Lực cản không khí
      data.velocities[i * 3 + 0] *= Math.pow(0.5, dt);
      data.velocities[i * 3 + 2] *= Math.pow(0.5, dt);

      for (let a = 0; a < 3; a++) data.positions[i * 3 + a] += data.velocities[i * 3 + a] * dt;
      
      if (data.life[i] <= 0) data.positions.set([0, -100, 0], i * 3); // giấu hạt chết
    }
    geo.attributes.position.needsUpdate = true;
    if (geo.attributes.color) geo.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.9} />
    </points>
  );
}
