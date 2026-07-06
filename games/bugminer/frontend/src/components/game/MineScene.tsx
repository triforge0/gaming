import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { getLevelById } from '../../shared';
import type { ChallengeState, HookData, PlacedItem } from '../../shared';
import MineWorld from './MineWorld';
import SceneCamera from './SceneCamera';

interface Props {
  challenge: Pick<ChallengeState, 'levelId' | 'items' | 'hook'>;
  phase: string;
  onCanvasClick?: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onItemDragStart?: (itemId: string) => void;
  interactive?: boolean;
  readOnly?: boolean;
  selectedItemId?: string | null;
  draggingItemId?: string | null;
  dragPreview?: { x: number; y: number } | null;
  showItems?: boolean;
}

export default function MineScene({
  challenge,
  phase,
  onCanvasClick,
  onDragMove,
  onItemDragStart,
  interactive,
  readOnly,
  selectedItemId,
  draggingItemId,
  dragPreview,
  showItems = true,
}: Props) {
  const level = getLevelById(challenge.levelId);
  const hook = challenge.hook;

  return (
    <Canvas
      camera={{ fov: 48, near: 1, far: 2500 }}
      style={{ width: '100%', height: '100%', display: 'block', background: '#5c4730' }}
      shadows={!readOnly}
      dpr={readOnly ? 1 : undefined}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#5c4730');
      }}
    >
      <SceneCamera />
      <Suspense fallback={null}>
        <MineWorld
          theme={level.theme}
          items={challenge.items}
          hook={phase !== 'dual_setup' ? hook : undefined}
          onCanvasClick={interactive && !readOnly ? onCanvasClick : undefined}
          onDragMove={interactive && !readOnly ? onDragMove : undefined}
          onItemDragStart={interactive && !readOnly ? onItemDragStart : undefined}
          interactive={interactive && !readOnly}
          selectedItemId={selectedItemId}
          draggingItemId={draggingItemId}
          dragPreview={dragPreview}
          phase={phase}
          showItems={showItems}
        />
      </Suspense>
    </Canvas>
  );
}
