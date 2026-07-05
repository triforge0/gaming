import * as THREE from 'three';
import { CarMesh } from '../render/CarMesh';
import { TrackMesh } from '../render/TrackMesh';
import { loadTrackDefinition } from '../shared/trackData';
import {
  groupFramesByTick,
  sortedTicks,
  type ReplayDocument,
  type ReplayFrame,
} from './types';

const CAM_DISTANCE = 18;
const CAM_HEIGHT = 8;
const CAM_LERP = 0.1;

export class ReplayScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly trackMesh: TrackMesh;
  private readonly cars = new Map<number, CarMesh>();
  private readonly ticks: number[];
  private readonly grouped: Map<number, ReplayFrame[]>;
  private readonly camTarget = new THREE.Vector3();
  private readonly desiredCam = new THREE.Vector3();
  private running = false;
  private paused = false;
  private playbackSpeed = 1;
  private frameIndex = 0;
  private accumulatorMs = 0;
  private lastTime = 0;
  private orbitView = false;
  private followPlayerId: number | null = null;

  constructor(
    private readonly host: HTMLElement,
    document: ReplayDocument,
  ) {
    const track = loadTrackDefinition(document.trackId);
    this.trackMesh = new TrackMesh(track);
    this.grouped = groupFramesByTick(document.frames);
    this.ticks = sortedTicks(this.grouped);
    this.followPlayerId = document.frames.find((frame) => !frame.bot)?.playerId ?? document.frames[0]?.playerId ?? null;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.background = new THREE.Color(0x090b12);
    this.scene.fog = new THREE.Fog(0x090b12, 100, 420);

    this.camera = new THREE.PerspectiveCamera(68, 1, 0.5, 800);
    this.camera.position.set(0, 40, 40);

    const ambient = new THREE.AmbientLight(0xb8c4e0, 0.45);
    const sun = new THREE.DirectionalLight(0xfff4e6, 1.05);
    sun.position.set(120, 180, 80);
    this.scene.add(ambient, sun, this.trackMesh.group);
    this.host.appendChild(this.renderer.domElement);
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('keydown', this.onKeyDown);
    this.applyTick(0);
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  toggleCameraMode(): void {
    this.orbitView = !this.orbitView;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  dispose(): void {
    this.running = false;
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.onKeyDown);
    this.renderer.dispose();
    this.host.removeChild(this.renderer.domElement);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'KeyC') {
      this.toggleCameraMode();
    }
  };

  private resize = (): void => {
    const width = this.host.clientWidth || window.innerWidth;
    const height = this.host.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  };

  private loop = (now: number): void => {
    if (!this.running) return;
    const dtMs = Math.min(100, now - this.lastTime);
    this.lastTime = now;
    if (!this.paused && this.ticks.length > 1) {
      this.accumulatorMs += dtMs * this.playbackSpeed;
      const stepMs = 1000 / 20;
      while (this.accumulatorMs >= stepMs && this.frameIndex < this.ticks.length - 1) {
        this.accumulatorMs -= stepMs;
        this.frameIndex += 1;
        this.applyTick(this.frameIndex);
      }
    }
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop);
  };

  private applyTick(index: number): void {
    const tick = this.ticks[Math.max(0, Math.min(index, this.ticks.length - 1))];
    const frames = this.grouped.get(tick) ?? [];
    const live = new Set<number>();
    for (const frame of frames) {
      live.add(frame.playerId);
      const isSelf = frame.playerId === this.followPlayerId;
      let mesh = this.cars.get(frame.playerId);
      if (!mesh) {
        mesh = new CarMesh(frame.carId, frame.primaryColor, frame.displayName, isSelf);
        this.cars.set(frame.playerId, mesh);
        this.scene.add(mesh.root);
      }
      mesh.pushServer(frame.x, frame.y, frame.z, frame.yaw);
      mesh.update(50);
    }
    for (const [playerId, mesh] of this.cars) {
      if (live.has(playerId)) continue;
      this.scene.remove(mesh.root);
      this.cars.delete(playerId);
    }
  }

  private updateCamera(): void {
    const followId = this.followPlayerId;
    const follow = followId == null ? undefined : this.cars.get(followId);
    if (!follow) {
      this.camera.lookAt(0, 0, 0);
      return;
    }
    follow.worldPosition(this.camTarget);
    const yaw = follow.worldYaw();
    const distance = this.orbitView ? 28 : CAM_DISTANCE;
    const height = this.orbitView ? 16 : CAM_HEIGHT;
    this.desiredCam.set(
      this.camTarget.x - Math.sin(yaw) * distance,
      this.camTarget.y + height,
      this.camTarget.z - Math.cos(yaw) * distance,
    );
    this.camera.position.lerp(this.desiredCam, CAM_LERP);
    this.camera.lookAt(this.camTarget.x, this.camTarget.y + 1.5, this.camTarget.z);
  }
}
