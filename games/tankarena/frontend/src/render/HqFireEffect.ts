import * as THREE from 'three';

const FLAME_CORE = 0xffe08a; // bright yellow core
const FLAME_MID = 0xff7a1a; // orange body
const FLAME_OUTER = 0xd6320f; // deep red tongues
const EMBER_COLOR = 0xffc266;
const SMOKE_COLOR = 0x141210;
const FLARE_DURATION_MS = 420;

interface Flame {
  mesh: THREE.Mesh;
  baseX: number;
  baseZ: number;
  radius: number;
  maxHeight: number;
  phase: number;
  speed: number;
}

interface Ember {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  ttl: number;
  active: boolean;
}

interface Puff {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  life: number;
  ttl: number;
  rise: number;
  active: boolean;
}

/**
 * A persistent blaze that engulfs a headquarters as it is battered. Driven by
 * {@link setDamage} (0 = untouched, 1 = destroyed): as damage climbs the flames grow taller
 * and wider, the ember/smoke output ramps up and the glow brightens. Built from pooled,
 * throwaway geometry so nothing allocates per frame.
 *
 * Positioned by the caller (its {@link group} origin = the base of the HQ, y = ground).
 */
export class HqFireEffect {
  readonly group = new THREE.Group();

  private target = 0;
  private shown = 0;
  private flareLevel = 0;
  private ageMs = 0;
  private emberTimer = 0;
  private puffTimer = 0;

