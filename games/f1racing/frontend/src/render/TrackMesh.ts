import * as THREE from 'three';
import type { TrackDefinition, TrackPoint } from '../shared/trackData';
import { makeAsphaltTexture, makeCheckerTexture } from './textures';

interface Ribbon {
  position: number[];
  uv: number[];
  color: number[];
  index: number[];
}

/** Lateral unit normal (left side) of the segment leaving point i. */
function normalAt(centerline: TrackPoint[], i: number): [number, number] {
  const curr = centerline[i];
  const next = centerline[(i + 1) % centerline.length];
  const dx = next.x - curr.x;
  const dy = next.y - curr.y;
  const len = Math.hypot(dx, dy) || 1;
  return [-dy / len, dx / len];
}

/** Smooth closed ribbon between two signed lateral offsets, UV-mapped by real distance. */
function buildRibbon(
  centerline: TrackPoint[],
  offA: number,
  offB: number,
  y: number,
  tileMeters = 10,
): THREE.BufferGeometry {
  const count = centerline.length;
  const r: Ribbon = { position: [], uv: [], color: [], index: [] };
  let dist = 0;
  for (let i = 0; i < count; i++) {
    const curr = centerline[i];
    const [nx, ny] = normalAt(centerline, i);
    const elev = (curr.z ?? 0) + y;
    r.position.push(curr.x + nx * offA, elev, curr.y + ny * offA);
    r.position.push(curr.x + nx * offB, elev, curr.y + ny * offB);
    const u = dist / tileMeters;
    r.uv.push(u, 0, u, 1);
    const next = centerline[(i + 1) % count];
    dist += Math.hypot(next.x - curr.x, next.y - curr.y);
    const base = i * 2;
    const nb = ((i + 1) % count) * 2;
    r.index.push(base, base + 1, nb + 1, base, nb + 1, nb);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(r.position, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(r.uv, 2));
  geom.setIndex(r.index);
  geom.computeVertexNormals();
  return geom;
}

/** Per-segment quads with alternating red/white for a crisp kerb. */
function buildKerb(centerline: TrackPoint[], offInner: number, offOuter: number, y: number): THREE.BufferGeometry {
  const count = centerline.length;
  const position: number[] = [];
  const color: number[] = [];
  const index: number[] = [];
  const red = new THREE.Color('#d81419');
  const white = new THREE.Color('#e8e8e8');
  let v = 0;
  for (let i = 0; i < count; i++) {
    const curr = centerline[i];
    const next = centerline[(i + 1) % count];
    const [nx, ny] = normalAt(centerline, i);
    const elevA = (curr.z ?? 0) + y;
    const elevB = (next.z ?? 0) + y;
    // four unique verts per segment so the colour never bleeds between blocks
    position.push(curr.x + nx * offInner, elevA, curr.y + ny * offInner);
    position.push(curr.x + nx * offOuter, elevA, curr.y + ny * offOuter);
    position.push(next.x + nx * offInner, elevB, next.y + ny * offInner);
    position.push(next.x + nx * offOuter, elevB, next.y + ny * offOuter);
    const c = i % 2 === 0 ? red : white;
    for (let k = 0; k < 4; k++) color.push(c.r, c.g, c.b);
    const b = v;
    index.push(b, b + 1, b + 3, b, b + 3, b + 2);
    v += 4;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  geom.setIndex(index);
  geom.computeVertexNormals();
  return geom;
}

export class TrackMesh {
  readonly group = new THREE.Group();

  constructor(track: TrackDefinition) {
    const half = track.trackWidth * 0.5;
    const asphaltMap = makeAsphaltTexture();

    const asphalt = new THREE.Mesh(
      buildRibbon(track.centerline, half, -half, 0),
      new THREE.MeshStandardMaterial({ map: asphaltMap, color: 0x9aa0aa, roughness: 0.92, metalness: 0.02 }),
    );
    asphalt.receiveShadow = true;
    this.group.add(asphalt);

    const lineMat = new THREE.MeshStandardMaterial({
      color: 0xd7dae0,
      roughness: 0.7,
    });
    const lineW = 0.4;
    for (const side of [1, -1]) {
      const line = new THREE.Mesh(
        buildRibbon(track.centerline, side * half, side * (half - lineW), 0.03),
        lineMat,
      );
      line.receiveShadow = true;
      this.group.add(line);
    }

    const kerbMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.05 });
    const kerbW = 1.8;
    this.group.add(new THREE.Mesh(buildKerb(track.centerline, half, half + kerbW, 0.02), kerbMat));
    this.group.add(new THREE.Mesh(buildKerb(track.centerline, -half, -(half + kerbW), 0.02), kerbMat));

    this.addStartLine(track, half);
  }

  private addStartLine(track: TrackDefinition, half: number): void {
    const a = track.centerline[0];
    const b = track.centerline[1 % track.centerline.length];
    const heading = Math.atan2(b.y - a.y, b.x - a.x);
    const checker = makeCheckerTexture(10);
    checker.repeat.set(track.trackWidth / 2.4, 1.4);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(track.trackWidth, 3),
      new THREE.MeshStandardMaterial({ map: checker, roughness: 0.7 }),
    );
    plane.rotation.x = -Math.PI / 2;
    plane.rotation.z = -heading + Math.PI / 2;
    plane.position.set(a.x, (a.z ?? 0) + 0.04, a.y);
    plane.receiveShadow = true;
    this.group.add(plane);
  }
}

export { normalAt };
