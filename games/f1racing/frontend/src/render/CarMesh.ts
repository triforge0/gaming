import * as THREE from 'three';
import { expAlpha, lerpYaw, parseColor, setFromServer, yawToThreeRotationY } from './coords';

const DARK = new THREE.MeshStandardMaterial({ color: 0x14161c, roughness: 0.5, metalness: 0.4 });
const CARBON = new THREE.MeshStandardMaterial({ color: 0x0c0e12, roughness: 0.55, metalness: 0.3 });
const TYRE = new THREE.MeshStandardMaterial({ color: 0x121317, roughness: 0.92, metalness: 0.02 });
const RIM = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, roughness: 0.3, metalness: 0.85 });
const HALO = new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.4, metalness: 0.6 });
const WHEEL_RADIUS = 0.42;

interface CarShape {
  length: number;
  rearWingWidth: number;
  rearWingHeight: number;
}

function shapeForCarId(carId: string): CarShape {
  switch (carId) {
    case 'formula-classic':
      return { length: 4.8, rearWingWidth: 1.7, rearWingHeight: 0.7 };
    case 'formula-ev':
      return { length: 4.4, rearWingWidth: 1.9, rearWingHeight: 0.5 };
    case 'formula-prototype':
      return { length: 4.6, rearWingWidth: 2.1, rearWingHeight: 0.95 };
    default:
      return { length: 4.6, rearWingWidth: 1.9, rearWingHeight: 0.75 };
  }
}

export class CarMesh {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly wheels: THREE.Group[] = [];
  private readonly flame = new THREE.Group();
  private readonly target = new THREE.Vector3();
  private readonly renderPos = new THREE.Vector3();
  private readonly disposables: Array<{ dispose: () => void }> = [];
  private targetYaw = 0;
  private renderYaw = 0;
  private initialized = false;
  private speed = 0;
  private wheelSpin = 0;
  private boosting = false;
  private lastNitro = 1;
  private flameT = 0;
  private revving = false;

  constructor(carId: string, primaryColor: string, displayName: string, isSelf: boolean) {
    const shape = shapeForCarId(carId);
    const livery = new THREE.MeshStandardMaterial({
      color: parseColor(primaryColor),
      roughness: 0.3,
      metalness: 0.5,
    });
    this.disposables.push(livery);

    this.buildBody(shape, livery);
    this.buildWheels(shape);
    this.buildFlame(shape);
    this.root.add(this.body);

    if (!isSelf) {
      const label = this.makeLabel(displayName, primaryColor);
      label.position.set(0, 3.1, 0);
      this.root.add(label);
    }
  }

  private mesh(geom: THREE.BufferGeometry, mat: THREE.Material, cast = true): THREE.Mesh {
    const m = new THREE.Mesh(geom, mat);
    m.castShadow = cast;
    m.receiveShadow = true;
    this.disposables.push(geom);
    return m;
  }

