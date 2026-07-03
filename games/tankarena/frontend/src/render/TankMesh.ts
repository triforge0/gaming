import * as THREE from 'three';
import { yawToThreeRotationY } from './coords';
import { NameLabel } from './NameLabel';

/** Match {@link MovementSystem} TURN_RATE / PITCH_RATE on the server. */
const TURN_RATE_RAD_S = Math.PI / 2;
const PITCH_RATE_RAD_S = Math.PI / 4;
const POS_INTERP_MS = 80;
const ROT_INTERP_MS = 28;
const ROT_INTERP_TURN_MS = 42;
const ROT_INTERP_IDLE_MS = 20;
const SERVER_TICK_SEC = 1 / 60;
const MIN_PITCH = (-20 * Math.PI) / 180;
const MAX_PITCH = (60 * Math.PI) / 180;

const TRACK = new THREE.MeshStandardMaterial({ color: 0x1e1f22, roughness: 0.92, metalness: 0.08 });
const RUBBER = new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.98, metalness: 0 });
const GUN_METAL = new THREE.MeshStandardMaterial({ color: 0x2a2d32, roughness: 0.35, metalness: 0.65 });
const DARK = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.7, metalness: 0.2 });

export interface TankUpdateOpts {
  isSelf?: boolean;
  turnAxis?: -1 | 0 | 1;
  aimAxis?: -1 | 0 | 1;
  dtMs?: number;
  nowMs?: number;
  pingMs?: number;
}

export interface TankRenderStats {
  serverYaw: number;
  renderYaw: number;
  aimYaw: number;
  pitch: number;
  posAlpha: number;
  rotAlpha: number;
  lastServerSnapRad: number;
  leadSec: number;
}

function shortestAngleLerp(from: number, to: number, t: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta * t;
}

function shortestAngleDelta(from: number, to: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function expAlpha(dtMs: number, tauMs: number): number {
  return 1 - Math.exp(-dtMs / tauMs);
}

function teamMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.28,
  });
}

function addShadow(mesh: THREE.Mesh): THREE.Mesh {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function buildTankBody(teamColor: number): {
  root: THREE.Group;
  turret: THREE.Group;
  teamMaterials: THREE.MeshStandardMaterial[];
} {
  const root = new THREE.Group();
  const turret = new THREE.Group();
  const teamMaterials: THREE.MeshStandardMaterial[] = [];
  const paint = teamMaterial(teamColor);
  teamMaterials.push(paint);
  const paintLight = teamMaterial(teamColor);
  paintLight.color.offsetHSL(0, 0, 0.08);
  teamMaterials.push(paintLight);

  const trackLen = 26;
  const trackH = 5;
  const trackW = 4.5;
  for (const z of [-10.5, 10.5]) {
    const track = addShadow(new THREE.Mesh(new THREE.BoxGeometry(trackLen, trackH, trackW), TRACK));
    track.position.set(0, trackH / 2, z);
    root.add(track);

    for (let i = -2; i <= 2; i++) {
      const wheel = addShadow(
        new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, trackW + 0.4, 10), RUBBER),
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(i * 5.5, trackH / 2, z);
      root.add(wheel);
    }
  }

  const hull = addShadow(new THREE.Mesh(new THREE.BoxGeometry(22, 7, 18), paint));
  hull.position.set(-1, 7.5, 0);
  root.add(hull);

  const glacis = addShadow(new THREE.Mesh(new THREE.BoxGeometry(8, 5, 18), paintLight));
  glacis.position.set(9, 6.5, 0);
  glacis.rotation.z = -0.28;
  root.add(glacis);

  const rear = addShadow(new THREE.Mesh(new THREE.BoxGeometry(5, 4, 16), paint));
  rear.position.set(-11, 7, 0);
  root.add(rear);

  const skirt = addShadow(new THREE.Mesh(new THREE.BoxGeometry(20, 2.5, 19), DARK));
  skirt.position.set(-1, 4.2, 0);
  root.add(skirt);

  const turretBase = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8.5, 4.5, 10), paint),
  );
  turretBase.position.set(-1, 2.2, 0);
  turret.add(turretBase);

  const turretDome = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(6.5, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), paintLight),
  );
  turretDome.position.set(-1, 4.5, 0);
  turret.add(turretDome);

  const mantlet = addShadow(new THREE.Mesh(new THREE.BoxGeometry(3, 3.5, 4), GUN_METAL));
  mantlet.position.set(4, 3.8, 0);
  turret.add(mantlet);

  const barrel = addShadow(
    new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 22, 10), GUN_METAL),
  );
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(14, 3.8, 0);
  turret.add(barrel);

  const muzzle = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.4, 2.5, 10), GUN_METAL));
  muzzle.rotation.z = Math.PI / 2;
  muzzle.position.set(25.5, 3.8, 0);
  turret.add(muzzle);

  const hatch = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1, 8), DARK));
  hatch.position.set(-2, 5.2, 0);
  turret.add(hatch);

  turret.position.y = 11;
  root.add(turret);

  return { root, turret, teamMaterials };
}

/**
 * One tank: tracked hull with turret group pitched by aim.
 * Forward is local +X so {@link yawToThreeRotationY} orients it.
 */
export class TankMesh {
  readonly group = new THREE.Group();
  private readonly turret: THREE.Group;
  private readonly teamMaterials: THREE.MeshStandardMaterial[];
  private readonly selfRing: THREE.Mesh;
  private readonly nameLabel: NameLabel;

  private targetPos = new THREE.Vector3();
  private targetYawRotation = 0;
  private targetPitch = 0;
  private targetServerYaw = 0;
  private targetServerPitch = 0;
  private serverPoseAtMs = 0;
  private aimYaw = 0;
  private leadSec = 0;
  private currentYawRotation = 0;
  private currentPitch = 0;
  private lastServerSnapRad = 0;
  private lastPosAlpha = 0;
  private lastRotAlpha = 0;

