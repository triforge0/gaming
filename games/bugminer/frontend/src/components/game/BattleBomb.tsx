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
      <pointLight color="#ff5722" intensity={3.5} distance={160} decay={2} />
      <mesh>
        <sphereGeometry args={[24, 14, 14]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#ff3d00"
          emissiveIntensity={1.4}
          roughness={0.25}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[dir * -10, 0, -6]} rotation={[0, 0, dir * Math.PI * 0.5]}>
        <coneGeometry args={[10, 26, 10]} />
        <meshStandardMaterial color="#222" emissive="#ff9800" emissiveIntensity={1} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[dir * -(i + 1) * 22, (i + 1) * 6, -4 - i * 2]}
        >
          <sphereGeometry args={[9 - i * 1.5, 8, 8]} />
          <meshBasicMaterial
            color={i < 2 ? '#ff9800' : '#ff5722'}
            transparent
            opacity={0.75 - i * 0.15}
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
