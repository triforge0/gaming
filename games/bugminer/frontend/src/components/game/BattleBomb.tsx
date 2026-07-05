import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BombProjectileState } from '../../shared';
import { gameYToWorldY } from '../../constants/scene';

interface Props {
  bombs: BombProjectileState[];
}

function BombMesh({ bomb }: { bomb: BombProjectileState }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 8;
    ref.current.rotation.z = clock.elapsedTime * 6;
  });

  const x = bomb.position.x;
  const y = gameYToWorldY(bomb.position.y);

  return (
    <mesh ref={ref} position={[x, y, 15]}>
      <sphereGeometry args={[14, 10, 10]} />
      <meshStandardMaterial color="#1a1a1a" emissive="#ff5722" emissiveIntensity={0.6} roughness={0.4} />
    </mesh>
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
