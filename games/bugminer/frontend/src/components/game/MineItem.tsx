import { useRef, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlacedItem } from '../../shared';
import { ITEM_DEFINITIONS } from '../../shared';
import { gameYToWorldY } from '../../constants/scene';
import { getHighlightScale, renderItemModel } from './ItemModels';

interface Props {
  item: PlacedItem;
  highlighted?: boolean;
  draggable?: boolean;
  onDragStart?: (itemId: string) => void;
}

function SparkleRing({ radius, color, speed = 1 }: { radius: number; color: string; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const dots = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return { angle };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.elapsedTime * speed * 0.5;
  });

  return (
    <group ref={ref}>
      {dots.map((d, i) => (
        <mesh
          key={i}
          position={[Math.cos(d.angle) * radius * 1.2, Math.sin(d.angle) * radius * 1.2, 2]}
        >
          <sphereGeometry args={[2.5, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export default function MineItem({ item, highlighted, draggable, onDragStart }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const animRef = useRef<THREE.Group>(null);
  const def = ITEM_DEFINITIONS[item.type];
  const seed = useMemo(() => item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0), [item.id]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!draggable || !onDragStart) return;
    e.stopPropagation();
    onDragStart(item.id);
  };

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed * 0.01;
    if (groupRef.current) {
      const bob = Math.sin(t * 2.2) * 3;
      groupRef.current.position.y = gameYToWorldY(item.position.y) + bob;
    }
    if (!animRef.current) return;

    switch (item.type) {
      case 'gold':
        animRef.current.rotation.y = t * 0.8;
        break;
      case 'bigGold':
        animRef.current.rotation.y = t * 0.5;
        break;
      case 'diamond':
        animRef.current.rotation.y = t * 2.5;
        animRef.current.rotation.x = Math.sin(t * 1.5) * 0.15;
        break;
      case 'rock':
        animRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
        break;
      case 'mysteryBag':
        animRef.current.rotation.y = Math.sin(t * 1.8) * 0.2;
        break;
      default:
        break;
    }
  });

  const x = item.position.x;
  const baseY = gameYToWorldY(item.position.y);

  return (
    <group ref={groupRef} position={[x, baseY, 0]}>
      <group ref={animRef}>
        {renderItemModel(item.type, def, handlePointerDown)}
      </group>

      {(item.type === 'gold' || item.type === 'bigGold') && (
        <SparkleRing radius={def.radius} color="#fff8a0" speed={item.type === 'bigGold' ? 1.5 : 1} />
      )}
      {item.type === 'diamond' && (
        <SparkleRing radius={def.radius * 1.1} color="#aaffff" speed={2} />
      )}

      {highlighted && (
        <mesh scale={getHighlightScale(item.type)}>
          <boxGeometry args={[def.radius * 2.4, def.radius * 2.4, def.radius * 2.4]} />
          <meshBasicMaterial color="#ffd700" wireframe transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  );
}
