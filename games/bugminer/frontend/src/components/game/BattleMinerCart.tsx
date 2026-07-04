import * as THREE from 'three';
import { BATTLE_MINER_A, BATTLE_MINER_B, SURFACE_LINE_Y, MINE_VISUAL_WIDTH } from '../shared';
import { gameYToWorldY, MINER_Y } from '../../constants/scene';

function MinerAlcove({ x, flip = false }: { x: number; flip?: boolean }) {
  const minerOffset = flip ? 38 : -38;

  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, MINER_Y - 8, 8]}>
        <sphereGeometry args={[68, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={flip ? '#d45b8f' : '#5b8fd4'} roughness={0.55} />
      </mesh>
      <mesh position={[0, MINER_Y - 8, 6]}>
        <cylinderGeometry args={[68, 68, 12, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color={flip ? '#b84a7a' : '#4a7ab8'} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, MINER_Y - 2, 12]} castShadow>
        <boxGeometry args={[100, 18, 36]} />
        <meshStandardMaterial color="#8B6914" roughness={0.92} />
      </mesh>
      <mesh position={[0, MINER_Y + 8, 14]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[20, 20, 44, 16]} />
        <meshStandardMaterial color="#6b4c2a" roughness={0.88} />
      </mesh>
      <group position={[minerOffset, MINER_Y + 6, 14]}>
        <mesh position={[0, 8, 0]}>
          <capsuleGeometry args={[10, 14, 4, 8]} />
          <meshStandardMaterial color={flip ? '#d45b8f' : '#4a90d9'} />
        </mesh>
        <mesh position={[0, 24, 0]}>
          <sphereGeometry args={[12, 14, 14]} />
          <meshStandardMaterial color="#ffcc99" />
        </mesh>
        <mesh position={[0, 30, 0]}>
          <sphereGeometry args={[13, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffd700" metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Two miners at top-left / top-right for Battle shared-screen. */
export default function BattleMinerCart() {
  const surfaceY = gameYToWorldY(SURFACE_LINE_Y);
  const barY = MINER_Y + 28;

  return (
    <group>
      <mesh position={[0, barY, 15]}>
        <boxGeometry args={[MINE_VISUAL_WIDTH, 52, 8]} />
        <meshStandardMaterial color="#e8c040" roughness={0.85} />
      </mesh>
      <mesh position={[0, barY + 26, 16]}>
        <boxGeometry args={[MINE_VISUAL_WIDTH, 4, 4]} />
        <meshStandardMaterial color="#c9a020" />
      </mesh>

      <MinerAlcove x={BATTLE_MINER_A.x} />
      <MinerAlcove x={BATTLE_MINER_B.x} flip />

      <mesh position={[0, surfaceY, 10]} receiveShadow>
        <boxGeometry args={[MINE_VISUAL_WIDTH, 14, 40]} />
        <meshStandardMaterial color="#8B6914" roughness={0.95} />
      </mesh>
    </group>
  );
}
