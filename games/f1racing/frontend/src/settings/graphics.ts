import type { GraphicsQuality } from './types';

export interface GraphicsProfile {
  pixelRatioCap: number;
  shadows: boolean;
  antialias: boolean;
  fogNear: number;
  fogFar: number;
  bloom: boolean;
  environmentReflections: boolean;
}

export function graphicsProfileFor(quality: GraphicsQuality): GraphicsProfile {
  switch (quality) {
    case 'low':
      return {
        pixelRatioCap: 1, shadows: false, antialias: false, fogNear: 180, fogFar: 700,
        bloom: false, environmentReflections: false,
      };
    case 'high':
      return {
        pixelRatioCap: 2, shadows: true, antialias: true, fogNear: 260, fogFar: 1150,
        bloom: true, environmentReflections: true,
      };
    default:
      return {
        pixelRatioCap: 1.5, shadows: true, antialias: true, fogNear: 220, fogFar: 950,
        bloom: true, environmentReflections: true,
      };
  }
}