  private buildBody(shape: CarShape, livery: THREE.MeshStandardMaterial): void {
    const half = shape.length / 2;

    // Monocoque: tapered floor + raised cockpit tub.
    const floor = this.mesh(new THREE.BoxGeometry(shape.length, 0.28, 1.5), CARBON);
    floor.position.set(0, 0.36, 0);
    this.body.add(floor);

    const tub = this.mesh(new THREE.BoxGeometry(shape.length * 0.62, 0.55, 1.0), livery);
    tub.position.set(-0.1, 0.72, 0);
    this.body.add(tub);

    // Nose cone tapering to the front wing.
    const nose = this.mesh(new THREE.ConeGeometry(0.42, 1.9, 4), livery);
    nose.rotation.z = -Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.position.set(half + 0.3, 0.5, 0);
    this.body.add(nose);

    // Sidepods.
    for (const z of [0.72, -0.72]) {
      const pod = this.mesh(new THREE.BoxGeometry(1.9, 0.5, 0.55), livery);
      pod.position.set(-0.2, 0.6, z);
      this.body.add(pod);
    }

    // Airbox / engine cover behind the cockpit.
    const airbox = this.mesh(new THREE.BoxGeometry(1.8, 0.7, 0.5), livery);
    airbox.position.set(-1.0, 0.98, 0);
    this.body.add(airbox);
    const intake = this.mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.4, 8), DARK);
    intake.position.set(-0.2, 1.15, 0);
    this.body.add(intake);

    // Cockpit + helmet + halo.
    const helmet = this.mesh(new THREE.SphereGeometry(0.26, 12, 10), DARK);
    helmet.position.set(0.05, 1.12, 0);
    this.body.add(helmet);
    const halo = this.mesh(new THREE.TorusGeometry(0.42, 0.06, 8, 16, Math.PI), HALO);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0.15, 1.2, 0);
    this.body.add(halo);
    const haloStrut = this.mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), HALO);
    haloStrut.position.set(0.55, 1.05, 0);
    this.body.add(haloStrut);

    // Front wing + endplates.
    const frontWing = this.mesh(new THREE.BoxGeometry(0.6, 0.08, 2.3), CARBON);
    frontWing.position.set(half + 0.9, 0.3, 0);
    this.body.add(frontWing);
    for (const z of [1.15, -1.15]) {
      const plate = this.mesh(new THREE.BoxGeometry(0.7, 0.4, 0.06), livery);
      plate.position.set(half + 0.9, 0.42, z);
      this.body.add(plate);
    }

    // Rear wing on twin endplates.
    for (const z of [shape.rearWingWidth / 2, -shape.rearWingWidth / 2]) {
      const plate = this.mesh(new THREE.BoxGeometry(0.6, shape.rearWingHeight + 0.3, 0.06), CARBON);
      plate.position.set(-half + 0.1, 0.95 + shape.rearWingHeight / 2, z);
      this.body.add(plate);
    }
    const rearWing = this.mesh(new THREE.BoxGeometry(0.7, 0.1, shape.rearWingWidth), livery);
    rearWing.position.set(-half + 0.1, 0.98 + shape.rearWingHeight, 0);
    this.body.add(rearWing);
    const beamWing = this.mesh(new THREE.BoxGeometry(0.4, 0.08, shape.rearWingWidth * 0.8), CARBON);
    beamWing.position.set(-half + 0.15, 0.78, 0);
    this.body.add(beamWing);
  }

  private buildWheels(shape: CarShape): void {
    const half = shape.length / 2;
    const positions: Array<[number, number]> = [
      [half - 0.55, 0.92],
      [half - 0.55, -0.92],
      [-half + 0.75, 0.98],
      [-half + 0.75, -0.98],
    ];
    for (const [x, z] of positions) {
      const pivot = new THREE.Group();
      pivot.position.set(x, WHEEL_RADIUS, z);
      const tyre = this.mesh(new THREE.CylinderGeometry(WHEEL_RADIUS, WHEEL_RADIUS, 0.42, 16), TYRE);
      tyre.rotation.x = Math.PI / 2;
      pivot.add(tyre);
      const rim = this.mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.44, 10), RIM, false);
      rim.rotation.x = Math.PI / 2;
      pivot.add(rim);
      this.wheels.push(pivot);
      this.body.add(pivot);
    }
  }

  private buildFlame(shape: CarShape): void {
    const half = shape.length / 2;
    const inner = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 1.1, 10),
      new THREE.MeshBasicMaterial({ color: 0xaad4ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    const outer = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 1.7, 10),
      new THREE.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    for (const cone of [inner, outer]) {
      cone.rotation.z = Math.PI / 2; // point backward (-X)
      this.disposables.push(cone.geometry, cone.material as THREE.Material);
      this.flame.add(cone);
    }
    this.flame.position.set(-half - 0.2, 0.5, 0);
    this.flame.visible = false;
    this.body.add(this.flame);
  }

  pushServer(x: number, y: number, z: number, yaw: number): void {
    setFromServer(this.target, x, y, z);
    this.targetYaw = yawToThreeRotationY(yaw);
    if (!this.initialized) {
      this.renderPos.copy(this.target);
      this.renderYaw = this.targetYaw;
      this.root.position.copy(this.renderPos);
      this.root.rotation.y = this.renderYaw;
      this.initialized = true;
    }
  }

  setTelemetry(speed: number, nitro: number): void {
    this.speed = speed;
    this.boosting = nitro < this.lastNitro - 0.0006;
    this.lastNitro = nitro;
  }

  /** Idle engine shudder while the driver holds throttle on the grid during the countdown. */
  setRevving(on: boolean): void {
    this.revving = on;
  }

  update(dtMs: number): void {
    if (!this.initialized) return;
    const posAlpha = expAlpha(dtMs, 90);
    this.renderPos.lerp(this.target, posAlpha);
    this.renderYaw = lerpYaw(this.renderYaw, this.targetYaw, dtMs, 70);
    this.root.position.copy(this.renderPos);
    this.root.rotation.y = this.renderYaw;

    if (this.revving) {
      this.root.position.x += (Math.random() - 0.5) * 0.03;
      this.root.position.z += (Math.random() - 0.5) * 0.03;
      this.root.rotation.y += (Math.random() - 0.5) * 0.01;
    }

    const dtSec = dtMs / 1000;
    this.wheelSpin += (this.speed * dtSec) / WHEEL_RADIUS;
    for (const wheel of this.wheels) wheel.rotation.z = -this.wheelSpin;

    this.flame.visible = this.boosting && this.speed > 10;
    if (this.flame.visible) {
      this.flameT += dtSec * 30;
      const pulse = 0.85 + Math.sin(this.flameT) * 0.15;
      this.flame.scale.set(pulse, 1, pulse);
    }
  }

  worldPosition(out: THREE.Vector3): THREE.Vector3 {
    return out.copy(this.renderPos);
  }

  worldYaw(): number {
    return this.renderYaw;
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
  }

  private makeLabel(text: string, accentColor: string): THREE.Sprite {
    const dpr = 2;
    const width = 260;
    const height = 68;
    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      const label = text.length > 14 ? `${text.slice(0, 13)}…` : text;
      ctx.font = '600 26px Rajdhani, system-ui, sans-serif';
      const textWidth = ctx.measureText(label).width;
      const padX = 22;
      const pillW = Math.min(width - 8, textWidth + padX * 2 + 16);
      const pillH = 40;
      const pillX = (width - pillW) / 2;
      const pillY = (height - pillH) / 2;

      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fillStyle = 'rgba(8, 10, 16, 0.72)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.stroke();

      const dotX = pillX + padX;
      ctx.beginPath();
      ctx.arc(dotX, height / 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();

      ctx.fillStyle = '#f4f6fb';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, dotX + 14, height / 2 + 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false });
    this.disposables.push(texture, material);
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 10;
    sprite.scale.set(3.6, (3.6 * height) / width, 1);
    return sprite;
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
