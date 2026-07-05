import { useEffect, useMemo, useState } from 'react';
import type { RaceBridge } from '../net/RaceBridge';
import { loadTrackDefinition } from '../shared/trackData';

interface Dot {
  id: number;
  x: number;
  y: number;
  self: boolean;
  color: string;
}

interface Props {
  bridge: RaceBridge | null;
  trackId: string;
}

const PAD = 12;
const SPAN = 100 - PAD * 2;

export default function Minimap({ bridge, trackId }: Props) {
  const [dots, setDots] = useState<Dot[]>([]);

  // Uniform (aspect-preserving) projection into the padded viewBox so the track keeps its real
  // shape and the stroke never clips against the rounded container edge.
  const project = useMemo(() => {
    const track = loadTrackDefinition(trackId);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of track.centerline) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    const span = Math.max(1, maxX - minX, maxY - minY);
    const offX = (span - (maxX - minX)) / 2;
    const offY = (span - (maxY - minY)) / 2;
    return (px: number, py: number) => ({
      x: PAD + ((px - minX + offX) / span) * SPAN,
      y: PAD + (1 - (py - minY + offY) / span) * SPAN,
    });
  }, [trackId]);

  useEffect(() => {
    if (!bridge) return;
    const id = window.setInterval(() => {
      const { world } = bridge;
      const next: Dot[] = [];
      for (const [entityId, entity] of world.entities) {
        if (!entity.position) continue;
        const screen = project(entity.position.x ?? 0, entity.position.y ?? 0);
        next.push({
          id: entityId,
          x: screen.x,
          y: screen.y,
          self: entityId === world.selfEntityId,
          color: entity.vehicle?.primaryColor ?? '#ffffff',
        });
      }
      setDots(next);
    }, 250);
    return () => window.clearInterval(id);
  }, [bridge, project]);

  const track = loadTrackDefinition(trackId);
  const path = `${track.centerline
    .map((point, index) => {
      const screen = project(point.x, point.y);
      return `${index === 0 ? 'M' : 'L'} ${screen.x.toFixed(2)} ${screen.y.toFixed(2)}`;
    })
    .join(' ')} Z`;

  return (
    <div className="minimap">
      <svg viewBox="0 0 100 100" aria-label="Minimap">
        <path
          d={path}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dot.self ? 3.4 : 2.4}
            fill={dot.color.startsWith('#') ? dot.color : '#ffffff'}
            stroke={dot.self ? '#ffffff' : 'rgba(0,0,0,0.5)'}
            strokeWidth={dot.self ? 1.4 : 0.8}
          />
        ))}
      </svg>
    </div>
  );
}
