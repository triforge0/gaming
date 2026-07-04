import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HookData } from '../shared';
import { MINER_Y } from '../../constants/scene';

interface Props {
  hook: HookData;
  originX: number;
  mirror: boolean;
}

export default function BattleHook({ hook, originX, mirror }: Props) {
  const hookGroupRef = useRef<THREE.Group>(null);
  const interp = useRef({ angle: hook.angle, length: hook.length });

  const ropeLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({ color: '#8B4513', linewidth: 2 });
    return new THREE.Line(geo, mat);
  }, []);

  useFrame((_, delta) => {
    const lerp = Math.min(delta * 15, 1);
    interp.current.angle += (hook.angle - interp.current.angle) * lerp;
    interp.current.length += (hook.length - interp.current.length) * lerp;

    const { angle, length } = interp.current;
    const resolved = mirror ? Math.PI - angle : angle;
    const tipX = originX + Math.sin(resolved) * length;
    const tipY = MINER_Y - Math.cos(resolved) * length;

    if (hookGroupRef.current) {
      hookGroupRef.current.position.set(tipX, tipY, 10);
      hookGroupRef.current.rotation.z = resolved;
    }

    const pts: THREE.Vector3[] = [];
    const segments = 14;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const sag = Math.sin(t * Math.PI) * 6;
      const x = originX + (tipX - originX) * t;
      const y = MINER_Y + (tipY - MINER_Y) * t - sag;
      pts.push(new THREE.Vector3(x, y, 10));
    }
    ropeLine.geometry.setFromPoints(pts);
  });

  return (
    <group>
      <primitive object={ropeLine} />
      <group ref={hookGroupRef}>
        <mesh>
          <torusGeometry args={[12, 3.5, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#cccccc" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, -10, 0]}>
          <coneGeometry args={[5, 14, 8]} />
          <meshStandardMaterial color="#999999" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
