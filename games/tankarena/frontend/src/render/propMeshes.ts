import * as THREE from 'three';
import { Team } from '@triforge/shared-ui';
import { TileTextures } from './tileTextures';
import { teamColor } from './coords';
import { TileType } from '@triforge/shared-ui';

const TRUNK = new THREE.MeshStandardMaterial({ color: 0x5c3d22, roughness: 0.95, metalness: 0 });
const FOLIAGE = new THREE.MeshStandardMaterial({ color: 0x2d8a3e, roughness: 0.9, metalness: 0 });
const BUSH = new THREE.MeshStandardMaterial({ color: 0x3a9a48, roughness: 0.95, metalness: 0 });

function texturedBlock(
  width: number,
  blockHeight: number,
  depth: number,
  tile: number,
): THREE.Mesh {
  const mat = TileTextures.materialFor(tile);
  const geometry = new THREE.BoxGeometry(width, blockHeight, depth);
  const mesh = new THREE.Mesh(
    geometry,
    mat ?? new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9 }),
  );
  if (mat) {
    TileTextures.applyRepeat(mat, Math.max(width, depth) / 32);
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

const HQ_STEEL = new THREE.MeshStandardMaterial({
  color: 0x2b3038,
  roughness: 0.6,
  metalness: 0.45,
});

/**
 * HQ "command bastion" spanning a tile footprint (typically 2×2): a stepped steel plinth,
 * a textured keep flanked by four corner buttresses, glowing team-coloured window slits and
 * a rooftop reactor core + flag. The team accent glows so friend/foe bases read instantly
 * from the follow camera.
 */
export function buildHq(
  tileSize: number,
  footprintW = 1,
  footprintH = 1,
  team: number = Team.TEAM_NONE,
): THREE.Group {
  const group = new THREE.Group();
  const accent = teamColor(team);
  const spanW = tileSize * footprintW;
  const spanD = tileSize * footprintH;
  const scale = Math.max(footprintW, footprintH);
  const bodyH = tileSize * (0.7 + Math.min(footprintW, footprintH) * 0.12);

  const accentMat = (intensity: number, opts: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: intensity,
      roughness: 0.5,
      metalness: 0.2,
      ...opts,
    });

  // Glowing team-accent foundation slab.
  const pad = new THREE.Mesh(
    new THREE.BoxGeometry(spanW * 1.02, tileSize * 0.1, spanD * 1.02),
    accentMat(0.3, { roughness: 0.85, metalness: 0.08 }),
  );
  pad.position.y = tileSize * 0.05;
  pad.receiveShadow = true;

  // Dark steel plinth — the first step up from the pad.
  const plinthH = tileSize * 0.22;
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(spanW * 0.92, plinthH, spanD * 0.92),
    HQ_STEEL,
  );
  plinth.position.y = tileSize * 0.1 + plinthH / 2;
  plinth.castShadow = true;
  plinth.receiveShadow = true;

  // Main keep with the HQ texture, stepped in from the plinth.
  const keepBase = tileSize * 0.1 + plinthH;
  const keepW = spanW * 0.72;
  const keepD = spanD * 0.72;
  const body = texturedBlock(keepW, bodyH, keepD, TileType.HQ);
  body.position.y = keepBase + bodyH / 2;
  body.castShadow = true;
  body.receiveShadow = true;

  // Glowing accent band recessed near the top of the keep.
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(keepW * 1.02, bodyH * 0.12, keepD * 1.02),
    accentMat(0.55),
  );
  band.position.y = keepBase + bodyH * 0.82;

  group.add(pad, plinth, body, band);

  // Vertical window slits glowing on each of the four faces.
  const slitMat = accentMat(0.9, { roughness: 0.3, metalness: 0.1 });
  const slitH = bodyH * 0.42;
  const slitY = keepBase + bodyH * 0.5;
  const slitGeom = new THREE.BoxGeometry(tileSize * 0.06, slitH, tileSize * 0.06);
  for (const face of [
    { x: 0, z: keepD / 2 + 0.4, along: 'x', extent: keepW },
    { x: 0, z: -keepD / 2 - 0.4, along: 'x', extent: keepW },
    { x: keepW / 2 + 0.4, z: 0, along: 'z', extent: keepD },
    { x: -keepW / 2 - 0.4, z: 0, along: 'z', extent: keepD },
  ] as const) {
    for (const t of [-0.28, 0, 0.28]) {
      const slit = new THREE.Mesh(slitGeom, slitMat);
      const off = t * face.extent;
      slit.position.set(
        face.x + (face.along === 'x' ? off : 0),
        slitY,
        face.z + (face.along === 'z' ? off : 0),
      );
      group.add(slit);
    }
  }

  // Four dark-steel corner buttresses capped with an accent light.
  const buttressH = bodyH + plinthH + tileSize * 0.18;
  const buttressGeom = new THREE.BoxGeometry(tileSize * 0.22, buttressH, tileSize * 0.22);
  const capGeom = new THREE.BoxGeometry(tileSize * 0.26, tileSize * 0.08, tileSize * 0.26);
  const capMat = accentMat(0.7);
  const cornerX = spanW * 0.42;
  const cornerZ = spanD * 0.42;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const buttress = new THREE.Mesh(buttressGeom, HQ_STEEL);
      buttress.position.set(sx * cornerX, tileSize * 0.1 + buttressH / 2, sz * cornerZ);
      buttress.castShadow = true;
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.set(sx * cornerX, tileSize * 0.1 + buttressH + tileSize * 0.04, sz * cornerZ);
      group.add(buttress, cap);
    }
  }

  // Rooftop deck + glowing reactor core (replaces the old eagle emblem).
  const roofY = keepBase + bodyH;
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(keepW * 0.6, tileSize * 0.14, keepD * 0.6),
    HQ_STEEL,
  );
  deck.position.y = roofY + tileSize * 0.07;
  deck.castShadow = true;

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(tileSize * 0.2 * scale, 0),
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 1.4,
      roughness: 0.25,
      metalness: 0.1,
    }),
  );
  core.position.y = roofY + tileSize * 0.32 * scale;
  core.castShadow = true;

  // Accent beacon so the core casts a coloured glow onto the keep at night.
  const beacon = new THREE.PointLight(accent, 0.9, tileSize * 4, 2);
  beacon.position.y = core.position.y;

  group.add(deck, core, beacon);

  // Flag on a corner mast.
  const mastH = tileSize * 0.5;
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, mastH, 6),
    new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.5, roughness: 0.4 }),
  );
  pole.position.set(cornerX, tileSize * 0.1 + buttressH + mastH / 2, -cornerZ);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(tileSize * 0.3 * scale, tileSize * 0.18 * scale),
    accentMat(0.35, { side: THREE.DoubleSide, roughness: 0.8, metalness: 0 }),
  );
  flag.position.set(
    cornerX + tileSize * 0.15 * scale,
    tileSize * 0.1 + buttressH + mastH * 0.78,
    -cornerZ,
  );
  flag.rotation.y = -Math.PI / 6;

  group.add(pole, flag);
  return group;
}

/** Shallow water slab with animated-looking surface texture. */
export function buildWater(tileSize: number): THREE.Mesh {
  const blockHeight = tileSize * 0.12;
  const mesh = texturedBlock(tileSize, blockHeight, tileSize, TileType.WATER);
  mesh.receiveShadow = true;
  return mesh;
}

/** Textured solid block (brick, steel, wall). */
export function buildSolidBlock(tileSize: number, tile: number): THREE.Mesh {
  const mesh = texturedBlock(tileSize, tileSize, tileSize, tile);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
