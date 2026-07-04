import { useMemo } from 'react';
import * as THREE from 'three';
import {
  BATTLE_MINER_A,
  BATTLE_MINER_B,
  SETUP_ZONE,
  SURFACE_LINE_Y,
  MINE_VISUAL_WIDTH,
  MINE_WALL_X,
  type HookData,
  type PlacedItem,
} from '../shared';
import { gameYToWorldY, MINER_Y } from '../../constants/scene';
import BattleHook from './BattleHook';
import BattleMinerCart from './BattleMinerCart';
import MineItem from './MineItem';

interface Props {
  theme: 'day' | 'night' | 'cave';
  items: PlacedItem[];
  hookA: HookData;
  hookB: HookData;
  phase: string;
}

const SOIL_LAYERS = ['#c9a86c', '#b8956a', '#a68458', '#8f7048', '#755a38', '#5c4730'];

const THEME_TUNING = {
  day: { ambient: '#fff4d0', light: 1.25, fog: '#6b5238' },
  night: { ambient: '#8090cc', light: 0.85, fog: '#2a1f10' },
  cave: { ambient: '#ffcc88', light: 1.0, fog: '#3d2b1f' },
};

export default function BattleMineWorld({
  theme,
  items,
  hookA,
  hookB,
  phase,
}: Props) {
  const tune = THEME_TUNING[theme];
  const zoneCenterY = gameYToWorldY((SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2);
  const zoneHeight = SETUP_ZONE.maxY - SETUP_ZONE.minY;
  const zoneWidth = SETUP_ZONE.maxX - SETUP_ZONE.minX;

  const surfaceWorldY = gameYToWorldY(SURFACE_LINE_Y);
  const mineBottomY = gameYToWorldY(SETUP_ZONE.maxY + 40);
  const mineHeight = surfaceWorldY - mineBottomY;
  const mineCenterY = (surfaceWorldY + mineBottomY) / 2;

  const visibleItems = useMemo(
    () => items.filter((i) => !i.collected && (i.position.x !== 0 || i.position.y !== 0)),
    [items],
  );

  const showHooks = phase !== 'dual_setup' && phase !== 'setup';

  return (
    <>
      <color attach="background" args={['#5c4730']} />
      <fog attach="fog" args={[tune.fog, 500, 1400]} />

      <ambientLight intensity={theme === 'night' ? 0.5 : 0.72} color={tune.ambient} />
      <directionalLight
        position={[60, MINER_Y + 120, 280]}
        intensity={tune.light}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, MINER_Y, 100]} intensity={0.45} color="#ffffcc" distance={600} />

      {SOIL_LAYERS.map((color, i) => {
        const layerGameTop = SURFACE_LINE_Y + i * ((SETUP_ZONE.maxY - SURFACE_LINE_Y) / SOIL_LAYERS.length);
        const layerGameBottom = SURFACE_LINE_Y + (i + 1) * ((SETUP_ZONE.maxY - SURFACE_LINE_Y) / SOIL_LAYERS.length);
        const yTop = gameYToWorldY(layerGameTop);
        const yBottom = gameYToWorldY(layerGameBottom);
        const h = yTop - yBottom;
        return (
          <mesh key={color} position={[0, yBottom + h / 2, -20 - i * 2]}>
            <boxGeometry args={[MINE_VISUAL_WIDTH, h + 4, 60]} />
            <meshStandardMaterial color={color} roughness={0.98} />
          </mesh>
        );
      })}

      <mesh position={[-MINE_WALL_X, mineCenterY, 0]}>
        <boxGeometry args={[36, mineHeight + 120, 120]} />
        <meshStandardMaterial color="#4a3728" roughness={1} />
      </mesh>
      <mesh position={[MINE_WALL_X, mineCenterY, 0]}>
        <boxGeometry args={[36, mineHeight + 120, 120]} />
        <meshStandardMaterial color="#4a3728" roughness={1} />
      </mesh>

      {/* Center war zone — wider battle field */}
      <mesh position={[0, zoneCenterY, 4]}>
        <planeGeometry args={[280, zoneHeight * 0.6]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, zoneCenterY, 6]}>
        <ringGeometry args={[70, 78, 32]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.35} />
      </mesh>

      <BattleMinerCart />

      {showHooks && (
        <>
          <BattleHook hook={hookA} originX={BATTLE_MINER_A.x} mirror={false} />
          <BattleHook hook={hookB} originX={BATTLE_MINER_B.x} mirror />
        </>
      )}

      {visibleItems.map((item) => (
        <MineItem key={item.id} item={item} />
      ))}
    </>
  );
}
