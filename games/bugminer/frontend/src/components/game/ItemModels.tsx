import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { ItemType } from '../../shared';
import type { ItemDefinition } from '../../shared';

interface ModelProps {
  def: ItemDefinition;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

export function GoldCoinModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  return (
    <group onPointerDown={onPointerDown}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, r * 0.28, 24]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFB300" emissiveIntensity={0.35} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, r * 0.14]}>
        <torusGeometry args={[r * 0.72, r * 0.1, 8, 24]} />
        <meshStandardMaterial color="#FFA500" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, r * 0.16, 0]}>
        <cylinderGeometry args={[r * 0.35, r * 0.35, r * 0.06, 6]} />
        <meshStandardMaterial color="#FFE566" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function BigGoldModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  return (
    <group onPointerDown={onPointerDown}>
      <mesh castShadow position={[0, 0, 0]}>
        <dodecahedronGeometry args={[r * 0.85, 0]} />
        <meshStandardMaterial color="#FFA500" emissive="#FF8C00" emissiveIntensity={0.4} metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[r * 0.55, r * 0.2, r * 0.15]}>
        <icosahedronGeometry args={[r * 0.45, 0]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFB300" emissiveIntensity={0.35} metalness={0.8} />
      </mesh>
      <mesh castShadow position={[-r * 0.45, -r * 0.15, -r * 0.1]}>
        <icosahedronGeometry args={[r * 0.38, 0]} />
        <meshStandardMaterial color="#FFC125" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function DiamondModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  return (
    <group onPointerDown={onPointerDown}>
      <mesh castShadow>
        <octahedronGeometry args={[r, 0]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00CED1" emissiveIntensity={0.75} metalness={0.95} roughness={0.05} transparent opacity={0.95} />
      </mesh>
      <mesh scale={0.55} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[r, 0]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function RockModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  return (
    <group onPointerDown={onPointerDown}>
      <mesh castShadow>
        <dodecahedronGeometry args={[r, 0]} />
        <meshStandardMaterial color="#6b6b6b" roughness={0.98} metalness={0.05} />
      </mesh>
      <mesh position={[r * 0.35, r * 0.2, r * 0.25]}>
        <dodecahedronGeometry args={[r * 0.35, 0]} />
        <meshStandardMaterial color="#808080" roughness={1} />
      </mesh>
    </group>
  );
}

export function MysteryBagModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  return (
    <group onPointerDown={onPointerDown}>
      <mesh castShadow position={[0, -r * 0.1, 0]}>
        <boxGeometry args={[r * 1.5, r * 1.2, r * 0.9]} />
        <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0, r * 0.55, 0]}>
        <sphereGeometry args={[r * 0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FF85C1" roughness={0.7} />
      </mesh>
      <mesh position={[0, r * 0.75, r * 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[r * 0.9, r * 0.18, r * 0.35]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} />
      </mesh>
      <mesh position={[0, r * 0.15, r * 0.5]}>
        <sphereGeometry args={[r * 0.22, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#ffffaa" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export function MouseTrapModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  const springRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (springRef.current) {
      springRef.current.rotation.z = -0.45 + Math.sin(t * 6) * 0.06;
    }
    if (mouseRef.current) {
      mouseRef.current.position.x = -r * 0.42 + Math.sin(t * 3) * 1.5;
      mouseRef.current.rotation.y = Math.sin(t * 2) * 0.15;
    }
  });

  const w = r * 1.5;

  return (
    <group onPointerDown={onPointerDown}>
      {/* Wood base */}
      <mesh castShadow position={[0, -r * 0.15, 0]}>
        <boxGeometry args={[w * 1.7, r * 0.32, w]} />
        <meshStandardMaterial color="#8B6914" roughness={0.92} />
      </mesh>
      {/* Metal spring bar */}
      <group ref={springRef} position={[0, r * 0.35, r * 0.42]}>
        <mesh castShadow>
          <boxGeometry args={[w * 1.45, r * 0.14, r * 0.18]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[w * 0.62, -r * 0.08, 0]}>
          <boxGeometry args={[r * 0.12, r * 0.35, r * 0.12]} />
          <meshStandardMaterial color="#888" metalness={0.85} />
        </mesh>
      </group>
      {/* Trigger plate */}
      <mesh castShadow position={[0, r * 0.02, r * 0.28]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[w * 0.75, r * 0.08, w * 0.55]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Cheese bait */}
      <mesh castShadow position={[r * 0.2, r * 0.18, r * 0.52]} rotation={[0.2, 0.5, 0.25]}>
        <boxGeometry args={[r * 0.65, r * 0.38, r * 0.5]} />
        <meshStandardMaterial color="#FFD54F" emissive="#FFB300" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      {/* Cartoon mouse */}
      <group ref={mouseRef} position={[-r * 0.42, r * 0.22, r * 0.45]}>
        <mesh castShadow>
          <sphereGeometry args={[r * 0.3, 12, 12]} />
          <meshStandardMaterial color="#9e9e9e" roughness={0.85} />
        </mesh>
        <mesh position={[-r * 0.18, r * 0.28, 0]}>
          <sphereGeometry args={[r * 0.14, 8, 8]} />
          <meshStandardMaterial color="#bdbdbd" />
        </mesh>
        <mesh position={[r * 0.18, r * 0.28, 0]}>
          <sphereGeometry args={[r * 0.14, 8, 8]} />
          <meshStandardMaterial color="#bdbdbd" />
        </mesh>
        <mesh position={[r * 0.28, r * 0.05, r * 0.22]}>
          <sphereGeometry args={[r * 0.06, 6, 6]} />
          <meshStandardMaterial color="#ffb3ba" />
        </mesh>
        <mesh position={[-r * 0.05, r * 0.08, r * 0.32]}>
          <sphereGeometry args={[r * 0.05, 6, 6]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[r * 0.12, r * 0.08, r * 0.32]}>
          <sphereGeometry args={[r * 0.05, 6, 6]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      {/* Danger stripe */}
      <mesh position={[r * 0.62, r * 0.28, r * 0.55]}>
        <boxGeometry args={[r * 0.35, r * 0.55, r * 0.08]} />
        <meshStandardMaterial color="#e74c3c" emissive="#c0392b" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[r * 0.62, r * 0.28, r * 0.62]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[r * 0.12, r * 0.7, r * 0.06]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export function renderItemModel(
  type: ItemType,
  def: ItemDefinition,
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void,
) {
  const props = { def, onPointerDown };
  switch (type) {
    case 'gold':
      return <GoldCoinModel {...props} />;
    case 'bigGold':
      return <BigGoldModel {...props} />;
    case 'diamond':
      return <DiamondModel {...props} />;
    case 'rock':
      return <RockModel {...props} />;
    case 'mysteryBag':
      return <MysteryBagModel {...props} />;
    case 'poison':
      return <MouseTrapModel {...props} />;
    default:
      return null;
  }
}

export function getHighlightScale(type: ItemType): number {
  switch (type) {
    case 'bigGold':
      return 1.2;
    case 'poison':
      return 1.15;
    default:
      return 1.25;
  }
}
