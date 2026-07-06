import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { HookData, PlacedItem } from '../../shared';
import { SETUP_ZONE } from '../../shared';
import { gameYToWorldY, MINER_Y, worldYToGameY } from '../../constants/scene';
import Hook from './Hook';
import MinerCart from './MinerCart';
import MineItem from './MineItem';

interface Props {
  theme: 'day' | 'night' | 'cave';
  items: PlacedItem[];
  hook?: HookData;
  onCanvasClick?: (x: number, y: number) => void;
  onCanvasDrop?: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onItemDragStart?: (itemId: string) => void;
  interactive?: boolean;
  selectedItemId?: string | null;
  draggingItemId?: string | null;
  dragPreview?: { x: number; y: number } | null;
  showItems?: boolean;
  phase: string;
}

const MINE_BACKDROP = '#5c4730';

const THEME_COLORS = {
  day: { sky: '#87CEEB', ground: '#a68458', wall: '#8f7048', ambient: '#fff4d0', fog: '#8f7048', light: 1.3 },
  night: { sky: '#4a5a7a', ground: '#755a38', wall: '#5c4730', ambient: '#b0b8e0', fog: '#4a3728', light: 0.95 },
  cave: { sky: '#5a4030', ground: '#8f7048', wall: '#6b5238', ambient: '#ffd8a0', fog: '#5c4730', light: 1.1 },
};

export default function MineWorld({
  theme,
  items,
  hook,
  onCanvasClick,
  onDragMove,
  onItemDragStart,
  interactive,
  selectedItemId,
  draggingItemId,
  dragPreview,
  phase,
  showItems = true,
}: Props) {
  const colors = THEME_COLORS[theme];
  const groundRef = useRef<THREE.Mesh>(null);
  const isDragging = Boolean(draggingItemId);

  const zoneCenterY = gameYToWorldY((SETUP_ZONE.minY + SETUP_ZONE.maxY) / 2);
  const zoneHeight = SETUP_ZONE.maxY - SETUP_ZONE.minY;
  const zoneWidth = SETUP_ZONE.maxX - SETUP_ZONE.minX;

  const toGameCoords = (point: THREE.Vector3) => ({
    x: point.x,
    y: worldYToGameY(point.y),
  });

  const handleZonePointer = (
    e: THREE.Event & { point: THREE.Vector3; stopPropagation: () => void },
    place: boolean,
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    const { x, y: gameY } = toGameCoords(e.point);
    if (
      x < SETUP_ZONE.minX || x > SETUP_ZONE.maxX ||
      gameY < SETUP_ZONE.minY || gameY > SETUP_ZONE.maxY
    ) {
      return;
    }
    if (place && onCanvasClick) {
      onCanvasClick(x, gameY);
    } else if (onDragMove) {
      onDragMove(x, gameY);
    }
  };

  const visibleItems = useMemo(
    () => items.filter((i) => !i.collected && (i.position.x !== 0 || i.position.y !== 0)),
    [items],
  );

  const draggingItem = draggingItemId
    ? items.find((i) => i.id === draggingItemId)
    : null;

  const floorY = gameYToWorldY(SETUP_ZONE.maxY + 30);
  const viewTopY = MINER_Y + 80;
  const viewBottomY = gameYToWorldY(SETUP_ZONE.maxY + 80);
  const viewHeight = viewTopY - viewBottomY;
  const viewCenterY = (viewTopY + viewBottomY) / 2;

  const isGameplay = phase === 'playing' || phase === 'paused';
  const isSetup = phase === 'dual_setup' || phase === 'setup';

  return (
    <>
      <color attach="background" args={[MINE_BACKDROP]} />
      {!isGameplay && <fog attach="fog" args={[colors.fog, 500, 1400]} />}

      <ambientLight intensity={isGameplay ? 0.82 : (theme === 'night' ? 0.58 : 0.72)} color={colors.ambient} />
      <hemisphereLight
        args={[colors.ambient, colors.ground, isGameplay ? 0.55 : 0.35]}
      />
      <directionalLight
        position={[80, 500, 300]}
        intensity={isGameplay ? colors.light + 0.25 : colors.light}
        castShadow={!isSetup}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[0, MINER_Y, 120]}
        intensity={isGameplay ? 1.0 : 0.7}
        color="#ffffcc"
        distance={900}
      />

      {/* Sky strip above surface */}
      <mesh position={[0, viewTopY + 40, -80]}>
        <planeGeometry args={[900, 140]} />
        <meshBasicMaterial color={colors.sky} />
      </mesh>

      {/* Mine backdrop */}
      <mesh position={[0, viewCenterY, -40]}>
        <planeGeometry args={[900, viewHeight + 40]} />
        <meshStandardMaterial color={colors.wall} roughness={1} />
      </mesh>

      <MinerCart />

      {hook && phase !== 'dual_setup' && phase !== 'setup' && <Hook hook={hook} />}

      {showItems && visibleItems.map((item) => (
        <MineItem
          key={item.id}
          item={item}
          highlighted={item.id === selectedItemId}
          draggable={interactive && item.id !== draggingItemId}
          onDragStart={onItemDragStart}
          hookAttached={hook?.attachedItemId === item.id}
        />
      ))}

      {draggingItem && dragPreview && (
        <MineItem
          item={{ ...draggingItem, position: dragPreview }}
          highlighted
        />
      )}

      {/* Surface line + underground mass (fills lower viewport) */}
      <mesh position={[0, floorY, 5]} receiveShadow>
        <boxGeometry args={[900, 28, 90]} />
        <meshStandardMaterial color="#8f7048" roughness={0.95} />
      </mesh>
      <mesh position={[0, floorY - viewHeight * 0.45, 10]}>
        <boxGeometry args={[900, viewHeight * 0.9, 100]} />
        <meshStandardMaterial color={colors.ground} roughness={0.95} />
      </mesh>

      <mesh position={[-450, viewCenterY, 5]}>
        <boxGeometry args={[28, viewHeight + 60, 100]} />
        <meshStandardMaterial color={colors.wall} />
      </mesh>
      <mesh position={[450, viewCenterY, 5]}>
        <boxGeometry args={[28, viewHeight + 60, 100]} />
        <meshStandardMaterial color={colors.wall} />
      </mesh>

      {interactive && (
        <>
          <mesh
            ref={groundRef}
            position={[0, zoneCenterY, 5]}
            onPointerDown={(e) => handleZonePointer(e, !isDragging)}
            onPointerMove={(e) => isDragging && handleZonePointer(e, false)}
            onPointerUp={(e) => isDragging && handleZonePointer(e, true)}
          >
            <planeGeometry args={[zoneWidth, zoneHeight]} />
            <meshStandardMaterial
              color="#ffd700"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
          {[
            [0, zoneCenterY + zoneHeight / 2, zoneWidth, 4],
            [0, zoneCenterY - zoneHeight / 2, zoneWidth, 4],
            [SETUP_ZONE.minX, zoneCenterY, 4, zoneHeight],
            [SETUP_ZONE.maxX, zoneCenterY, 4, zoneHeight],
          ].map(([x, y, w, h], i) => (
            <mesh key={i} position={[x, y, 7]}>
              <boxGeometry args={[w, h, 2]} />
              <meshBasicMaterial color="#ffd700" transparent opacity={0.7} />
            </mesh>
          ))}
        </>
      )}
    </>
  );
}
