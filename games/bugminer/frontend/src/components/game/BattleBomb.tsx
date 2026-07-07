import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BombProjectileState } from '../../shared';
import { gameYToWorldY } from '../../constants/scene';

interface Props {
  bombs: BombProjectileState[];
}

function BombMesh({ bomb }: { bomb: BombProjectileState }) {
  const ref = useRef<THREE.Group>(null);
  const dir = bomb.velocity.x >= 0 ? 1 : -1;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 16;
    ref.current.rotation.z = clock.elapsedTime * 12;
  });

  const x = bomb.position.x;
  const y = gameYToWorldY(bomb.position.y);

  return (
    <group ref={ref} position={[x, y, 15]}>
      <pointLight color="#f4d06f" intensity={2.2} distance={140} decay={2} />
      <mesh rotation={[0, 0, dir * 0.22]}>
        <boxGeometry args={[64, 26, 12]} />
        <meshStandardMaterial
          color="#f4d06f"
          emissive="#8d6e63"
          emissiveIntensity={0.35}
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[10, 10, 7]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[22, 8, 4]} />
        <meshStandardMaterial color="#a1887f" roughness={0.7} metalness={0.03} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[dir * -(i + 1) * 24, (i + 1) * 5, -6 - i * 2]}
        >
          <sphereGeometry args={[8 - i * 1.3, 8, 8]} />
          <meshBasicMaterial
            color={i < 2 ? '#ffe082' : '#bcaaa4'}
            transparent
            opacity={0.72 - i * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function BattleBomb({ bombs }: Props) {
  if (!bombs.length) return null;

  return (
    <group>
      {bombs.map((bomb) => (
        <BombMesh key={bomb.id} bomb={bomb} />
      ))}
    </group>
  );
}
