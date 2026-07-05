import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { MatchPhase } from '@triforge/shared-ui';
import type { RaceBridge } from '../net/RaceBridge';
import type { ControlState } from '../input/VehicleInputController';
import { useF1Store } from '../store/f1Store';
import { graphicsProfileFor } from '../settings/graphics';
import { readSettings } from '../settings/storage';
import { loadTrackDefinition } from '../shared/trackData';
import { CarMesh } from './CarMesh';
import { TrackMesh } from './TrackMesh';
import { Environment } from './Environment';

const MAX_SPEED = 85;
const CAM_DISTANCE = 11.5;
const CAM_HEIGHT = 4.3;
const CAM_COCKPIT_HEIGHT = 1.5;
const CAM_LERP = 0.1;
const BASE_FOV = 60;
const SPEED_FOV = 13;

export class SceneRoot {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly cars = new Map<number, CarMesh>();
  private readonly camTarget = new THREE.Vector3();
  private readonly desiredCam = new THREE.Vector3();
  private readonly lookAt = new THREE.Vector3();
  private readonly trackMesh: TrackMesh;
  private readonly composer: EffectComposer | null = null;
  private readonly bloom: boolean;
  private running = false;
  private lastTime = 0;
  private cockpitView = false;
  private fov = BASE_FOV;
  private camReady = false;
  private roll = 0;
  private shakeT = 0;
  private prevPhase = -1;
  private frameErrorLogged = false;
  private readonly input: ControlState = { steer: 0, throttle: 0, brake: 0, handbrake: false, nitro: false };
  private readonly speedLines: HTMLDivElement;

  constructor(
    private readonly host: HTMLElement,
    private readonly bridge: RaceBridge,
    trackId: string,
  ) {
    const track = loadTrackDefinition(trackId);
    const graphics = graphicsProfileFor(readSettings().graphicsQuality);
    this.bloom = graphics.bloom;

    this.renderer = new THREE.WebGLRenderer({ antialias: graphics.antialias, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, graphics.pixelRatioCap));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.shadowMap.enabled = graphics.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.fog = new THREE.Fog(0xbcd0e8, graphics.fogNear, graphics.fogFar);

    this.camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.8, 5000);
    this.camera.position.set(0, 40, 40);

    this.buildSky();
    this.buildLights(graphics.shadows);

    if (graphics.environmentReflections) {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    }

    this.trackMesh = new TrackMesh(track);
    const environment = new Environment(track);
    this.scene.add(this.trackMesh.group, environment.group);

    this.host.appendChild(this.renderer.domElement);

    this.speedLines = document.createElement('div');
    this.speedLines.className = 'speed-lines';
    this.host.appendChild(this.speedLines);