  private readonly span: number;
  private readonly flames: Flame[] = [];
  private readonly embers: Ember[] = [];
  private readonly puffs: Puff[] = [];
  private readonly light: THREE.PointLight;
  private readonly flash: THREE.Mesh;

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];

  constructor(span: number) {
    this.span = span;

    const coneGeom = new THREE.ConeGeometry(1, 1, 6);
    this.geometries.push(coneGeom);
    const flameMats = [
      this.additive(FLAME_OUTER, 0.7),
      this.additive(FLAME_MID, 0.85),
      this.additive(FLAME_CORE, 0.95),
    ];

    // A ring of tongues around the footprint plus a taller core flame in the middle.
    const count = 9;
    for (let i = 0; i < count; i++) {
      const central = i === count - 1;
      const angle = (i / (count - 1)) * Math.PI * 2;
      const dist = central ? 0 : span * (0.18 + Math.random() * 0.24);
      const material = central ? flameMats[2] : flameMats[i % 2];
      const mesh = new THREE.Mesh(coneGeom, material);
      mesh.renderOrder = 8;
      this.flames.push({
        mesh,
        baseX: Math.cos(angle) * dist,
        baseZ: Math.sin(angle) * dist,
        radius: span * (central ? 0.22 : 0.1 + Math.random() * 0.06),
        maxHeight: span * (central ? 1.25 : 0.6 + Math.random() * 0.5),
        phase: Math.random() * Math.PI * 2,
        speed: 6 + Math.random() * 6,
      });
      this.group.add(mesh);
    }

    const emberGeom = new THREE.TetrahedronGeometry(span * 0.045);
    this.geometries.push(emberGeom);
    const emberMat = this.additive(EMBER_COLOR, 0.9);
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(emberGeom, emberMat);
      mesh.visible = false;
      mesh.renderOrder = 9;
      this.embers.push({ mesh, vel: new THREE.Vector3(), life: 0, ttl: 0, active: false });
      this.group.add(mesh);
    }

    const puffGeom = new THREE.IcosahedronGeometry(span * 0.16, 0);
    this.geometries.push(puffGeom);
    for (let i = 0; i < 5; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: SMOKE_COLOR,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      this.materials.push(material);
      const mesh = new THREE.Mesh(puffGeom, material);
      mesh.visible = false;
      this.puffs.push({ mesh, material, life: 0, ttl: 0, rise: 0, active: false });
      this.group.add(mesh);
    }

    this.light = new THREE.PointLight(FLAME_MID, 0, span * 7, 2);
    this.light.position.y = span * 0.3;
    this.group.add(this.light);

    const flashGeom = new THREE.IcosahedronGeometry(span * 0.4, 1);
    this.geometries.push(flashGeom);
    this.flash = new THREE.Mesh(flashGeom, this.additive(FLAME_CORE, 0.9));
    this.flash.position.y = span * 0.4;
    this.flash.visible = false;
    this.flash.renderOrder = 10;
    this.group.add(this.flash);

    this.group.visible = false;
  }

  /** Sets the target blaze intensity from the base's damage fraction (0..1). */
  setDamage(t: number): void {
    this.target = Math.max(0, Math.min(1, t));
  }

  /** A one-shot burst played the instant the base is hit, before the HP-driven fire catches up. */
  flare(): void {
    this.flareLevel = 1;
    for (let i = 0; i < 6; i++) {
      this.spawnEmber(1);
    }
  }

  update(dtMs: number): void {
    this.ageMs += dtMs;
    const dt = dtMs / 1000;
    // Ease toward the target so a fresh hit makes the fire flare up rather than jump.
    this.shown += (this.target - this.shown) * Math.min(1, dt * 2.5);
    const intensity = this.shown;
    if (this.flareLevel > 0) {
      this.flareLevel = Math.max(0, this.flareLevel - dtMs / FLARE_DURATION_MS);
    }

    // A flare keeps the group visible even before the HP-driven fire has ramped up.
    this.group.visible = intensity > 0.01 || this.flareLevel > 0.01;
    if (!this.group.visible) {
      return;
    }

    if (this.flareLevel > 0.01) {
      this.flash.visible = true;
      this.flash.scale.setScalar(0.6 + (1 - this.flareLevel) * 1.3); // pops outward as it fades
      (this.flash.material as THREE.Material).opacity = this.flareLevel * 0.9;
    } else {
      this.flash.visible = false;
    }

    for (const flame of this.flames) {
      const flick =
        0.72 + 0.28 * Math.sin(this.ageMs * 0.001 * flame.speed + flame.phase) + (Math.random() - 0.5) * 0.08;
      const h = Math.max(0.001, intensity * flame.maxHeight * flick);
      const r = flame.radius * (0.55 + 0.45 * intensity) * (0.85 + 0.15 * flick);
      flame.mesh.scale.set(r, h, r);
      flame.mesh.position.set(flame.baseX, h * 0.5, flame.baseZ);
      flame.mesh.visible = intensity > 0.02;
    }

    // Glow brightens and lifts as the fire grows.
    const lightFlick = 0.82 + 0.18 * Math.sin(this.ageMs * 0.012);
    this.light.intensity = intensity * (1.6 + 2.4 * intensity) * lightFlick + this.flareLevel * 3;
    this.light.position.y = this.span * (0.28 + 0.32 * intensity);

    this.updateEmbers(dtMs, dt, intensity);
    this.updateSmoke(dtMs, dt, intensity);
  }

  private updateEmbers(dtMs: number, dt: number, intensity: number): void {
    this.emberTimer -= dtMs;
    if (intensity > 0.12 && this.emberTimer <= 0) {
      this.emberTimer = 130 - 100 * intensity; // faster spray as it worsens
      this.spawnEmber(intensity);
    }
    for (const ember of this.embers) {
      if (!ember.active) continue;
      ember.life += dtMs;
      const frac = ember.life / ember.ttl;
      if (frac >= 1) {
        ember.active = false;
        ember.mesh.visible = false;
        continue;
      }
      ember.vel.y -= this.span * 0.3 * dt; // gentle arc
      ember.mesh.position.addScaledVector(ember.vel, dt);
      ember.mesh.scale.setScalar(Math.max(0.001, 1 - frac));
    }
  }

  private spawnEmber(intensity: number): void {
    const ember = this.embers.find((e) => !e.active);
    if (!ember) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * this.span * 0.35;
    ember.mesh.position.set(Math.cos(angle) * dist, this.span * 0.2, Math.sin(angle) * dist);
    ember.vel.set(
      (Math.random() - 0.5) * this.span * 0.8,
      this.span * (1.4 + Math.random() * 1.4 + intensity),
      (Math.random() - 0.5) * this.span * 0.8,
    );
    ember.ttl = 500 + Math.random() * 600;
    ember.life = 0;
    ember.active = true;
    ember.mesh.visible = true;
    ember.mesh.scale.setScalar(1);
  }

  private updateSmoke(dtMs: number, dt: number, intensity: number): void {
    this.puffTimer -= dtMs;
    if (intensity > 0.4 && this.puffTimer <= 0) {
      this.puffTimer = 320 - 180 * intensity;
      this.spawnPuff(intensity);
    }
    for (const puff of this.puffs) {
      if (!puff.active) continue;
      puff.life += dtMs;
      const frac = puff.life / puff.ttl;
      if (frac >= 1) {
        puff.active = false;
        puff.mesh.visible = false;
        continue;
      }
      puff.mesh.position.y += puff.rise * dt;
      puff.mesh.scale.setScalar(0.6 + frac * 1.8);
      puff.material.opacity = Math.sin(frac * Math.PI) * 0.5 * intensity;
    }
  }

  private spawnPuff(intensity: number): void {
    const puff = this.puffs.find((p) => !p.active);
    if (!puff) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * this.span * 0.25;
    puff.mesh.position.set(Math.cos(angle) * dist, this.span * (0.6 + 0.4 * intensity), Math.sin(angle) * dist);
    puff.rise = this.span * (1.1 + Math.random() * 0.8);
    puff.ttl = 900 + Math.random() * 700;
    puff.life = 0;
    puff.active = true;
    puff.mesh.visible = true;
  }

  dispose(): void {
    for (const geom of this.geometries) geom.dispose();
    for (const mat of this.materials) mat.dispose();
    this.group.clear();
  }

  private additive(color: number, opacity: number): THREE.Material {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.materials.push(material);
    return material;
  }
}
