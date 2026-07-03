import * as THREE from 'three';
import { TileTextures } from './tileTextures';
import { TileType } from '@triforge/shared-ui';

const TRUNK = new THREE.MeshStandardMaterial({ color: 0x5c3d22, roughness: 0.95, metalness: 0 });
const FOLIAGE = new THREE.MeshStandardMaterial({ color: 0x2d8a3e, roughness: 0.9, metalness: 0 });
const BUSH = new THREE.MeshStandardMaterial({ color: 0x3a9a48, roughness: 0.95, metalness: 0 });

function texturedBlock(tileSize: number, blockHeight: number, tile: number): THREE.Mesh {
  const mat = TileTextures.materialFor(tile);
  const geometry = new THREE.BoxGeometry(tileSize, blockHeight, tileSize);
  const mesh = new THREE.Mesh(
    geometry,
    mat ?? new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9 }),
  );
  if (mat) {
    TileTextures.applyRepeat(mat, 1);
  }
  return mesh;
}

/** Low-poly tree: trunk + layered cones. */
export function buildTree(tileSize: number): THREE.Group {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(tileSize * 0.12, tileSize * 0.16, tileSize * 0.45, 8),
    TRUNK,
  );
  trunk.position.y = tileSize * 0.22;
  trunk.castShadow = true;

  const canopy = new THREE.Group();
  const layers = [
    { r: tileSize * 0.42, h: tileSize * 0.38, y: tileSize * 0.52 },
    { r: tileSize * 0.32, h: tileSize * 0.32, y: tileSize * 0.78 },
    { r: tileSize * 0.2, h: tileSize * 0.24, y: tileSize * 0.98 },
  ];
  for (const layer of layers) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(layer.r, layer.h, 8), FOLIAGE);
    cone.position.y = layer.y;
    cone.castShadow = true;
    canopy.add(cone);
  }

  group.add(trunk, canopy);
  return group;
}

/** Bush cluster for cover tiles. */
export function buildCover(tileSize: number): THREE.Group {
  const group = new THREE.Group();
  const blobs = [
    { x: 0, z: 0, s: 0.38 },
    { x: tileSize * 0.18, z: -tileSize * 0.12, s: 0.28 },
    { x: -tileSize * 0.16, z: tileSize * 0.14, s: 0.26 },
  ];
  for (const blob of blobs) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(tileSize * blob.s, 10, 8),
      BUSH,
    );
    mesh.position.set(blob.x, tileSize * blob.s * 0.75, blob.z);
    mesh.scale.y = 0.75;
    mesh.castShadow = true;
    group.add(mesh);
  }
  return group;
}

/** HQ building with textured walls and a simple roof. */
export function buildHq(tileSize: number): THREE.Group {
  const group = new THREE.Group();
  const bodyH = tileSize * 0.72;
  const body = texturedBlock(tileSize * 0.88, bodyH, TileType.HQ);
  body.position.y = bodyH / 2;

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(tileSize * 0.52, tileSize * 0.22, 4),
    new THREE.MeshStandardMaterial({ color: 0x8a2020, roughness: 0.85, metalness: 0.05 }),
  );
  roof.position.y = bodyH + tileSize * 0.08;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, tileSize * 0.35, 6),
    new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.4, roughness: 0.5 }),
  );
  pole.position.set(tileSize * 0.28, bodyH + tileSize * 0.28, -tileSize * 0.28);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(tileSize * 0.22, tileSize * 0.14),
    new THREE.MeshStandardMaterial({ color: 0xffd166, side: THREE.DoubleSide, roughness: 0.8 }),
  );
  flag.position.set(tileSize * 0.38, bodyH + tileSize * 0.34, -tileSize * 0.28);
  flag.rotation.y = -Math.PI / 6;

  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body, roof, pole, flag);
  return group;
}

/** Shallow water slab with animated-looking surface texture. */
export function buildWater(tileSize: number): THREE.Mesh {
  const blockHeight = tileSize * 0.12;
  const mesh = texturedBlock(tileSize, blockHeight, TileType.WATER);
  mesh.receiveShadow = true;
  return mesh;
}

/** Textured solid block (brick, steel, wall). */
export function buildSolidBlock(tileSize: number, tile: number): THREE.Mesh {
  const mesh = texturedBlock(tileSize, tileSize, tile);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
