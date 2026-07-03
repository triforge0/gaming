import * as THREE from 'three';

const FLASH_COLOR = 0xfff2c0;
const FIRE_COLOR = 0xff6a1a;
const SMOKE_COLOR = 0x2a2622;

interface Shard {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  spin: THREE.Vector3;
}

/**
 * A short-lived blast played when a tank is destroyed: a bright flash, an expanding fireball,
 * a ground shockwave ring, tumbling debris shards and a point-light burst. Built entirely from
 * throwaway geometry/materials that are disposed once the effect finishes.
 *
 * Positioned by the caller (its {@link group} centre = the hit point). {@link update} advances
 * the animation and returns {@code false} once the effect has fully faded.
 */
export class ExplosionEffect {
  readonly group = new THREE.Group();

  private readonly durationMs: number;
  private ageMs = 0;

  private readonly flash: THREE.Mesh;
  private readonly fireball: THREE.Mesh;
  private readonly shockwave: THREE.Mesh;
  private readonly light: THREE.PointLight;
  private readonly shards: Shard[] = [];
  private readonly smoke: THREE.Mesh[] = [];

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];

  constructor(scale = 20, durationMs = 850) {
    this.durationMs = durationMs;

    this.flash = this.mesh(
      new THREE.IcosahedronGeometry(scale * 0.55, 1),
      this.additive(FLASH_COLOR, 1),
    );

    this.fireball = this.mesh(
      new THREE.IcosahedronGeometry(scale * 0.5, 1),
      this.additive(FIRE_COLOR, 0.95),
    );

    this.shockwave = this.mesh(
      new THREE.RingGeometry(scale * 0.35, scale * 0.55, 24),
      this.additive(FIRE_COLOR, 0.7, THREE.DoubleSide),
    );
    this.shockwave.rotation.x = -Math.PI / 2;
    this.shockwave.position.y = scale * 0.08;

    this.light = new THREE.PointLight(FIRE_COLOR, 3.5, scale * 9, 2);
    this.group.add(this.flash, this.fireball, this.shockwave, this.light);

    const shardGeom = new THREE.TetrahedronGeometry(scale * 0.12);
    this.geometries.push(shardGeom);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x201a16,
      emissive: FIRE_COLOR,
      emissiveIntensity: 0.6,
      roughness: 0.8,
    });
    this.materials.push(shardMat);
    for (let i = 0; i < 9; i++) {
      const mesh = new THREE.Mesh(shardGeom, shardMat);
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 0.9 + 0.4,
        Math.random() * 2 - 1,
      ).normalize();
      const speed = scale * (2.6 + Math.random() * 2.4);
      this.shards.push({
        mesh,
        vel: dir.multiplyScalar(speed),
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
        ),
      });
      this.group.add(mesh);
    }

    for (let i = 0; i < 4; i++) {
      const puff = this.mesh(
        new THREE.IcosahedronGeometry(scale * (0.28 + Math.random() * 0.18), 0),
        new THREE.MeshStandardMaterial({
          color: SMOKE_COLOR,
          transparent: true,
          opacity: 0.7,
          roughness: 1,
        }),
      );
      puff.position.set(
        (Math.random() - 0.5) * scale * 0.6,
        scale * 0.2,
        (Math.random() - 0.5) * scale * 0.6,
      );
      puff.userData.rise = scale * (1.1 + Math.random() * 0.8);
      this.smoke.push(puff);
    }
  }

  /** Advances the animation by {@code dtMs}. Returns false once fully faded. */
  update(dtMs: number): boolean {
    this.ageMs += dtMs;
    const t = Math.min(1, this.ageMs / this.durationMs);
    const dt = dtMs / 1000;

    // Flash: snappy pop in the first ~15% of life, then gone.
    const flashT = Math.min(1, t / 0.15);
    const flashScale = 0.6 + flashT * 1.4;
    this.flash.scale.setScalar(flashScale);
    (this.flash.material as THREE.Material).opacity = (1 - flashT) * 1;
    this.flash.visible = flashT < 1;

    // Fireball: expands and fades over the full life.
    const fireScale = 0.5 + t * 2.2;
    this.fireball.scale.setScalar(fireScale);
    (this.fireball.material as THREE.Material).opacity = Math.pow(1 - t, 1.6);

    // Shockwave: flat ring racing outward along the ground.
    const shockScale = 0.6 + t * 4.5;
    this.shockwave.scale.setScalar(shockScale);
    (this.shockwave.material as THREE.Material).opacity = Math.pow(1 - t, 2) * 0.7;

    // Light: bright burst decaying quickly.
    this.light.intensity = 3.5 * Math.pow(1 - t, 2);

    // Debris: ballistic arcs with gravity + spin, fading late.
    for (const shard of this.shards) {
      shard.vel.y -= 60 * dt;
      shard.mesh.position.addScaledVector(shard.vel, dt);
      shard.mesh.rotation.x += shard.spin.x * dt;
      shard.mesh.rotation.y += shard.spin.y * dt;
      shard.mesh.rotation.z += shard.spin.z * dt;
      shard.mesh.visible = t < 0.9;
    }

    // Smoke: drifts up, swells and thins out.
    for (const puff of this.smoke) {
      puff.position.y += (puff.userData.rise as number) * dt;
      puff.scale.setScalar(1 + t * 1.6);
      (puff.material as THREE.Material).opacity = (1 - t) * 0.7;
    }

    return t < 1;
  }

  dispose(): void {
    for (const geom of this.geometries) geom.dispose();
    for (const mat of this.materials) mat.dispose();
    this.group.clear();
  }

  private mesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    this.geometries.push(geometry);
    this.materials.push(material);
    return new THREE.Mesh(geometry, material);
  }

  private additive(color: number, opacity: number, side: THREE.Side = THREE.FrontSide): THREE.Material {
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side,
    });
  }
}