  constructor(color: number, isSelf: boolean) {
    const body = buildTankBody(color);
    this.group.add(body.root);
    this.turret = body.turret;
    this.teamMaterials = body.teamMaterials;

    this.selfRing = new THREE.Mesh(
      new THREE.RingGeometry(16, 18, 32),
      new THREE.MeshBasicMaterial({
        color: 0x3ddc84,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      }),
    );
    this.selfRing.rotation.x = -Math.PI / 2;
    this.selfRing.position.y = 0.8;
    this.selfRing.visible = isSelf;
    this.group.add(this.selfRing);

    this.nameLabel = new NameLabel();
    this.group.add(this.nameLabel.sprite);
  }

  setName(name: string, color: number): void {
    this.nameLabel.set(name, color);
  }

  setSelf(isSelf: boolean): void {
    this.selfRing.visible = isSelf;
  }

  setColor(color: number): void {
    const base = new THREE.Color(color);
    this.teamMaterials[0]?.color.copy(base);
    this.teamMaterials[1]?.color.copy(base).offsetHSL(0, 0, 0.08);
  }

  snapTo(pos: THREE.Vector3, yaw: number, pitch: number): void {
    this.targetPos.copy(pos);
    this.group.position.copy(pos);
    this.targetServerYaw = yaw;
    this.targetServerPitch = pitch;
    this.serverPoseAtMs = performance.now();
    this.aimYaw = yaw;
    this.targetYawRotation = yawToThreeRotationY(yaw);
    this.currentYawRotation = this.targetYawRotation;
    this.targetPitch = pitch;
    this.currentPitch = pitch;
    this.group.rotation.y = this.currentYawRotation;
    this.turret.rotation.z = this.currentPitch;
    this.lastServerSnapRad = 0;
    this.leadSec = 0;
  }

  setTarget(pos: THREE.Vector3, yaw: number, pitch: number): void {
    const snapRad = Math.abs(shortestAngleDelta(this.targetServerYaw, yaw));
    this.lastServerSnapRad = snapRad;
    if (snapRad > 1e-5 || Math.abs(this.targetServerPitch - pitch) > 1e-5) {
      this.serverPoseAtMs = performance.now();
    }
    this.targetServerYaw = yaw;
    this.targetServerPitch = pitch;
    this.targetPos.copy(pos);
    this.targetYawRotation = yawToThreeRotationY(yaw);
    this.targetPitch = pitch;
  }

  update(opts: TankUpdateOpts = {}): void {
    const dtMs = opts.dtMs ?? 16;
    const nowMs = opts.nowMs ?? performance.now();
    this.lastPosAlpha = expAlpha(dtMs, POS_INTERP_MS);

    let desiredThreeYaw = this.targetYawRotation;
    let desiredPitch = this.targetPitch;
    let rotTau = ROT_INTERP_MS;

    if (opts.isSelf) {
      const elapsedSec = (nowMs - this.serverPoseAtMs) / 1000;
      const oneWaySec = Math.max(SERVER_TICK_SEC, (opts.pingMs ?? 0) / 2000);
      const turnCap = oneWaySec + SERVER_TICK_SEC;

      if (opts.turnAxis) {
        this.leadSec = Math.min(elapsedSec, turnCap);
        this.aimYaw = this.targetServerYaw + opts.turnAxis * TURN_RATE_RAD_S * this.leadSec;
        desiredThreeYaw = yawToThreeRotationY(this.aimYaw);
        rotTau = ROT_INTERP_TURN_MS;
      } else {
        this.leadSec = 0;
        this.aimYaw = this.targetServerYaw;
        desiredThreeYaw = this.targetYawRotation;
        rotTau = ROT_INTERP_IDLE_MS;
      }

      if (opts.aimAxis) {
        const pitchLead = Math.min(elapsedSec, turnCap);
        desiredPitch = this.targetServerPitch + opts.aimAxis * PITCH_RATE_RAD_S * pitchLead;
        desiredPitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, desiredPitch));
      }
    } else {
      this.leadSec = 0;
      this.aimYaw = this.targetServerYaw;
    }

    this.lastRotAlpha = expAlpha(dtMs, rotTau);
    this.group.position.lerp(this.targetPos, this.lastPosAlpha);
    this.currentYawRotation = shortestAngleLerp(
      this.currentYawRotation,
      desiredThreeYaw,
      this.lastRotAlpha,
    );
    this.currentPitch += (desiredPitch - this.currentPitch) * this.lastRotAlpha;
    this.group.rotation.y = this.currentYawRotation;
    this.turret.rotation.z = this.currentPitch;
  }

  get position(): THREE.Vector3 {
    return this.group.position;
  }

  get yawRotation(): number {
    return this.currentYawRotation;
  }

  getRenderStats(): TankRenderStats {
    return {
      serverYaw: this.targetServerYaw,
      renderYaw: -this.currentYawRotation,
      aimYaw: this.aimYaw,
      pitch: this.currentPitch,
      posAlpha: this.lastPosAlpha,
      rotAlpha: this.lastRotAlpha,
      lastServerSnapRad: this.lastServerSnapRad,
      leadSec: this.leadSec,
    };
  }

  dispose(): void {
    this.nameLabel.dispose();
    const disposedMats = new Set<THREE.Material>();
    const shared = new Set<THREE.Material>([TRACK, RUBBER, GUN_METAL, DARK]);
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (shared.has(m) || disposedMats.has(m)) continue;
          disposedMats.add(m);
          m.dispose();
        }
      }
    });
  }
}
