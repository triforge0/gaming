// src/scene/CellMesh.tsx
import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { cellAt } from '../core/topology';
import { useGame } from '../state/store';
import type { SkinPreset } from '../skins';
import { FACE_ROTATION, cellWorldPosition } from './layout';
import { atlasRegion, type NumberStyle } from './numberAtlas';

interface Props { index: number; skin: SkinPreset; atlas: THREE.CanvasTexture }

export function CellMesh({ index, skin, atlas }: Props) {
  const { face, row, col } = cellAt(index);
  const puzzle = useGame((s) => s.persisted.currentGame?.puzzle);
  const entry = useGame((s) => s.persisted.currentGame?.entries[index] ?? null);
  const selected = useGame((s) => s.selected === index);
  const locked = useGame((s) => s.lockedFaces.includes(face));
  const select = useGame((s) => s.select);

  const position = useMemo(() => cellWorldPosition(face, row, col), [face, row, col]);
  const rotation = FACE_ROTATION[face];

  if (!puzzle) return null;
  const given = puzzle.givens[index];
  const value = given ? puzzle.solution[index] : entry;
  const correct = value !== null && value === puzzle.solution[index];
  const style: NumberStyle = given ? 'given' : correct ? 'correct' : 'wrong';

  const color = locked ? skin.lockA : selected ? skin.select : skin.cellColor;

  const numberTex = useMemo(() => atlas.clone(), [atlas]);

  useEffect(() => {
    return () => numberTex.dispose();
  }, [numberTex]);

  useEffect(() => {
    if (value !== null) {
      const { offset, repeat } = atlasRegion(value, given ? 'given' : style);
      numberTex.offset.set(offset[0], offset[1]);
      numberTex.repeat.set(repeat[0], repeat[1]);
    }
  }, [numberTex, value, given, style]);

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[0.9, 0.9, 0.2]}
        radius={0.06}
        onClick={(e) => { e.stopPropagation(); select(index); }}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
          select(index);
          useGame.getState().clearCell();
        }}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.2}
          transmission={0.1}
          thickness={0.5}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      {value !== null && (
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[0.72, 0.72]} />
          <meshBasicMaterial map={numberTex} transparent depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