    if (this.bloom) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.22, 0.4, 0.92);
      this.composer.addPass(bloomPass);
      this.composer.addPass(new OutputPass());
    }

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private buildSky(): void {
    const sky = new Sky();
    sky.scale.setScalar(3000);
    const uniforms = sky.material.uniforms;
    uniforms.turbidity.value = 3.2;
    uniforms.rayleigh.value = 2.4;
    uniforms.mieCoefficient.value = 0.004;
    uniforms.mieDirectionalG.value = 0.75;
    const phi = THREE.MathUtils.degToRad(90 - 42); // sun elevation ~42°
    const theta = THREE.MathUtils.degToRad(70);
    uniforms.sunPosition.value.setFromSphericalCoords(1, phi, theta);
    this.scene.add(sky);
  }

  private buildLights(shadows: boolean): void {
    this.scene.add(new THREE.HemisphereLight(0xbcd6ff, 0x4a5738, 0.55));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    const sun = new THREE.DirectionalLight(0xfff2dc, 2.1);
    sun.position.set(120, 150, -90);
    sun.castShadow = shadows;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 600;
    sun.shadow.bias = -0.0004;
    const span = 220;
    sun.shadow.camera.left = -span;
    sun.shadow.camera.right = span;
    sun.shadow.camera.top = span;
    sun.shadow.camera.bottom = -span;
    this.scene.add(sun);
  }

  setCockpitView(enabled: boolean): void {
    this.cockpitView = enabled;
  }

  /** Live driver input, pushed each frame — drives camera lean, the nitro reaction and grid revs. */
  setInputState(state: ControlState): void {
    this.input.steer = state.steer;
    this.input.throttle = state.throttle;
    this.input.brake = state.brake;
    this.input.nitro = state.nitro;
  }

  toggleCameraMode(): void {
    this.cockpitView = !this.cockpitView;
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

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resize);
    this.composer?.dispose();
    this.renderer.dispose();
    this.host.removeChild(this.renderer.domElement);
    this.speedLines.remove();
  }

  private nitroActive(): boolean {
    return this.input.nitro && this.selfNitro() > 0.02 && this.selfSpeed() > 3;
  }

  private selfNitro(): number {
    const entity = this.bridge.world.entities.get(this.bridge.world.selfEntityId);
    return entity?.vehicle?.nitro ?? 0;
  }

  /** Countdown revs, GO! screen shake and the nitro speed-line overlay — all keyed off match phase. */
  private updatePhaseEffects(): void {
    const phase = useF1Store.getState().matchPhase;
    if (this.prevPhase === MatchPhase.COUNTDOWN && phase === MatchPhase.PLAYING) {
      this.shakeT = 0.4;
    }
    this.prevPhase = phase;

    const revving = phase === MatchPhase.COUNTDOWN && this.input.throttle > 0.1;
    const self = this.bridge.world.selfEntityId >= 0
      ? this.cars.get(this.bridge.world.selfEntityId)
      : undefined;
    self?.setRevving(revving);

    this.speedLines.classList.toggle('active', this.nitroActive());
  }

  private resize = (): void => {
    const width = this.host.clientWidth || window.innerWidth;
    const height = this.host.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  };

  private frame = (now: number): void => {
    if (!this.running) return;
    const dtMs = Math.min(100, now - this.lastTime);
    this.lastTime = now;

    // Each step is isolated: a throw in the (non-essential) phase/camera effects must never stop
    // syncCars or render, or every car on screen would freeze.
    try { this.syncCars(dtMs); } catch (err) { this.logFrameError('syncCars', err); }
    try { this.updatePhaseEffects(); } catch (err) { this.logFrameError('updatePhaseEffects', err); }
    try { this.updateCamera(dtMs); } catch (err) { this.logFrameError('updateCamera', err); }
    try {
      if (this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    } catch (err) {
      this.logFrameError('render', err);
    }
    requestAnimationFrame(this.frame);
  };

  private logFrameError(step: string, err: unknown): void {
    if (this.frameErrorLogged) return;
    this.frameErrorLogged = true;
    console.error(`[f1] render frame error in ${step} (loop kept alive):`, err);
  }

  private syncCars(dtMs: number): void {
    const { world } = this.bridge;
    const liveIds = new Set<number>();

    for (const [entityId, entity] of world.entities) {
      if (!entity.position || !entity.orientation) continue;
      liveIds.add(entityId);

      const isSelf = entityId === world.selfEntityId;
      const name = entity.player?.name ?? 'Driver';
      const color = entity.vehicle?.primaryColor ?? '#e10600';
      const carId = entity.vehicle?.carId ?? 'formula-modern';

      let mesh = this.cars.get(entityId);
      if (!mesh) {
        mesh = new CarMesh(carId, color, name, isSelf);
        this.cars.set(entityId, mesh);
        this.scene.add(mesh.root);
      }

      mesh.pushServer(
        entity.position.x ?? 0,
        entity.position.y ?? 0,
        entity.position.z ?? 0,
        entity.orientation.yaw ?? 0,
      );
      mesh.setTelemetry(entity.vehicle?.speed ?? 0, entity.vehicle?.nitro ?? 0);
      mesh.update(dtMs);
    }

    for (const [entityId, mesh] of this.cars) {
      if (liveIds.has(entityId)) continue;
      this.scene.remove(mesh.root);
      mesh.dispose();
      this.cars.delete(entityId);
    }
  }

  private selfSpeed(): number {
    const entity = this.bridge.world.entities.get(this.bridge.world.selfEntityId);
    return entity?.vehicle?.speed ?? 0;
  }

  private updateCamera(dtMs: number): void {
    const followId = this.bridge.world.selfEntityId;
    const follow = followId >= 0 ? this.cars.get(followId) : undefined;
    if (!follow) {
      this.camera.lookAt(0, 0, 0);
      return;
    }

    follow.worldPosition(this.camTarget);
    const yaw = follow.worldYaw();
    const speedT = Math.min(1, this.selfSpeed() / MAX_SPEED);
    const nitro = this.nitroActive();
    const nitroPull = nitro ? 1.8 : 0;
    const distance = (this.cockpitView ? 2.4 : CAM_DISTANCE + speedT * 2.5) + nitroPull;
    const height = this.cockpitView ? CAM_COCKPIT_HEIGHT : CAM_HEIGHT;

    this.desiredCam.set(
      this.camTarget.x - Math.sin(yaw) * distance,
      this.camTarget.y + height,
      this.camTarget.z - Math.cos(yaw) * distance,
    );
    const alpha = 1 - Math.pow(1 - CAM_LERP, dtMs / 16.67);
    if (!this.camReady) {
      // Snap in behind the car on the first frame — no disorienting swoop from the spawn point.
      this.camera.position.copy(this.desiredCam);
      this.camReady = true;
    } else {
      this.camera.position.lerp(this.desiredCam, alpha);
    }

    this.lookAt.set(
      this.camTarget.x + Math.sin(yaw) * (this.cockpitView ? 6 : 4),
      this.camTarget.y + (this.cockpitView ? 0.9 : 1.4),
      this.camTarget.z + Math.cos(yaw) * (this.cockpitView ? 6 : 4),
    );
    this.camera.lookAt(this.lookAt);

    // Bank the camera into corners — proportional to steer and speed so it settles on straights.
    const targetRoll = -this.input.steer * speedT * 0.11;
    this.roll += (targetRoll - this.roll) * alpha;
    this.camera.rotateZ(this.roll);

    // Lights-out kick: a short decaying shake when the race goes green.
    if (this.shakeT > 0) {
      this.shakeT = Math.max(0, this.shakeT - dtMs / 1000);
      const amp = this.shakeT * 0.6;
      this.camera.position.x += (Math.random() - 0.5) * amp;
      this.camera.position.y += (Math.random() - 0.5) * amp;
    }

    // Speed-reactive FOV for a sense of acceleration, widened further on nitro.
    const targetFov = BASE_FOV + speedT * SPEED_FOV + (this.cockpitView ? 8 : 0) + (nitro ? 9 : 0);
    this.fov += (targetFov - this.fov) * alpha;
    if (Math.abs(this.camera.fov - this.fov) > 0.05) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }
  }
}
