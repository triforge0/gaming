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

export function MouseAnimalModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(clock.elapsedTime * 8) * 0.35;
    }
  });

  return (
    <group onPointerDown={onPointerDown}>
      <mesh castShadow>
        <sphereGeometry args={[r * 0.55, 12, 12]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.85} />
      </mesh>
      <mesh position={[r * 0.45, r * 0.05, 0]}>
        <sphereGeometry args={[r * 0.38, 10, 10]} />
        <meshStandardMaterial color="#bdbdbd" />
      </mesh>
      <mesh position={[r * 0.62, r * 0.35, 0]}>
        <sphereGeometry args={[r * 0.18, 8, 8]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[r * 0.62, -r * 0.35, 0]}>
        <sphereGeometry args={[r * 0.18, 8, 8]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh ref={tailRef} position={[-r * 0.55, 0, 0]}>
        <cylinderGeometry args={[r * 0.06, r * 0.04, r * 0.7, 6]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
    </group>
  );
}

export function PigModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  const rootRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 4) * 1.8;
      rootRef.current.rotation.z = Math.sin(t * 3.5) * 0.04;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = 0.8 + Math.sin(t * 6) * 0.35;
    }
  });

  const skin = '#F0A0B0';
  const skinShadow = '#D88798';
  const snout = '#FFB8C6';
  const hoof = '#5D4037';

  return (
    <group ref={rootRef} onPointerDown={onPointerDown}>
      {/* Body */}
      <mesh castShadow scale={[1.15, 0.88, 1]}>
        <sphereGeometry args={[r * 0.58, 18, 18]} />
        <meshStandardMaterial color={skin} roughness={0.78} />
      </mesh>
      <mesh position={[0, -r * 0.14, r * 0.12]} scale={[0.9, 0.5, 0.55]}>
        <sphereGeometry args={[r * 0.48, 14, 14]} />
        <meshStandardMaterial color="#FFD4DC" roughness={0.82} />
      </mesh>

      {/* Head group */}
      <group position={[r * 0.58, r * 0.06, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[r * 0.36, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.75} />
        </mesh>

        {/* Snout disk + nostrils */}
        <mesh position={[r * 0.3, -r * 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[r * 0.19, r * 0.21, r * 0.14, 14]} />
          <meshStandardMaterial color={snout} roughness={0.62} />
        </mesh>
        <mesh position={[r * 0.38, -r * 0.06, r * 0.09]}>
          <sphereGeometry args={[r * 0.045, 6, 6]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} />
        </mesh>
        <mesh position={[r * 0.38, -r * 0.06, -r * 0.09]}>
          <sphereGeometry args={[r * 0.045, 6, 6]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} />
        </mesh>

        {/* Ears */}
        <mesh position={[r * 0.02, r * 0.26, r * 0.24]} rotation={[0.5, 0.2, 0.65]}>
          <boxGeometry args={[r * 0.2, r * 0.34, r * 0.07]} />
          <meshStandardMaterial color={skinShadow} roughness={0.85} />
        </mesh>
        <mesh position={[r * 0.02, r * 0.26, -r * 0.24]} rotation={[-0.5, -0.2, 0.65]}>
          <boxGeometry args={[r * 0.2, r * 0.34, r * 0.07]} />
          <meshStandardMaterial color={skinShadow} roughness={0.85} />
        </mesh>

        {/* Eyes */}
        <mesh position={[r * 0.18, r * 0.12, r * 0.22]}>
          <sphereGeometry args={[r * 0.07, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </mesh>
        <mesh position={[r * 0.18, r * 0.12, -r * 0.22]}>
          <sphereGeometry args={[r * 0.07, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </mesh>
        <mesh position={[r * 0.22, r * 0.14, r * 0.22]}>
          <sphereGeometry args={[r * 0.025, 6, 6]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[r * 0.22, r * 0.14, -r * 0.22]}>
          <sphereGeometry args={[r * 0.025, 6, 6]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>

      {/* Legs + hooves */}
      {([
        [r * 0.28, -r * 0.42, r * 0.22],
        [r * 0.28, -r * 0.42, -r * 0.22],
        [-r * 0.22, -r * 0.42, r * 0.22],
        [-r * 0.22, -r * 0.42, -r * 0.22],
      ] as const).map(([lx, ly, lz], i) => (
        <group key={i} position={[lx, ly, lz]}>
          <mesh castShadow>
            <cylinderGeometry args={[r * 0.09, r * 0.1, r * 0.32, 8]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
          <mesh position={[0, -r * 0.2, 0]}>
            <boxGeometry args={[r * 0.14, r * 0.08, r * 0.12]} />
            <meshStandardMaterial color={hoof} roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Curly tail */}
      <group ref={tailRef} position={[-r * 0.56, r * 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[r * 0.14, r * 0.045, 8, 16, Math.PI * 1.45]} />
          <meshStandardMaterial color={skinShadow} roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
}

export function StrengthDrinkModel({ def, onPointerDown }: ModelProps) {
  const r = def.radius;
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 4) * 0.06);
    }
  });

  const bodyRed = '#C62828';
  const bodyDark = '#8E0000';
  const labelGold = '#FFD54F';
  const capSilver = '#ECEFF1';

  return (
    <group onPointerDown={onPointerDown}>
      {/* Sting-style slim red bottle body */}
      <mesh castShadow position={[0, -r * 0.05, 0]}>
        <cylinderGeometry args={[r * 0.38, r * 0.48, r * 1.05, 16]} />
        <meshStandardMaterial color={bodyRed} emissive="#7F0000" emissiveIntensity={0.18} roughness={0.35} metalness={0.08} />
      </mesh>
      <mesh castShadow position={[0, -r * 0.62, 0]}>
        <cylinderGeometry args={[r * 0.5, r * 0.42, r * 0.18, 16]} />
        <meshStandardMaterial color={bodyDark} roughness={0.45} />
      </mesh>

      {/* Tapered neck */}
      <mesh castShadow position={[0, r * 0.48, 0]}>
        <cylinderGeometry args={[r * 0.22, r * 0.34, r * 0.28, 12]} />
        <meshStandardMaterial color={bodyRed} roughness={0.3} />
      </mesh>

      {/* Screw cap */}
      <mesh castShadow position={[0, r * 0.72, 0]}>
        <cylinderGeometry args={[r * 0.24, r * 0.24, r * 0.14, 12]} />
        <meshStandardMaterial color={capSilver} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, r * 0.8, 0]}>
        <cylinderGeometry args={[r * 0.2, r * 0.2, r * 0.05, 12]} />
        <meshStandardMaterial color="#B0BEC5" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Front label + lightning bolt */}
      <mesh ref={glowRef} position={[0, r * 0.05, r * 0.5]}>
        <planeGeometry args={[r * 0.55, r * 0.72]} />
        <meshStandardMaterial color={labelGold} emissive="#FFB300" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[0, r * 0.08, r * 0.54]} rotation={[0, 0, -0.15]}>
        <coneGeometry args={[r * 0.08, r * 0.22, 3]} />
        <meshBasicMaterial color="#FFF176" />
      </mesh>
      <mesh position={[0, -r * 0.08, r * 0.54]} rotation={[0, 0, 2.6]}>
        <coneGeometry args={[r * 0.08, r * 0.22, 3]} />
        <meshBasicMaterial color="#FFF176" />
      </mesh>

      {/* Bottom highlight ring */}
      <mesh position={[0, -r * 0.52, r * 0.46]}>
        <torusGeometry args={[r * 0.42, r * 0.04, 8, 20]} />
        <meshStandardMaterial color="#EF5350" metalness={0.4} roughness={0.35} />
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
    case 'mouse':
      return <MouseAnimalModel {...props} />;
    case 'pig':
      return <PigModel {...props} />;
    case 'strengthDrink':
      return <StrengthDrinkModel {...props} />;
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
    case 'pig':
      return 1.2;
    case 'mouse':
      return 1.1;
    default:
      return 1.25;
  }
}
