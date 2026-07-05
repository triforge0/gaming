import * as THREE from 'three';
import type { TrackDefinition, TrackPoint } from '../shared/trackData';
import { makeGrassTexture } from './textures';
import { normalAt } from './TrackMesh';

/** Low-poly, fully procedural trackside dressing so the scene reads as a circuit, not a debug plane. */
export class Environment {
  readonly group = new THREE.Group();
  readonly floodlights: THREE.Object3D[] = [];

  constructor(track: TrackDefinition) {
    this.addGround(track);
    this.addBarriers(track);
    this.addKerbTyres(track);
    this.addTrees(track);
    this.addGrandstands(track);
    this.addBanners(track);
    this.addFloodlights(track);
    this.addStartGantry(track);
  }

  private point(track: TrackDefinition, i: number, off: number): THREE.Vector3 {
    const c = track.centerline[i];
    const [nx, ny] = normalAt(track.centerline, i);
    return new THREE.Vector3(c.x + nx * off, c.z ?? 0, c.y + ny * off);
  }

  private bounds(track: TrackDefinition): { cx: number; cz: number; radius: number } {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of track.centerline) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    return {
      cx: (minX + maxX) / 2,
      cz: (minY + maxY) / 2,
      radius: Math.max(maxX - minX, maxY - minY) / 2,
    };
  }

  private addGround(track: TrackDefinition): void {
    const { cx, cz, radius } = this.bounds(track);
    const grass = makeGrassTexture();
    grass.repeat.set(radius / 6, radius / 6);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(radius * 6, radius * 6),
      new THREE.MeshStandardMaterial({ map: grass, color: 0x9fbf88, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(cx, -0.06, cz);
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  private addBarriers(track: TrackDefinition): void {
    const half = track.trackWidth * 0.5;
    const off = half + 2.4;
    const concrete = new THREE.MeshStandardMaterial({ color: 0xcfd3da, roughness: 0.85 });
    for (const side of [1, -1]) {
      this.group.add(new THREE.Mesh(this.wallGeometry(track, side * off, 1.1), concrete));
    }
  }

  private wallGeometry(track: TrackDefinition, off: number, height: number): THREE.BufferGeometry {
    const count = track.centerline.length;
    const position: number[] = [];
    const index: number[] = [];
    for (let i = 0; i < count; i++) {
      const c = track.centerline[i];
      const [nx, ny] = normalAt(track.centerline, i);
      const y0 = c.z ?? 0;
      position.push(c.x + nx * off, y0, c.y + ny * off);
      position.push(c.x + nx * off, y0 + height, c.y + ny * off);
      const b = i * 2;
      const nb = ((i + 1) % count) * 2;
      index.push(b, b + 1, nb + 1, b, nb + 1, nb);
      index.push(b, nb + 1, b + 1, b, nb, nb + 1); // double-sided
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    geom.setIndex(index);
    geom.computeVertexNormals();
    return geom;
  }

  private addKerbTyres(track: TrackDefinition): void {
    const half = track.trackWidth * 0.5;
    const step = 3;
    const perStack = 3;
    const start = track.centerline[0];
    const bases: THREE.Vector3[] = [];
    for (let i = 0; i < track.centerline.length; i += step) {
      const c = track.centerline[i];
      // Keep tyre stacks away from the start/finish so none looms over the grid at launch.
      if (Math.hypot(c.x - start.x, c.y - start.y) < 26) continue;
      for (const side of [1, -1]) {
        bases.push(this.point(track, i, side * (half + 2.9)));
      }
    }
    const geom = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 10);
    const mat = new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.95 });
    const mesh = new THREE.InstancedMesh(geom, mat, bases.length * perStack);
    const m = new THREE.Matrix4();
    let n = 0;
    for (const p of bases) {
      for (let s = 0; s < perStack; s++) {
        m.makeTranslation(p.x, p.y + 0.25 + s * 0.48, p.z);
        mesh.setMatrixAt(n++, m);
      }
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  private addTrees(track: TrackDefinition): void {
    const foliageGeom = new THREE.ConeGeometry(3.4, 8, 7);
    const trunkGeom = new THREE.CylinderGeometry(0.5, 0.7, 3, 6);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2f5d34, roughness: 1, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 1 });
    const spots: THREE.Vector3[] = [];
    for (let i = 0; i < track.centerline.length; i += 2) {
      for (const side of [1, -1]) {
        const base = track.trackWidth * 0.5 + 16 + (i % 5) * 3;
        const p = this.point(track, i, side * base);
        spots.push(p);
      }
    }
    const foliage = new THREE.InstancedMesh(foliageGeom, foliageMat, spots.length);
    const trunk = new THREE.InstancedMesh(trunkGeom, trunkMat, spots.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    spots.forEach((p, idx) => {
      const scale = 0.75 + ((idx * 37) % 60) / 100;
      s.set(scale, scale, scale);
      m.compose(new THREE.Vector3(p.x, p.y + 5.5 * scale, p.z), q, s);
      foliage.setMatrixAt(idx, m);
      m.compose(new THREE.Vector3(p.x, p.y + 1.5 * scale, p.z), q, s);
      trunk.setMatrixAt(idx, m);
    });
    foliage.castShadow = true;
    trunk.castShadow = true;
    this.group.add(foliage, trunk);
  }

  private addGrandstands(track: TrackDefinition): void {
    const half = track.trackWidth * 0.5;
    const indices = [4, Math.floor(track.centerline.length / 2)];
    for (const i of indices) {
      const p = this.point(track, i, half + 9);
      const [nx, ny] = normalAt(track.centerline, i);
      const facing = Math.atan2(ny, nx);
      const stand = this.grandstand();
      stand.position.copy(p);
      stand.rotation.y = -facing;
      this.group.add(stand);
    }
  }

  private grandstand(): THREE.Group {
    const g = new THREE.Group();
    const tiers = 5;
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x2b3550, roughness: 0.9 });
    const crowd = [0xe8e8e8, 0xd8433a, 0x3a6fd8, 0xe0b13a];
    for (let t = 0; t < tiers; t++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(26, 1.4, 2.2), seatMat);
      step.position.set(0, 1 + t * 1.3, -t * 1.7);
      step.castShadow = true;
      step.receiveShadow = true;
      g.add(step);
      const dots = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.7, 0.8, 0.7),
        new THREE.MeshStandardMaterial({ vertexColors: false, color: 0xffffff, roughness: 1 }),
        30,
      );
      const m = new THREE.Matrix4();
      const color = new THREE.Color();
      for (let d = 0; d < 30; d++) {
        m.makeTranslation(-12 + d * 0.82, 2 + t * 1.3, -t * 1.7);
        dots.setMatrixAt(d, m);
        dots.setColorAt(d, color.setHex(crowd[(d + t) % crowd.length]));
      }
      g.add(dots);
    }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(28, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x191c24 }));
    roof.position.set(0, 9, -3.5);
    roof.castShadow = true;
    g.add(roof);
    return g;
  }

  private addBanners(track: TrackDefinition): void {
    const half = track.trackWidth * 0.5;
    const colors = [0xd8433a, 0xffffff, 0x2b6fe0, 0xf0b429, 0x18a558];
    for (let i = 1; i < track.centerline.length; i += 4) {
      const side = i % 8 < 4 ? 1 : -1;
      const p = this.point(track, i, side * (half + 4));
      const [nx, ny] = normalAt(track.centerline, i);
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(6, 1.1, 0.2),
        new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.6, emissive: 0x111111 }),
      );
      panel.position.set(p.x, p.y + 1.3, p.z);
      panel.rotation.y = -Math.atan2(ny, nx) + Math.PI / 2;
      panel.castShadow = true;
      this.group.add(panel);
    }
  }

  private addFloodlights(track: TrackDefinition): void {
    const { cx, cz, radius } = this.bounds(track);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4a, roughness: 0.7, metalness: 0.4 });
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff2cc,
      emissiveIntensity: 2.4,
    });
    const poles = 6;
    // Well clear of the track, and rotated off the start/finish axis so no pole sits in the grid sightline.
    const ring = radius + 65;
    for (let k = 0; k < poles; k++) {
      const a = ((k + 0.5) / poles) * Math.PI * 2;
      const x = cx + Math.cos(a) * ring;
      const z = cz + Math.sin(a) * ring;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 28, 8), poleMat);
      pole.position.set(x, 14, z);
      pole.castShadow = true;
      const head = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 1.2), lampMat);
      head.position.set(x, 28, z);
      head.lookAt(cx, 10, cz);
      this.group.add(pole, head);
      this.floodlights.push(head);
    }
  }

  private addStartGantry(track: TrackDefinition): void {
    const a = track.centerline[0];
    const b = track.centerline[1 % track.centerline.length];
    const heading = Math.atan2(b.y - a.y, b.x - a.x);
    // Span the gantry well past the track so its uprights land out in the runoff, never beside
    // a grid car (that was blocking the start-line camera).
    const width = track.trackWidth + 20;
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2a3040, roughness: 0.55, metalness: 0.5 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(width, 1.0, 0.9), frameMat);
    beam.position.y = 11.2;
    beam.castShadow = true;
    g.add(beam);
    const banner = new THREE.Mesh(
      new THREE.BoxGeometry(track.trackWidth + 3, 1.3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xd81419, roughness: 0.6, emissive: 0x1a0000 }),
    );
    banner.position.set(0, 10.2, 0);
    g.add(banner);
    for (const side of [1, -1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.55, 12, 0.55), frameMat);
      leg.position.set((side * width) / 2, 6, 0);
      leg.castShadow = true;
      g.add(leg);
    }
    for (const lx of [-3, 0, 3]) {
      const light = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 16),
        new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0xff2200, emissiveIntensity: 1.6 }),
      );
      light.position.set(lx, 11.2, 0.7);
      g.add(light);
    }
    g.position.set(a.x, a.z ?? 0, a.y);
    g.rotation.y = -heading + Math.PI / 2;
    this.group.add(g);
  }
}
