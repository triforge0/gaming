import * as THREE from 'three';
import { IMapSnapshot, TileType, toNum } from '@triforge/shared-ui';
import { TileTextures } from './tileTextures';
import { buildCover, buildHq, buildSolidBlock, buildTree, buildWater } from './propMeshes';

/** Where a headquarters sits in the world, so callers can attach effects (e.g. fire) to it. */
export interface HqPlacement {
  team: number;
  center: THREE.Vector3;
  span: number;
  maxHp: number;
}

/**
 * Builds the static world from a map snapshot: a heightfield ground mesh (vertices sampled
 * at tile centres) plus textured blocks or prop meshes per tile type.
 */
export class Terrain {
  readonly group = new THREE.Group();
  /** Populated on each {@link build}; the world placement of every headquarters. */
  readonly headquarters: HqPlacement[] = [];

  build(map: IMapSnapshot): void {
    this.dispose();
    const width = map.width ?? 0;
    const height = map.height ?? 0;
    const tileSize = map.tileSize ?? 32;
    const tiles = map.tiles ?? [];
    const heights = map.heights ?? [];

    const heightAt = (tx: number, ty: number): number => {
      if (heights.length === 0) {
        return 0;
      }
      const cx = Math.max(0, Math.min(width - 1, tx));
      const cy = Math.max(0, Math.min(height - 1, ty));
      return heights[cy * width + cx] ?? 0;
    };

    this.group.add(this.buildGround(width, height, tileSize, heightAt));
    this.group.add(this.buildTiles(width, height, tileSize, tiles, heightAt));
    this.group.add(this.buildHeadquarters(width, height, tileSize, map, heightAt));
  }

  private buildHeadquarters(
    mapWidth: number,
    mapHeight: number,
    tileSize: number,
    map: IMapSnapshot,
    heightAt: (tx: number, ty: number) => number,
  ): THREE.Group {
    const group = new THREE.Group();
    for (const hq of map.headquarters ?? []) {
      const minX = hq.x ?? 0;
      const minY = hq.y ?? 0;
      const footprintW = hq.width ?? 1;
      const footprintH = hq.height ?? 1;
      const cx = (minX + minX + footprintW) * tileSize / 2;
      const cz = (minY + minY + footprintH) * tileSize / 2;

      let base = 0;
      for (let ty = minY; ty < minY + footprintH && ty < mapHeight; ty++) {
        for (let tx = minX; tx < minX + footprintW && tx < mapWidth; tx++) {
          base = Math.max(base, heightAt(tx, ty));
        }
      }

      const team = toNum(hq.team);
      const obj = buildHq(tileSize, footprintW, footprintH, team);
      obj.position.set(cx, base, cz);
      group.add(obj);

      this.headquarters.push({
        team,
        center: new THREE.Vector3(cx, base, cz),
        span: tileSize * Math.max(footprintW, footprintH),
        maxHp: toNum(hq.maxHp) || 1,
      });
    }
    return group;
  }

  private buildGround(
    width: number,
    height: number,
    tileSize: number,
    heightAt: (tx: number, ty: number) => number,
  ): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const cx = tx * tileSize + tileSize / 2;
        const cy = ty * tileSize + tileSize / 2;
        positions.push(cx, heightAt(tx, ty), cy);
        uvs.push(cx / tileSize / 3, cy / tileSize / 3);
      }
    }
    const indices: number[] = [];
    const idx = (tx: number, ty: number) => ty * width + tx;
    for (let ty = 0; ty < height - 1; ty++) {
      for (let tx = 0; tx < width - 1; tx++) {
        const a = idx(tx, ty);
        const b = idx(tx + 1, ty);
        const c = idx(tx, ty + 1);
        const d = idx(tx + 1, ty + 1);
        indices.push(a, c, b, b, c, d);
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = TileTextures.grassMaterial();
    TileTextures.applyGrassRepeat(material, width, height);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
  }

  private buildTiles(
    width: number,
    height: number,
    tileSize: number,
    tiles: number[],
    heightAt: (tx: number, ty: number) => number,
  ): THREE.Group {
    const group = new THREE.Group();
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const tile = tiles[ty * width + tx] ?? TileType.EMPTY;
        if (tile === TileType.EMPTY || tile === TileType.HQ) {
          continue;
        }

        const base = heightAt(tx, ty);
        const cx = tx * tileSize + tileSize / 2;
        const cz = ty * tileSize + tileSize / 2;
        const obj = this.createTileObject(tile, tileSize);
        if (!obj) continue;

        const yOffset = this.tileYOffset(tile, tileSize);
        obj.position.set(cx, base + yOffset, cz);
        group.add(obj);
      }
    }
    return group;
  }

  private createTileObject(tile: number, tileSize: number): THREE.Object3D | null {
    switch (tile) {
      case TileType.BRICK:
      case TileType.STEEL:
      case TileType.WALL:
        return buildSolidBlock(tileSize, tile);
      case TileType.WATER:
        return buildWater(tileSize);
      case TileType.TREE:
        return buildTree(tileSize);
      case TileType.COVER:
        return buildCover(tileSize);
      default:
        return null;
    }
  }

  /** Vertical anchor offset so props sit on the terrain surface. */
  private tileYOffset(tile: number, tileSize: number): number {
    switch (tile) {
      case TileType.WATER:
        return tileSize * 0.06;
      case TileType.TREE:
      case TileType.COVER:
        return 0;
      default:
        return tileSize / 2;
    }
  }

  dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    });
    this.group.clear();
    this.headquarters.length = 0;
  }
}
