// src/scene/layout.ts
import { cellCenter, type FaceId } from '../core/topology';

/** Xoay để mặt +Z local của ô trỏ ra ngoài theo pháp tuyến mặt. */
export const FACE_ROTATION: Record<FaceId, [number, number, number]> = {
  U: [-Math.PI / 2, 0, 0],
  D: [Math.PI / 2, 0, 0],
  F: [0, 0, 0],
  B: [0, Math.PI, 0],
  L: [0, -Math.PI / 2, 0],
  R: [0, Math.PI / 2, 0],
};

export const FACE_NORMAL: Record<FaceId, [number, number, number]> = {
  U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], L: [-1, 0, 0], R: [1, 0, 0],
};

const SURFACE_OFFSET = 0.1; // nửa bề dày ô — ô nằm nổi trên bề mặt lõi

/** Tâm ô trong world space (cube tâm gốc tọa độ, cạnh 4). */
export function cellWorldPosition(face: FaceId, row: number, col: number): [number, number, number] {
  const [x, y, z] = cellCenter(face, row, col);
  const n = FACE_NORMAL[face];
  return [x - 2 + n[0] * SURFACE_OFFSET, y - 2 + n[1] * SURFACE_OFFSET, z - 2 + n[2] * SURFACE_OFFSET];
}
