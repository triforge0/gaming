// src/scene/CellMesh.tsx
import { animated, useSpring } from '@react-spring/three';
import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { cellAt } from '../core/topology';
import { useGame } from '../state/store';
import type { SkinPreset } from '../skins';
import { FACE_ROTATION, cellWorldPosition } from './layout';
import { atlasRegion, type NumberStyle } from './numberAtlas';
import { useReducedMotion } from './useReducedMotion';
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

  const fx = useGame((s) => (s.cellFx?.index === index ? s.cellFx : null));
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const { lift, scale, emissiveInt, animColor } = useSpring({
    lift: hovered || selected ? 0.3 : 0,          // hover/select: translateZ +0.3
    scale: selected ? 1.1 : 1,
    emissiveInt: selected || locked || fx?.kind === 'correct' ? 1.6 : 0,
    animColor: color,
    config: { tension: 300, friction: 20 },
  });

  const { startScale, startRot } = useSpring({
    from: { startScale: reduced ? 1 : 0, startRot: reduced ? 0 : Math.PI / 2 },
    to: { startScale: 1, startRot: 0 },
    delay: index * 12,
    config: { tension: 250, friction: 15 },
  });

  const [spinSpring, spinApi] = useSpring(() => ({ rotY: 0 }));
  const [shakeSpring, shakeApi] = useSpring(() => ({ dx: 0 }));
  useEffect(() => {
    if (!fx || reduced) return;
    if (fx.kind === 'correct' || fx.kind === 'hint') {
      spinApi.set({ rotY: 0 });
      spinApi.start({ rotY: Math.PI * 2, config: { duration: 600 } });
    } else if (fx.kind === 'wrong') {
      void shakeApi.start({
        to: [{ dx: 0.1 }, { dx: -0.1 }, { dx: 0.07 }, { dx: -0.07 }, { dx: 0 }],
        config: { duration: 80 },
      });
    }
  }, [fx, reduced, spinApi, shakeApi]);

  const [lockSpring, lockApi] = useSpring(() => ({ tilt: 0 }));
  useEffect(() => {
    if (!locked || reduced) return;
    void lockApi.start({
      to: [{ tilt: Math.PI / 2 }, { tilt: 0 }],
      delay: (row + col) * 60,
      config: { duration: 400 },
    });
  }, [locked, reduced, lockApi, row, col]);

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
      <animated.group scale={startScale} rotation-z={startRot}>
        <animated.group
          position-x={shakeSpring.dx}
          position-z={lift}
          scale={scale}
          rotation-y={spinSpring.rotY}
          rotation-x={lockSpring.tilt}
        >
          <RoundedBox
            args={[0.9, 0.9, 0.2]}
            radius={0.06}
            onClick={(e) => { e.stopPropagation(); select(index); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={() => setHovered(false)}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              select(index);
              useGame.getState().clearCell();
            }}
          >
            <animated.meshPhysicalMaterial
              color={animColor}
              metalness={0.1}
              roughness={0.2}
              transmission={0.1}
              thickness={0.5}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              emissive={selected ? skin.select : locked ? skin.lockB : fx?.kind === 'correct' ? skin.correct : '#000000'}
              emissiveIntensity={emissiveInt}
            />
          </RoundedBox>
          {value !== null && (
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[0.72, 0.72]} />
              <meshBasicMaterial map={numberTex} transparent depthWrite={false} />
            </mesh>
          )}
        </animated.group>
      </animated.group>
    </group>
  );
}
