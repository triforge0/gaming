import * as THREE from 'three';
import { GameEventType, IEntity, IGameEvent, IMapSnapshot, MatchPhase, Team, toNum } from '@triforge/shared-ui';
import { GameBridge } from '../net/GameBridge';
import { Terrain } from './Terrain';
import { TankMesh } from './TankMesh';
import { BulletMesh } from './BulletMesh';
import { ExplosionEffect } from './ExplosionEffect';
import { HqFireEffect } from './HqFireEffect';
import { setFromServer, teamColor } from './coords';
import {
  aimInputAxis,
  inputFlags,
  logMoveDebug,
  MOVE_DEBUG,
  radToDeg,
  turnInputAxis,
  yawErrorDeg,
} from '../debug/moveDebug';

const CAM_DISTANCE = 200;
const CAM_HEIGHT = 115;
const CAM_LERP = 0.05;
const CAM_FOV = 68;

/**
 * Owns the Three.js scene and the requestAnimationFrame loop. Every frame it reconciles the
 * live entity set from {@link GameBridge.world} into tank/bullet meshes, eases them toward
 * their latest server pose, drives the third-person follow camera, and renders. This runs
 * entirely outside React.
 */
export class SceneRoot {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly terrain = new Terrain();

  private readonly tanks = new Map<number, TankMesh>();
  private readonly bullets = new Map<number, BulletMesh>();
  private readonly explosions: ExplosionEffect[] = [];
  /** One blaze per headquarters, intensifying as the base loses HP. */
  private readonly fires: { team: number; maxHp: number; effect: HqFireEffect }[] = [];
  /** Entity ids awaiting a blast, drained each frame while their meshes still exist. */
  private readonly pendingBlasts: number[] = [];
  /** Floating diamond that hovers over the nearest visible enemy (target indicator). */
  private readonly targetMarker = new THREE.Mesh(
    new THREE.OctahedronGeometry(6),
    new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.9 }),
  );

  /** Last map snapshot the terrain was built from; a fresh snapshot object triggers a rebuild. */
  private builtMap: IMapSnapshot | null = null;
  private running = false;
  private lastTime = 0;
  private readonly scratch = new THREE.Vector3();
  private readonly camTarget = new THREE.Vector3();
  private readonly desiredCam = new THREE.Vector3();

  constructor(
    private readonly host: HTMLElement,
    private readonly bridge: GameBridge,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(0x0d1018);
    // No distance fog: the arena spans >1000 world units, so fog hazed active gameplay and
    // made the far side of the map hard to read. Keep the whole board clearly visible.

    this.camera = new THREE.PerspectiveCamera(CAM_FOV, 1, 1, 4000);
    this.camera.position.set(0, 300, 300);

    const ambient = new THREE.AmbientLight(0xb8c4e0, 0.45);
    const hemi = new THREE.HemisphereLight(0x8eb4ff, 0x2a3a28, 0.35);
    const sun = new THREE.DirectionalLight(0xfff4e6, 1.15);
    sun.position.set(280, 520, 180);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 1200;
    const shadowSpan = 420;
    sun.shadow.camera.left = -shadowSpan;
    sun.shadow.camera.right = shadowSpan;
    sun.shadow.camera.top = shadowSpan;
    sun.shadow.camera.bottom = -shadowSpan;
    sun.shadow.bias = -0.0004;
    this.targetMarker.visible = false;
    this.targetMarker.renderOrder = 9;
    this.scene.add(ambient, hemi, sun, this.terrain.group, this.targetMarker);

    this.host.appendChild(this.renderer.domElement);
    this.resize();
    window.addEventListener('resize', this.resize);

    this.bridge.onRenderEvent = (event) => this.onGameEvent(event);
  }

  /** Queue a destruction blast for the render loop when an opponent takes a fatal hit. */
  private onGameEvent(event: IGameEvent): void {
    if (event.type === GameEventType.HQ_DAMAGED || event.type === GameEventType.HQ_DESTROYED) {
      const team = toNum(event.team);
      this.fires.find((fire) => fire.team === team)?.effect.flare();
      return;
    }
    if (event.type !== GameEventType.PLAYER_DEATH && event.type !== GameEventType.PLAYER_HIT) {
      return;
    }
    const entityId = toNum(event.entityId);
    if (entityId > 0) {
      this.pendingBlasts.push(entityId);
    }
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
  }

  private frame = (now: number): void => {
    if (!this.running) return;
    const dtMs = Math.min(100, now - this.lastTime);
    this.lastTime = now;

    this.ensureMap();
    this.drainBlasts();
    this.syncEntities(dtMs);
    this.updateExplosions(dtMs);
    this.updateFires(dtMs);
    this.updateTargetMarker(now);
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.frame);
  };

  /** Spawn queued blasts at the doomed tanks' current positions before they despawn. */
  private drainBlasts(): void {
    for (const entityId of this.pendingBlasts) {
      const mesh = this.tanks.get(entityId);
      if (mesh) {
        this.scratch.copy(mesh.position);
      } else {
        const entity = this.bridge.world.entities.get(entityId);
        const pos = entity?.position;
        if (!pos) continue;
        setFromServer(this.scratch, pos.x ?? 0, pos.y ?? 0, pos.z ?? 0);
      }
      this.spawnExplosion(this.scratch);
    }
    this.pendingBlasts.length = 0;
  }

  private spawnExplosion(pos: THREE.Vector3): void {
    const blast = new ExplosionEffect();
    blast.group.position.set(pos.x, pos.y + 8, pos.z);
    this.scene.add(blast.group);
    this.explosions.push(blast);
  }

  /** Hovers the target diamond over the nearest visible enemy tank (hidden when none). */
  private updateTargetMarker(nowMs: number): void {
    const selfId = this.bridge.world.selfEntityId;
    const self = this.tanks.get(selfId);
    if (!self) {
      this.targetMarker.visible = false;
      return;
    }
    const selfTeam = this.bridge.world.entities.get(selfId)?.player?.team ?? Team.TEAM_NONE;

    let nearest: TankMesh | null = null;
    let nearestSq = Infinity;
    for (const [id, mesh] of this.tanks) {
      if (id === selfId) continue;
      const team = this.bridge.world.entities.get(id)?.player?.team ?? Team.TEAM_NONE;
      if (team === selfTeam && selfTeam !== Team.TEAM_NONE) continue; // skip allies
      const dx = mesh.position.x - self.position.x;
      const dz = mesh.position.z - self.position.z;
      const distSq = dx * dx + dz * dz;
      if (distSq < nearestSq) {
        nearestSq = distSq;
        nearest = mesh;
      }
    }

    if (!nearest) {
      this.targetMarker.visible = false;
      return;
    }
    const bob = Math.sin(nowMs * 0.005) * 3;
    this.targetMarker.position.set(nearest.position.x, nearest.position.y + 34 + bob, nearest.position.z);
    this.targetMarker.rotation.y = nowMs * 0.002;
    this.targetMarker.visible = true;
  }

  private updateExplosions(dtMs: number): void {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const blast = this.explosions[i];
      if (!blast.update(dtMs)) {
        this.scene.remove(blast.group);
        blast.dispose();
        this.explosions.splice(i, 1);
      }
    }
  }

  private ensureMap(): void {
    const map = this.bridge.world.map;
    // Rebuild whenever a new snapshot arrives — headquarters are added after lobby setup,
    // so the initial (HQ-less) map is later replaced by one carrying the bases.
    if (map && map !== this.builtMap) {
      this.terrain.build(map);
      this.builtMap = map;
      this.rebuildFires();
    }
  }

  /** Re-attaches a fire effect to each headquarters after the terrain is (re)built. */
  private rebuildFires(): void {
    for (const fire of this.fires) {
      this.scene.remove(fire.effect.group);
      fire.effect.dispose();
    }
    this.fires.length = 0;
    for (const hq of this.terrain.headquarters) {
      const effect = new HqFireEffect(hq.span);
      effect.group.position.copy(hq.center);
      this.scene.add(effect.group);
      this.fires.push({ team: hq.team, maxHp: hq.maxHp, effect });
    }
  }

  /** Drives each base's blaze from its remaining HP: more damage → bigger fire. */
  private updateFires(dtMs: number): void {
    if (this.fires.length === 0) return;
    const ui = this.bridge.snapshotUi();
    const inMatch = ui.phase === MatchPhase.PLAYING || ui.phase === MatchPhase.ENDED;
    const p = ui.phaseUpdate;
    for (const fire of this.fires) {
      let damage = 0;
      if (inMatch && p) {
        const hp =
          fire.team === Team.TEAM_RED ? toNum(p.redHqHp)
          : fire.team === Team.TEAM_BLUE ? toNum(p.blueHqHp)
          : fire.maxHp;
        damage = fire.maxHp > 0 ? 1 - hp / fire.maxHp : 0;
      }
      fire.effect.setDamage(damage);
      fire.effect.update(dtMs);
    }
  }

  private syncEntities(dtMs: number): void {
    const world = this.bridge.world;
    const seenTanks = new Set<number>();
    const seenBullets = new Set<number>();
    const input = this.bridge.inputReader?.() ?? this.bridge.lastInput;
    const turnAxis = turnInputAxis(input);
    const aimAxis = aimInputAxis(input);
    const selfId = world.selfEntityId;
    const nowMs = performance.now();
    const pingMs = this.bridge.snapshotUi().pingMs;

    for (const entity of world.entities.values()) {
      if (!entity.position) continue;
      const id = toNum(entity.entityId);
      if (entity.player) {
        seenTanks.add(id);
        this.syncTank(id, entity);
      } else if (entity.bullet) {
        seenBullets.add(id);
        this.syncBullet(id, entity);
      }
    }

    for (const [id, mesh] of this.tanks) {
      if (!seenTanks.has(id)) {
        this.scene.remove(mesh.group);
        mesh.dispose();
        this.tanks.delete(id);
      }
    }
    for (const [id, mesh] of this.bullets) {
      if (!seenBullets.has(id)) {
        this.scene.remove(mesh.mesh);
        this.bullets.delete(id);
      }
    }

    for (const [id, mesh] of this.tanks) {
      const isSelf = id === selfId;
      mesh.update({
        dtMs,
        nowMs,
        pingMs,
        isSelf,
        turnAxis: isSelf ? turnAxis : 0,
        aimAxis: isSelf ? aimAxis : 0,
      });
    }
    for (const mesh of this.bullets.values()) {
      mesh.update(this.expAlpha(dtMs, 80));
    }

    if (MOVE_DEBUG) {
      const selfMesh = this.tanks.get(selfId);
      if (selfMesh) {
        const stats = selfMesh.getRenderStats();
        const pos = selfMesh.position;
        logMoveDebug({
          tick: world.tick,
          serverYawDeg: radToDeg(stats.serverYaw),
          renderYawDeg: radToDeg(stats.renderYaw),
          aimYawDeg: radToDeg(stats.aimYaw),
          yawErrorDeg: yawErrorDeg(stats.renderYaw, stats.serverYaw),
          aimErrorDeg: yawErrorDeg(stats.renderYaw, stats.aimYaw),
          pitchDeg: radToDeg(stats.pitch),
          pos: { x: pos.x, y: pos.y, z: pos.z },
          input: inputFlags(input),
          posAlpha: stats.posAlpha,
          rotAlpha: stats.rotAlpha,
          lastServerSnapDeg: radToDeg(stats.lastServerSnapRad),
          leadMs: Math.round(stats.leadSec * 1000),
          pingMs,
        });
      }
    }
  }

  private expAlpha(dtMs: number, tauMs: number): number {
    return 1 - Math.exp(-dtMs / tauMs);
  }

  private syncTank(id: number, entity: IEntity): void {
    const pos = entity.position!;
    setFromServer(this.scratch, pos.x ?? 0, pos.y ?? 0, pos.z ?? 0);
    const yaw = entity.orientation?.yaw ?? 0;
    const pitch = entity.orientation?.pitch ?? 0;
    const isSelf = this.isSelf(id, entity);

    const color = teamColor(entity.player?.team);
    const playerName = entity.player?.name ?? 'Pilot';

    let mesh = this.tanks.get(id);
    if (!mesh) {
      mesh = new TankMesh(color, isSelf);
      mesh.setName(playerName, color);
      mesh.snapTo(this.scratch, yaw, pitch);
      this.scene.add(mesh.group);
      this.tanks.set(id, mesh);
      return;
    }
    mesh.setColor(color);
    mesh.setName(playerName, color);
    mesh.setSelf(isSelf);
    mesh.setTarget(this.scratch, yaw, pitch);
  }

  private syncBullet(id: number, entity: IEntity): void {
    const pos = entity.position!;
    setFromServer(this.scratch, pos.x ?? 0, pos.y ?? 0, pos.z ?? 0);
    let mesh = this.bullets.get(id);
    if (!mesh) {
      mesh = new BulletMesh();
      mesh.snapTo(this.scratch);
      this.scene.add(mesh.mesh);
      this.bullets.set(id, mesh);
      return;
    }
    mesh.setTarget(this.scratch);
  }

  private isSelf(id: number, entity: IEntity): boolean {
    if (id === this.bridge.world.selfEntityId) return true;
    return !!entity.player && toNum(entity.player.playerId) === this.bridge.world.selfPlayerId;
  }

  private updateCamera(): void {
    const self = this.tanks.get(this.bridge.world.selfEntityId);
    if (!self) {
      // No self yet: slow overhead orbit of the map centre.
      const map = this.bridge.world.map;
      const cx = ((map?.width ?? 20) * (map?.tileSize ?? 32)) / 2;
      const cz = ((map?.height ?? 20) * (map?.tileSize ?? 32)) / 2;
      this.camTarget.set(cx, 0, cz);
      this.desiredCam.set(cx, 400, cz + 300);
      this.camera.position.lerp(this.desiredCam, CAM_LERP);
      this.camera.lookAt(this.camTarget);
      return;
    }

    const rotY = self.yawRotation; // = -yaw
    const forwardX = Math.cos(rotY);
    const forwardZ = -Math.sin(rotY);
    this.camTarget.copy(self.position);
    this.desiredCam.set(
      self.position.x - forwardX * CAM_DISTANCE,
      self.position.y + CAM_HEIGHT,
      self.position.z - forwardZ * CAM_DISTANCE,
    );
    this.camera.position.lerp(this.desiredCam, CAM_LERP);
    this.camera.lookAt(this.camTarget);
  }

  private resize = (): void => {
    const w = this.host.clientWidth || window.innerWidth;
    const h = this.host.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resize);
    if (this.bridge.onRenderEvent) {
      this.bridge.onRenderEvent = null;
    }
    for (const mesh of this.tanks.values()) mesh.dispose();
    for (const blast of this.explosions) blast.dispose();
    this.explosions.length = 0;
    for (const fire of this.fires) fire.effect.dispose();
    this.fires.length = 0;
    this.targetMarker.geometry.dispose();
    (this.targetMarker.material as THREE.Material).dispose();
    this.terrain.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.host) {
      this.host.removeChild(this.renderer.domElement);
    }
  }
}
